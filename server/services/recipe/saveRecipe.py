from flask import jsonify
from sqlalchemy.orm import Session
from models.user import User
from models.recipe import Recipe
from models.instruction import Instruction
from models.ingredient import Ingredient
from models.tag import Tag
from datetime import datetime
import traceback

def save_recipe_service(db: Session, data: dict):
    try:
        user_id = data.get('userId')
        user = db.query(User).filter(User.id == user_id).first()
        recipe = data.get('recipeData')
        new_recipe = Recipe(
            id=recipe.get('recipe_id'),
            title=recipe.get('title'),
            link=recipe.get('url'),
            creator=user.username,
            video_url=recipe.get('embed_link'),
            created_at=datetime.now(),
            user_id=user_id,
            folder_id=None,
            user=user,
        )
        instructions_data = recipe.get('instructions', [])
        instructions_data = [instr for instr in instructions_data if instr.strip()]
        for i, instruction_data in enumerate(instructions_data):
            instruction = Instruction(
                order=i,
                content=instruction_data,
                recipe_id=new_recipe.id,
                recipe=new_recipe
            )
            new_recipe.instructions.append(instruction)

        ingredients_data = recipe.get('tagged_ingredients', [])
        for ingredient_data in ingredients_data:
            name = ingredient_data.get('name') if ingredient_data.get('name') else ""
            quantity = ingredient_data.get('quantity') if ingredient_data.get('quantity') else 0
            range_end = ingredient_data.get('range_end') if ingredient_data.get('range_end') else None
            unit = ingredient_data.get('unit', "") or ""
            comment = ingredient_data.get('comment', "") or ""
            ingredient = Ingredient(
                name=name,
                quantity=quantity,
                range_end=range_end,
                unit=unit,
                recipe_id=new_recipe.id,
                comment=comment,
                recipe=new_recipe
            )
            new_recipe.ingredients.append(ingredient)

        db.add(new_recipe)
        db.commit()

        return jsonify({"message": "Recipe created successfully"}), 201
    except Exception as e:
        db.rollback()
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()