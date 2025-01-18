# server/models/ingredient.py

from sqlalchemy import Column, String, Float, ForeignKey
from database import Base
from sqlalchemy.orm import relationship
import uuid

class Ingredient(Base):
    __tablename__ = 'ingredient'

    id = Column(String(191), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(191), nullable=False)
    quantity = Column(Float, nullable=False)
    range_end = Column(Float, nullable=True)
    unit = Column(String(191), nullable=True)
    comment= Column(String(191), nullable=True)

    recipe_id = Column(String(191), ForeignKey('recipe.id'))

    recipe = relationship("Recipe", back_populates="ingredients")
    nutrition = relationship("NutritionInfo", back_populates="ingredient", uselist=False, cascade="all, delete")
