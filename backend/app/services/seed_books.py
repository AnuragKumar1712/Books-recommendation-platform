import pandas as pd
import os
from app.database import SessionLocal
from app.models.book import Book
# from app.services.process_tags import book_tag_map

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
file_path = os.path.join(BASE_DIR, "data", "clean_books.csv")

df = pd.read_csv(file_path)

def seed_books():
    db = SessionLocal()

    try:
        for _, row in df.iterrows():
            metadata = f"{row['title']} {row['author']} {row['genre']} {row['description']}"

            book = Book(
                title=row["title"],
                author=row["author"],
                genre=row["genre"],
                rating=row["rating"],
                year=int(row["year"]) if not pd.isna(row["year"]) else None,
                image_url=row["image_url"],
                description=row["description"],
                book_metadata=metadata
            )

            db.add(book)

        db.commit()
        print("Books inserted successfully!")

    except Exception as e:
        print("❌ Error:", e)
        db.rollback()

    finally:
        db.close()


if __name__ == "__main__":
    seed_books()