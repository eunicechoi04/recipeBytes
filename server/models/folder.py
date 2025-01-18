# server/models/folder.py

from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.sql import func
import uuid

class Folder(Base):
    __tablename__ = 'folder'

    id = Column(String(191), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(191), nullable=False)
    created_at = Column(DateTime, default=func.now())
    user_id = Column(String(191), ForeignKey('user.id'))

    user = relationship("User", back_populates="folders")
    recipes = relationship("Recipe", back_populates="folder", cascade="all, delete")
