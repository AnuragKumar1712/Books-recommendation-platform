from pydantic import BaseModel
from typing import Optional

class BookBase(BaseModel):
    title: str
    author: str
    genre: str
    rating: float
    year: Optional[int] = None
    image_url: Optional[str] = None
    description: Optional[str] = None


class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None
    rating: Optional[float] = None
    year: Optional[int] = None
    image_url: Optional[str] = None
    description: Optional[str] = None

class Book(BookBase):
    id: int

    # USER SPECIFIC FIELDS
    reading_status: Optional[str] = None
    user_rating: Optional[float] = None

    class Config:
        from_attributes = True
