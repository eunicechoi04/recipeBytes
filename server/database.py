from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from config import DATABASE_URL

# Create the engine to connect to MySQL
engine = create_engine(DATABASE_URL, echo=True)  # echo=True will log SQL queries to the console

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models to inherit from
Base = declarative_base()
# Base.metadata.create_all(bind=engine)

def get_db():
    """
    Dependency that yields a session.
    This is usually used in FastAPI or any web framework
    to get the session from a route handler.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
