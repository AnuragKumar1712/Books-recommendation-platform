from sqlalchemy import Column, Integer, String, Float
from app.database import Base


class UserBook(Base):
    __tablename__ = "user_books"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, index=True)
    book_id = Column(Integer, index=True)

    reading_status = Column(String, default=None)
    rating = Column(Float, nullable=True)