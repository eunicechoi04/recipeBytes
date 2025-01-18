import torch
import joblib
import spacy
from spacy.language import Language
import utils
import os
import re
from transformers import AutoTokenizer, AutoModelForSequenceClassification

if not os.path.exists("tmp"):
    utils.download_folder_from_s3(
        "extract_instructions_model", "tmp/extract_instructions_model/"
    )

    utils.download_folder_from_s3(
        "ingredient_phrase_ner_model", "tmp/ingredient_phrase_ner_model/"
    )

    utils.download_file_from_s3(
        "ingred_crf_model.pk1",
        "tmp/ingred_crf_model.pk1",
    )

unit_pattern = re.compile(
    "\\b(cups?|tablespoons?|teaspoons?|pounds?|ounces?|quarts?|pints?|liters?|milliliters?|grams?|kilograms?|fluid ounces?)\\b",
    re.IGNORECASE,
)
abbr_pattern = re.compile(
    "\\b(cs?|tbsps?|tsps?|lbs?|ozs?|qts?|pts?|ls?|mls?|gs?|kgs?|fl ozs?)\\b",
    re.IGNORECASE,
)
digit_unit_pattern = re.compile(
    "(\\d+)\\s*(cups?|tablespoons?|teaspoons?|pounds?|ounces?|quarts?|pints?|liters?|milliliters?|grams?|kilograms?|fluid ounces?)",
    re.IGNORECASE,
)
digit_abbr_pattern = re.compile(
    "(\\d+)\\s*(cs?|tbsps?|tsps?|lbs?|ozs?|qts?|pts?|ls?|mls?|gs?|kgs?|fl ozs?)",
    re.IGNORECASE,
)


@Language.component("add_custom_features")
def add_custom_features(doc):
    for token in doc:
        token.set_extension("is_num", getter=lambda token: token.like_num, force=True)
        if (
            token.i > 0
            and doc[token.i - 1]._.is_num
            and (unit_pattern.match(token.text) or abbr_pattern.match(token.text))
        ):
            token.set_extension("contains_common_unit", default=True, force=True)
        elif digit_unit_pattern.match(token.text) or digit_abbr_pattern.match(
            token.text
        ):
            token.set_extension("contains_common_unit", default=True, force=True)
        else:
            token.set_extension("contains_common_unit", default=False, force=True)
    return doc


# config_path = os.path.join("/tmp/extract_instructions_model/", "config.json")
files = os.listdir("tmp/extract_instructions_model/")
for item in files:
    print(item)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = AutoModelForSequenceClassification.from_pretrained(
    "tmp/extract_instructions_model/"
)
tokenizer = AutoTokenizer.from_pretrained("tmp/extract_instructions_model/")
nlp = spacy.load("en_core_web_sm")
ner_model = spacy.load("tmp/ingredient_phrase_ner_model/")
crf = joblib.load("tmp/ingred_crf_model.pk1")


def extract_instructions_from_recipe(cleaned_tokens):
    # Tokenize the cleaned tokens
    inputs = tokenizer(
        cleaned_tokens,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=512,
    )
    inputs = {key: value.to(device) for key, value in inputs.items()}

    # Get model predictions
    with torch.no_grad():
        outputs = model(**inputs)
        predicted_labels = torch.argmax(outputs.logits, dim=1).tolist()

    reverse_label_map = {0: "o", 1: "direction", 2: "category"}
    # Convert predicted labels to their string representation
    predicted_labels_str = [reverse_label_map[label] for label in predicted_labels]

    instructions = []
    for input_text, label in zip(cleaned_tokens, predicted_labels_str):
        if label == "direction":
            instructions.append(input_text)
    return instructions


def extract_ingredient_phrases_from_recipe(cleaned_tokens):
    ingredients = []
    for phrase in cleaned_tokens:
        doc = ner_model(phrase)

        for ent in doc.ents:
            if ent.label_ == "INGREDIENT":
                ingredients.append(ent.text)

    return ingredients


def tag_ingredient_phrases_from_recipe(ingredient_phrases):
    tagged_ingredients = []
    for recipe_phrase in ingredient_phrases:
        recipe_phrase = recipe_phrase.replace("⁄", "/")
        recipe_phrase = utils.cleanUnicodeFractions(recipe_phrase)
        tokens = utils.tokenize(recipe_phrase)
        doc = nlp(" ".join(tokens))
        X_new = [utils.word2features(doc, i) for i in range(len(tokens))]
        predictions = crf.predict([X_new])[0]  # [0] since we passed a single sentence

        # Combine tokens and predictions (to show the entity labels)
        token_labels = list(zip(tokens, predictions))

        # Extract ingredient phrases (group consecutive tokens with entity labels)
        ingredient_components = {
            "quantity": [],
            "range_end": [],
            "unit": [],
            "name": [],
            "comment": [],
        }
        for token, label in token_labels:
            if label == "B-QTY":
                token = utils.unclumpFractions(token)
                ingredient_components["quantity"].append(token)
            elif label == "B-RANGE_END":
                ingredient_components["range_end"].append(token)
            elif label == "B-UNIT":
                ingredient_components["unit"].append(token)
            elif label == "B-NAME":
                ingredient_components["name"].append(token)
            elif label == "B-COMMENT":
                ingredient_components["comment"].append(token)
        
        if not ingredient_components["quantity"] or not ingredient_components["name"]:
            continue

        # Combine the components into a single string
        empty = True
        for key in ingredient_components:
            if len(ingredient_components[key]) > 0:
                empty = False
            ingredient_components[key] = " ".join(ingredient_components[key])

        if not empty:
            tagged_ingredients.append(ingredient_components)
    return tagged_ingredients
