# server/models/recipe_tag.py

from sqlalchemy import Table, Column, String, ForeignKey
from database import Base

recipe_tags = Table(
    'RecipeTags',
    Base.metadata,
    Column('recipe_id', String(191), ForeignKey('recipe.id'), primary_key=True),
    Column('tag_id', String(191), ForeignKey('tag.id'), primary_key=True)
)
