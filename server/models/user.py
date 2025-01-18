# server/models/user.py

from sqlalchemy import Column, String
from database import Base
from sqlalchemy.orm import relationship
import uuid

class User(Base):
    __tablename__ = 'user'

    id = Column(String(191), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(191), unique=True, nullable=False)
    email = Column(String(191), unique=True, nullable=False)
    first_name = Column(String(191), nullable=True)
    last_name = Column(String(191), nullable=True)

    recipes = relationship("Recipe", back_populates="user", cascade="all, delete")
    folders = relationship("Folder", back_populates="user", cascade="all, delete")
