from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db
import model_utils
import utils
from uuid import uuid4
from services.user.createUser import create_user_service
from services.user.updateUser import update_user_service
from services.user.getUser import get_user_service
from services.recipe.saveRecipe import save_recipe_service
from services.recipe.getUserRecipes import get_user_recipes_service
from services.recipe.getRecipe import get_recipe_service

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Hello, World!"})


@app.route("/api/processlink", methods=["POST"])
def process_link():
    data = request.get_json()
    url = data.get("link")

    if "instagram.com" in url:
        if not utils.check_valid_instagram_link(url):
            return jsonify({"error": "Invalid Instagram link"}), 400
        metadata = utils.get_instagram_post_data(url)
        caption = metadata.get("caption")
        transcript = metadata.get("transcript", "")
        recipe = utils.recipe_body(caption, transcript)
        output = utils.prompt(recipe)
        # cleaned_tokens = utils.clean_recipe(recipe)
        # instructions = model_utils.extract_instructions_from_recipe(cleaned_tokens)
        # ingredients = model_utils.extract_ingredient_phrases_from_recipe(cleaned_tokens)
        instructions = output.get("instructions")
        ingredients = output.get("ingredients")
        tagged_ingredients = model_utils.tag_ingredient_phrases_from_recipe(ingredients)

        recipe_id = str(uuid4())
        return jsonify(
            {
                "recipe_id": recipe_id,
                "url": url,
                "thumbnail": metadata.get("thumbnail"),
                "embed_link": metadata.get("video_url") or "",
                "caption": caption,
                "transcript": transcript,
                "output": output,
                "recipe": recipe,
                "instructions": instructions,
                "ingredients": ingredients,
                "tagged_ingredients": tagged_ingredients,
            }
        )
    return jsonify(data)

@app.route('/api/createUser', methods=['POST'])
def create_user():
    db = next(get_db())
    data = request.get_json().get('user')
    return create_user_service(db, data)

@app.route('/api/updateUser', methods=['POST'])
def update_user():
    db = next(get_db())
    data = request.get_json().get('user')
    return update_user_service(db, data)

@app.route('/api/getUser/<username>', methods=['GET'])
def get_user(username):
    db = next(get_db())
    return get_user_service(db, username)


@app.route('/api/saveRecipe', methods=['POST'])
def save_recipe():
    db = next(get_db())
    data = request.get_json()
    return save_recipe_service(db, data)

@app.route('/api/getRecipes/<user_id>', methods=['GET'])
def get_recipes(user_id):
    db = next(get_db())
    return get_user_recipes_service(db, user_id)

@app.route('/api/getRecipe/<recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    db = next(get_db())
    return get_recipe_service(db, recipe_id)

if __name__ == "__main__":
    app.run(debug=True, port=8080)