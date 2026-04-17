import requests
import time
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.book import Book
from app.database import engine, Base
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")

GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"


def fetch_books(query: str, max_results: int = 40, start_index: int = 0):
    params = {
        "q": query,
        "maxResults": max_results,
        "startIndex": start_index,
        "key": API_KEY,
    }
    response = requests.get(GOOGLE_BOOKS_API, params=params)
    response.raise_for_status()
    return response.json().get("items", [])


def extract_year(published_date: str | None):
    if not published_date:
        return None
    try:
        return int(published_date[:4])
    except:
        return None

def normalize_genre(categories: list[str] | None):
    if not categories:
        return "General"

    category = categories[0].lower()

    if "fiction" in category:
        return "Fiction"
    if "fantasy" in category:
        return "Fantasy"
    if "science" in category:
        return "Science"
    if "history" in category:
        return "History"
    if "technology" in category or "computer" in category:
        return "Technology"
    if "biography" in category:
        return "Biography"

    return "General"

def limit_description(text: str | None, max_words: int = 115):
    if not text:
        return "No description available."

    words = text.split()

    if len(words) <= max_words:
        return text

    return " ".join(words[:max_words]) + "..."


def import_books():
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    total_imported = 0

    queries = [
        "subject:fiction",
        "subject:science",
        "subject:history",
        "subject:fantasy",
        "subject:technology",
    ]

    for query in queries:
        for start in range(0, 200, 40):
            books = fetch_books(query, start_index=start)
            time.sleep(1)  # wait 1 second between requests

            for item in books:
                info = item.get("volumeInfo", {})
                image_links = info.get("imageLinks", {})
                thumbnail = image_links.get("thumbnail")
                if thumbnail:
                    thumbnail = thumbnail.replace("http://", "https://")
                    thumbnail = thumbnail.replace("&zoom=1", "&zoom=2")

                title = info.get("title")
                authors = info.get("authors", [])
                categories = info.get("categories", [])
                rating = info.get("averageRating")
                published_date = info.get("publishedDate")
                raw_description = info.get("description") 
                description = limit_description(raw_description)

                if not title or not authors:
                    continue  # skip bad data
                
                book_metadata = f"{title} {' '.join(authors)} {description} {' '.join(categories)}"

                exists = (
                    db.query(Book)
                    .filter(Book.title == title, Book.author == authors[0])
                    .first()
                )
                if exists:
                    continue

                book = Book(
                    title=title,
                    author=authors[0],
                    genre = normalize_genre(categories),
                    rating=float(rating) if rating else 0.0,
                    year=extract_year(published_date),
                    image_url=thumbnail,
                    description=description,

                    book_metadata=book_metadata,
                )

                db.add(book)
                total_imported += 1

            db.commit()

    db.close()
    print(f"✅ Imported {total_imported} books successfully")


if __name__ == "__main__":
    import_books()
