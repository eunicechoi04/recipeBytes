# server/models/tag.py

from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from database import Base
from models.recipe_tags import recipe_tags
import uuid

class Tag(Base):
    __tablename__ = 'tag'

    id = Column(String(191), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(191), unique=True, nullable=False)
    
    # Relationship with Recipe via the association table
    recipes = relationship("Recipe", secondary=recipe_tags, back_populates="tags")
