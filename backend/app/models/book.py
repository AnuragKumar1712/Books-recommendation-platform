from sqlalchemy import Column, Integer, String, Float, Text
from app.database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String, index=True)
    genre = Column(String, index=True)
    rating = Column(Float)
    year = Column(Integer)
    image_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    book_metadata = Column(Text)