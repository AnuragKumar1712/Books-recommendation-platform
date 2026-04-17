from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy import distinct

import shutil
import os

from app.database import get_db
from app.models.book import Book as BookModel
from app.models.user_book import UserBook
from app.schemas.book import Book, BookCreate, BookUpdate

from app.dependencies.auth import require_admin, get_current_user
from app.models.user import User
from app.services.recommendation import get_recommendations, get_personalized_recommendations

router = APIRouter(prefix="/books", tags=["Books"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# Get Books (with pagination + filters)
@router.get("/")
def get_books(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1),
    search: Optional[str] = None,
    minRating: Optional[float] = None,
    genre: Optional[str] = None,
    yearRange: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(BookModel)

    # Rating filter
    if minRating is not None:
        query = query.filter(BookModel.rating >= minRating)

    # Genre filter
    if genre and genre != "All":
        query = query.filter(BookModel.genre == genre)

    # Search filter
    if search:
        query = query.filter(
            BookModel.title.ilike(f"%{search}%")
            | BookModel.author.ilike(f"%{search}%")
        )

    total = query.count()

    books = (
        query
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .all()
    )

    total_pages = (total + pageSize - 1) // pageSize

    return {
        "data": books,
        "total": total,
        "totalPages": total_pages,
    }


# Featured Books
@router.get("/featured", response_model=list[Book])
def get_featured_books(db: Session = Depends(get_db)):
    return (
        db.query(BookModel)
        .filter(BookModel.rating >= 3)
        .order_by(BookModel.rating.desc())
        .limit(8)
        .all()
    )


# Get all genres
@router.get("/genres")
def get_all_genres(db: Session = Depends(get_db)):
    genres = (
        db.query(distinct(BookModel.genre))
        .filter(BookModel.genre.isnot(None))
        .all()
    )

    return sorted([g[0] for g in genres if g[0]])


# Route to get user data to it's Dashboard
@router.get("/me/library")
def get_user_library(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user_id = int(current_user["sub"])

    interactions = (
        db.query(UserBook, BookModel)
        .join(BookModel, BookModel.id == UserBook.book_id)
        .filter(UserBook.user_id == user_id)
        .all()
    )

    library = []

    for interaction, book in interactions:
        library.append({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "rating": book.rating,
            "year": book.year,
            "image_url": book.image_url,
            "reading_status": interaction.reading_status,
            "user_rating": interaction.rating
        })

    return library


# Get Book by ID
@router.get("/{book_id}", response_model=Book)
def get_book_by_id(book_id: int, db: Session = Depends(get_db)):
    book = db.query(BookModel).filter(BookModel.id == book_id).first()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    return book


# Get Book Details for each user
@router.get("/{book_id}/detail", response_model=Book)
def get_book_detail(
    book_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Get book
    book = db.query(BookModel).filter(BookModel.id == book_id).first()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    user_id = int(current_user["sub"])

    # Get user interaction
    interaction = (
        db.query(UserBook)
        .filter(
            UserBook.book_id == book_id,
            UserBook.user_id == user_id
        )
        .first()
    )

    # Convert book to dict
    book_data = book.__dict__.copy()

    book_data["reading_status"] = (
        interaction.reading_status if interaction else None
    )
    book_data["user_rating"] = interaction.rating if interaction else None

    return book_data


# Rate Book (User Specific)
@router.patch("/{book_id}/rate")
def rate_book(
    book_id: int,
    rating: float,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    
):
    user_id = int(current_user["sub"])

    interaction = (
        db.query(UserBook)
        
        .filter(
            UserBook.user_id == user_id,
            UserBook.book_id == book_id
        )
        .first()
    )

    if not interaction:
        interaction = UserBook(
            user_id=user_id,
            book_id=book_id,
            rating=rating
        )
        db.add(interaction)
    else:
        interaction.rating = rating

    db.commit()

    return {"message": "Rating saved successfully"}


# Read Status
@router.patch("/{book_id}/status")
def update_reading_status(
    book_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user_id = int(current_user["sub"])

    interaction = (
        db.query(UserBook)
        .filter(
            UserBook.user_id == user_id,
            UserBook.book_id == book_id
        )
        .first()
    )

    # If status = "none" → delete interaction
    if status == "none":
        if interaction:
            db.delete(interaction)
            db.commit()
        return {"message": "Removed from library"}

    # Normal statuses
    if status not in ["want_to_read", "currently_reading", "finished"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    if not interaction:
        interaction = UserBook(
            user_id=user_id,
            book_id=book_id,
            reading_status=status
        )
        db.add(interaction)
    else:
        interaction.reading_status = status

    db.commit()

    return {"message": "Reading status updated"}


@router.get("/me/recommend")
def personalized_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = int(current_user["sub"])

    recs, user_read_titles = get_personalized_recommendations(db, user_id)

    response = []
    example_book = user_read_titles[0] if user_read_titles else "books you liked"

    for b, score in recs:
        score = float(score)

        if score > 0.52:
            category = "Top Picks"
        elif score > 0.48:
            category = "Because You Read Similar"
        else:
            category = "Explore More"

        response.append({
            "id": b.id,
            "title": b.title,
            "author": b.author,
            "image_url": b.image_url,

            "score": round(score, 2),
            "reason": f"Because you read {example_book}",

            "category": category,
            "genre": getattr(b, "genre", "General"),
            "rating": getattr(b, "rating", 4.2),
        })
    return response


# Recommendation 
@router.get("/{book_id}/recommend")
def recommend_books(book_id: int, db: Session = Depends(get_db)):
    recs = get_recommendations(db, book_id)

    return [
        {
            "id": b.id,
            "title": b.title,
            "author": b.author,
            "image_url": b.image_url,
            "genre": getattr(b, "genre", "General"),
            "rating": getattr(b, "rating", 4.2),
        }
        for b in recs
    ]


# Create Book (Admin)
@router.post("/", response_model=Book, dependencies=[Depends(require_admin)])
def create_book(
    title: str = Form(...),
    author: str = Form(...),
    genre: str = Form(...),
    rating: float = Form(...),
    year: int = Form(...),
    description: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    image_path = None

    # Handle image upload
    if file:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image_path = f"http://127.0.0.1:8000/uploads/{file.filename}"

    # Create book
    db_book = BookModel(
        title=title,
        author=author,
        genre=genre,
        rating=rating,
        year=year,
        description=description,
        image_url=image_path,
    )

    db.add(db_book)
    db.commit()
    db.refresh(db_book)

    return db_book


# Update Book (Admin)
@router.put("/{book_id}", response_model=Book, dependencies=[Depends(require_admin)])
def update_book(book_id: int, book: BookUpdate, db: Session = Depends(get_db)):
    db_book = db.query(BookModel).filter(BookModel.id == book_id).first()

    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    for field, value in book.model_dump(exclude_unset=True).items():
        setattr(db_book, field, value)

    db.commit()
    db.refresh(db_book)

    return db_book


# Delete Book (Admin)
@router.delete("/{book_id}", dependencies=[Depends(require_admin)])
def delete_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(BookModel).filter(BookModel.id == book_id).first()

    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    db.delete(db_book)
    db.commit()

    return {"message": "Book deleted successfully"}