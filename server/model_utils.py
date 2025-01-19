import joblib
import spacy
import utils

nlp = spacy.load("en_core_web_sm")
crf = joblib.load("tmp/ingred_crf_model.pk1")

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
