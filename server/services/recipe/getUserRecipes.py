from flask import jsonify
from sqlalchemy.orm import Session
from models.recipe import Recipe

def get_user_recipes_service(db: Session, user_id: str):
    try:
        recipes = db.query(Recipe).filter(Recipe.user_id == user_id).all() 
        recipes_data = [
            {
                "id": recipe.id,
                "title": recipe.title,
                "link": recipe.link,
                "creator": recipe.creator,
                "created_at": recipe.created_at,
                "user_id": recipe.user_id,
                "folder_id": recipe.folder_id,
                "instructions": [
                    {
                        "order": instruction.order,
                        "content": instruction.content
                    } for instruction in recipe.instructions
                ],
                "ingredients": [
                    {
                        "name": ingredient.name,
                        "unit": ingredient.unit,
                        "quantity": ingredient.quantity,
                        "range_end": ingredient.range_end,
                    } for ingredient in recipe.ingredients
                ],
                "nutrition": {
                    "calories": recipe.nutrition.calories,
                    "fat": recipe.nutrition.fat,
                    "protein": recipe.nutrition.protein,
                    "carbs": recipe.nutrition.carbs
                } if recipe.nutrition else None,
                "tags": [tag.name for tag in recipe.tags]
            } for recipe in recipes
        ]
        return jsonify(recipes_data), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()