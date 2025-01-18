# server/models/recipe.py

from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.sql import func
from models.recipe_tags import recipe_tags
import uuid

class Recipe(Base):
    __tablename__ = 'recipe'

    id = Column(String(191), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(191), nullable=False)
    link = Column(String(191), nullable=False)
    creator = Column(String(191), nullable=True)
    video_url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    user_id = Column(String(191), ForeignKey('user.id'))
    folder_id = Column(String(191), ForeignKey('folder.id'))

    user = relationship("User", back_populates="recipes")
    folder = relationship("Folder", back_populates="recipes")
    instructions = relationship("Instruction", back_populates="recipe", cascade="all, delete")
    ingredients = relationship("Ingredient", back_populates="recipe", cascade="all, delete")
    nutrition = relationship("NutritionInfo", back_populates="recipe", uselist=False, cascade="all, delete")
    tags = relationship("Tag", secondary=recipe_tags, back_populates="recipes")