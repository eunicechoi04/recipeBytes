from flask import jsonify
from sqlalchemy.orm import Session
from models.recipe import Recipe

def get_recipe_service(db: Session, id: str):
    try:
        recipe = db.query(Recipe).filter(Recipe.id == id).first()
        recipe_data ={
                "id": recipe.id,
                "title": recipe.title,
                "link": recipe.link,
                "creator": recipe.creator,
                "video_url": recipe.video_url,
                "created_at": recipe.created_at,
                "user_id": recipe.user_id,
                "folder_id": recipe.folder_id,
                "instructions": [instruction.content for instruction in sorted(recipe.instructions, key=lambda x: x.order)
                ],
                "ingredients": [
                    {
                        "name": ingredient.name,
                        "unit": ingredient.unit,
                        "quantity": ingredient.quantity,
                        "range_end": ingredient.range_end,
                        "comment": ingredient.comment
                    } for ingredient in recipe.ingredients
                ],
                "nutrition": {
                    "calories": recipe.nutrition.calories,
                    "fat": recipe.nutrition.fat,
                    "protein": recipe.nutrition.protein,
                    "carbs": recipe.nutrition.carbs
                } if recipe.nutrition else None,
                "tags": [tag.name for tag in recipe.tags]
            }
        return jsonify(recipe_data), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()