# server/models/instruction.py

from sqlalchemy import Column, String, Integer, ForeignKey
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import PrimaryKeyConstraint

class Instruction(Base):
    __tablename__ = 'instruction'

    order = Column(Integer, nullable=False)
    content = Column(String(191), nullable=False)

    recipe_id = Column(String(191), ForeignKey('recipe.id'))

    recipe = relationship("Recipe", back_populates="instructions")

    __table_args__ = (
        PrimaryKeyConstraint('recipe_id', 'order', name='instruction_pk'),
    )