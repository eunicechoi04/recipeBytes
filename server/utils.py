import os
import re
import boto3
import decimal
import instaloader
import requests
import whisper
import json
from moviepy import VideoFileClip
from nltk.tokenize import sent_tokenize
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

s3 = boto3.client("s3")
L = instaloader.Instaloader()
nutrition_url = "https://platform.fatsecret.com/rest/natural-language-processing/v1"

client = OpenAI()
def download_folder_from_s3(s3_folder, local_dir):
    s3_folder_path = "models/" + s3_folder + "/"
    response = s3.list_objects_v2(Bucket="recipebytes-models", Prefix=s3_folder_path)
    for obj in response.get("Contents", []):
        filename = obj["Key"]
        local_path = os.path.join(local_dir, filename[len(s3_folder_path) :])
        os.makedirs(os.path.dirname(local_path), exist_ok=True)

        # Download the file
        s3.download_file("recipebytes-models", filename, local_path)
        print(f"Downloaded {filename} to {local_path}")


def download_file_from_s3(s3_file, local_path):
    s3_filepath = "models/" + s3_file
    s3.download_file("recipebytes-models", s3_filepath, local_path)
    print(f"Downloaded {s3_filepath} to {local_path}")


def clean_recipe(recipe_text):
    lines = recipe_text.split("\n")
    recipe_tokens = []
    for line in lines:
        if line:
            tokens = sent_tokenize(line)  # Tokenize the recipe into sentences
            recipe_tokens.extend(tokens)  # Add the sentences to the list

    cleaned_tokens = [clean_text(token) for token in recipe_tokens]
    return cleaned_tokens


def clean_text(text):
    res = text.lower()
    res = re.sub(
        r"[!]+", "!", res
    )  # Multiple exclamation marks to a single exclamation mark
    res = re.sub(r"[?]+", "?", res)  # Multiple question marks to a single question mark
    res = re.sub(r"[.]+", ".", res)  # Multiple periods to a single period
    res = re.sub(r"\n", "", res)  # Remove newline characters
    res = re.sub(r"\s+", " ", res).strip()
    res = re.sub(
        r"^\s*[\-\*\•]\s*", "", res
    )  # Remove bullet points at the beginning of the text
    res = re.sub(r"[^\w\s!?,+.\/:\[\]{}()\-\*@]", "", res)
    res = re.sub(
        r"\s*\.\s*$", "", res
    )  # Remove periods and whitespace at the end of sentences
    return res


def tokenize(s):
    """
    Tokenize on parenthesis, punctuation, spaces and American units followed by a slash and then tokenize using spacy
    """
    preprocessed_text = preprocess(s)
    print(s, " ----> ", preprocessed_text)
    preprocessed_tokens = [
        normalizeToken(token.strip())
        for token in re.split(r"([,()\s]{1})", preprocessed_text)
        if token and token.strip()
    ]
    return preprocessed_tokens


def word2features(tokens, i):
    """
    Extracts features for token i in the list of tokens
    """
    word = tokens[i]
    features = {
        "word_lower": word.text.lower(),
        "is_digit": word.is_digit,
        "is_stop": word.is_stop,
        "is_fraction": isFraction(word),
        "length_group": lengthGroup(len(word)),
        "prev_word": "" if i == 0 else tokens[i - 1].text,
        "next_word": "" if i == len(tokens) - 1 else tokens[i + 1].text,
        "is_capitalized": word.text[0].isupper(),
        "inside_parenthesis": insideParenthesis(word, tokens),
    }
    return features


def cleanUnicodeFractions(s):
    """
    Replace unicode fractions with ascii representation, preceded by a
    space.

    "1\x215e" => "1 7/8"
    """
    s = str(s)
    fractions = {
        "\x215b": "1/8",
        "\x215c": "3/8",
        "\x215d": "5/8",
        "\x215e": "7/8",
        "\x2159": "1/6",
        "\x215a": "5/6",
        "\x2155": "1/5",
        "\x2156": "2/5",
        "\x2157": "3/5",
        "\x2158": "4/5",
        "\xbc": " 1/4",
        "\xbe": "3/4",
        "\x2153": "1/3",
        "\x2154": "2/3",
        "\xbd": "1/2",
    }

    for f_unicode, f_ascii in fractions.items():
        s = s.replace(f_unicode, " " + f_ascii)

    return s


def clumpFractions(s):
    """
    Replaces the whitespace between the integer and fractional part of a quantity
    with a dollar sign, so it's interpreted as a single token. The rest of the
    string is left alone.

        clumpFractions("aaa 1 2/3 bbb")
        # => "aaa 1$2/3 bbb"
    """

    return re.sub(r"(\d+)\s+(\d)/(\d)", r"\1$\2/\3", s)


def preprocess(s):
    """
    Preprocess the input string to handle abbreviations, slashes, ors, and parens.

    "2 tbsp or 30 milliliters" => "2 tablespoons 30 milliliters"
    "2 1/2 tablespoons (30g)" => "2$1/2 tablespoons 30 grams"
    """

    # standardize "2 tablespoons or 30 mililiters" and "2 tablespoons (30 mililiters)" into "2 tablespoons/30 mililiters"
    s = re.sub(r"(\d+ \w+)\s+or\s+(\d+ \w+)", r"\1/\2", s)
    s = re.sub(r"(\d+ \w+)\s+\((\d+ \w+)\)", r"\1/\2", s)

    # handle metric abbreviation like "100g" by treating it as "100 grams"
    s = re.sub(r"(\d+)\s*gs?(?=\s)", r"\1 grams ", s, flags=re.IGNORECASE)
    s = re.sub(r"(\d+)\s*kgs?", r"\1 kilograms", s, flags=re.IGNORECASE)
    s = re.sub(r"(\d+)\s*ozs?", r"\1 ounces", s, flags=re.IGNORECASE)
    s = re.sub(r"(\d+)\s*mls?", r"\1 milliliters", s, flags=re.IGNORECASE)

    # handle american abbreviations
    s = re.sub(r"(\d+)\s*tsps?", r"\1 teaspoons", s, flags=re.IGNORECASE)
    s = re.sub(r"(\d+)\s*tbsps?", r"\1 tablespoons", s, flags=re.IGNORECASE)
    s = re.sub(r"(\d+)\s*tbs?", r"\1 tablespoons", s, flags=re.IGNORECASE)
    s = re.sub(r"(\d+)\s*fl ozs?", r"\1 fluid ounces", s, flags=re.IGNORECASE)
    s = re.sub(r"(\d+)\s*cs?(?=\s)", r"\1 cups", s, flags=re.IGNORECASE)
    s = re.sub(r"(\d+)\s*lbs?", r"\1 pounds", s, flags=re.IGNORECASE)
    s = re.sub(r"(\d+)\s*ozs?", r"\1 ounces", s, flags=re.IGNORECASE)
    s = re.sub(r"(\d+)\s*pts?", r"\1 pints", s, flags=re.IGNORECASE)
    s = re.sub(r"(\d+)\s*qts?", r"\1 quarts", s, flags=re.IGNORECASE)

    units = [
        "cup",
        "tablespoon",
        "teaspoon",
        "pound",
        "ounce",
        "quart",
        "pint",
        "liter",
        "milliliter",
        "gram",
        "kilogram",
        "fluid ounce",
    ]
    # The following removes slashes following American units and replaces it with a space.
    for unit in units:
        s = s.replace(unit + "/", unit + " ")
        s = s.replace(unit + "s/", unit + "s ")

    return clumpFractions(s)


def normalizeToken(word):
    """
    A poor replacement for the pattern.en singularize function, but ok for now.
    """

    units = {
        "bottles": "bottle",
        "bunches": "bunch",
        "bundles": "bundle",
        "bulbs": "bulb",
        "cans": "can",
        "cloves": "clove",
        "cups": "cup",
        "dashes": "dash",
        "ears": "ear",
        "fillets": "fillet",
        "fluid ounces": "fluid ounce",
        "grams": "gram",
        "heads": "head",
        "jars": "jar",
        "kilograms": "kilogram",
        "liters": "liter",
        "milliliters": "milliliter",
        "ounces": "ounce",
        "pints": "pint",
        "pieces": "piece",
        "pinches": "pinch",
        "pounds": "pound",
        "quarts": "quart",
        "scoops": "scoop",
        "slices": "slice",
        "sprigs": "sprig",
        "sticks": "stick",
        "strips": "strip",
        "stalks": "stalk",
        "tablespoons": "tablespoon",
        "teaspoons": "teaspoon",
    }

    if word in units.keys():
        return units[word]
    else:
        return word


def parseNumbers(s):
    """
    Parses a string that represents a number into a decimal data type so that
    we can match the quantity field in the db with the quantity that appears
    in the display name. Rounds the result to 2 places.
    """
    ss = re.sub(r"\$", " ", s)

    m3 = re.match("^\d+$", ss)
    if m3 is not None:
        return decimal.Decimal(round(float(ss), 2))

    m1 = re.match(r"(\d+)\s+(\d)/(\d)", ss)
    if m1 is not None:
        num = int(m1.group(1)) + (float(m1.group(2)) / float(m1.group(3)))
        return decimal.Decimal(str(round(num, 2)))

    m2 = re.match(r"^(\d)/(\d)$", ss)
    if m2 is not None:
        num = float(m2.group(1)) / float(m2.group(2))
        return decimal.Decimal(str(round(num, 2)))

    return None


def getBestTag(token_tags):
    if len(token_tags) == 1:
        return token_tags[0]
    else:
        for t in token_tags:
            if (t != "B-COMMENT") and (t != "I-COMMENT"):
                return t
    return "O"


def lengthGroup(actualLength):
    """
    Buckets the length of the ingredient into 6 buckets.
    """
    for n in [4, 8, 12, 16, 20]:
        if actualLength < n:
            return n
    return 24


def insideParenthesis(token, doc):
    """
    Returns true if the word is inside parentheses in the phrase.
    token: A spaCy token.
    doc: A spaCy Doc object containing the text.
    """
    if token.text in ["(", ")"]:
        return True

    # Convert the entire doc into a string and check if the token appears inside parentheses.
    line = " ".join([t.text for t in doc])

    # Use regular expression to check if the token is inside parentheses
    return re.match(r".*\(.*" + re.escape(token.text) + ".*\).*", line) is not None


def isFraction(token):
    """
    Returns true if the token is a fraction.
    """
    return (
        re.match(r"^\d+/\d+$", token.text) is not None
        or re.match(r"^\d+\$?\d*/\d+$", token.text) is not None
    )

def check_valid_instagram_link(video_url):
    try:
        response = requests.get(video_url)
        if response.status_code == 200 and ("/p/" in video_url or "/reel/" in video_url):
            return True
        return False
    except:
        return False

def extract_transcript(post):
    # get video
    video_folder = os.path.join('tmp', 'video_metadata')
    L.dirname_pattern = video_folder
    L.download_post(post, target=video_folder)
    video_files = [f for f in os.listdir(video_folder) if f.endswith('.mp4')]
    if video_files:
        video_path = os.path.join(video_folder, video_files[0])
    else:
        raise FileNotFoundError("No .mp4 file found in the 'video' folder")

    # extract audio from video
    video_clip = VideoFileClip(video_path)
    audio_path = os.path.join(video_folder, 'audio.mp3')
    video_clip.audio.write_audiofile(audio_path)
    
    # transcribe
    model = whisper.load_model("base")

    return model.transcribe(audio_path)

def get_instagram_post_data(url):
    shortcode = url.split("/")[-2]
    post = instaloader.Post.from_shortcode(L.context, shortcode)
    metadata = {
        "caption": post.caption,
        "thumbnail_url": post.url,
    }
    if post.is_video:
        metadata["video_url"] = post.video_url
        metadata['transcript'] = extract_transcript(post)
    return metadata


def find_recipe_patterns(text):
    recipe_keywords = [
        r"\d+\s?(cup|tablespoon|teaspoon|ml|g|oz|pound|litre|tbsp|tsp|mg|kg|lb|cl)\b",
        r"pre\s?heat",
        r"ingredients:",
        r"directions:",
        r"steps:",
        r"instructions:",
        r"serves?\s?\d+"
    ] 
    for pattern in recipe_keywords:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False

def recipe_body(captions, transcript):
    """
    Returns most likely source of recipe text from the video metadata
    Returns ingredients and instructions separately
    """
    ingredient_list_patterns = [
        r"ingredients?\s*[:|-]?\s*\n?"
        r"\n\s*(\d+\s*(cup|tablespoon|teaspoon|g|ml|oz|pounds?|liters?|tbsp|tsp|cups?))",  # Newline-separated ingredients
    ]
    if find_recipe_patterns(captions):
        return captions
    if transcript and find_recipe_patterns(transcript):
        return transcript
    return ""

def prompt(text):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that can extract a list of ingredients and instructions from a recipe."},
            {
                "role": "user",
                "content": text
            }
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "recipe",
                "schema": {
                    "type": "object",
                    "properties": {
                        "ingredients": {
                            "type": "array",
                            "description": "A list of ingredients needed for the recipe.",
                            "items": {
                                "type": "string",
                                "description": "Each instruction step."
                            }
                        },
                        "instructions": {
                            "type": "array",
                            "description": "A list of step-by-step instructions for preparing the recipe.",
                            "items": {
                                "type": "string",
                                "description": "Each instruction step."
                            }
                        }
                    },
                    "required": ["ingredients","instructions"],
                    "additionalProperties": False
                },
                "strict": True
            },
        }
    )

    return json.loads(completion.choices[0].message.content)

def unclumpFractions(s):
    """
    Replaces the dollar sign between the integer and fractional part of a quantity
    with a whitespace, reversing the clumpFractions transformation.

        unclumpFractions("aaa 1$2/3 bbb")
        # => "aaa 1 2/3 bbb"
    """
    return re.sub(r"(\d+)\$(\d)/(\d)", r"\1 \2/\3", s)