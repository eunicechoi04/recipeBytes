# server/models/nutrition.py

from sqlalchemy import Column, String, Float, ForeignKey
from database import Base
from sqlalchemy.orm import relationship
import uuid

class NutritionInfo(Base):
    __tablename__ = 'nutritioninfo'

    id = Column(String(191), primary_key=True, default=lambda: str(uuid.uuid4()))
    calories = Column(Float, nullable=False)
    fat = Column(Float, nullable=False)
    protein = Column(Float, nullable=False)
    carbs = Column(Float, nullable=False)
    fiber = Column(Float, nullable=False)
    sugar = Column(Float, nullable=False)

    ingredient_id = Column(String(191), ForeignKey('ingredient.id'), unique=True, nullable=True)
    recipe_id = Column(String(191), ForeignKey('recipe.id'), unique=True, nullable=True)

    ingredient = relationship("Ingredient", back_populates="nutrition")
    recipe = relationship("Recipe", back_populates="nutrition")
