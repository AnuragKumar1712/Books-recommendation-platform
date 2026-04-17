from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from app.ml.model import model
from app.models.book import Book
from app.models.user_book import UserBook

from sqlalchemy import func


def get_recommendations(db, book_id, top_n=5):
    # 1. Fetch books
    books = db.query(Book).all()

    if not books:
        return []

    # 2. Use stored metadata (FAST)
    metadata_list = [
        b.book_metadata if b.book_metadata else f"{b.title} {b.title} {b.author} {b.genre} {b.genre} {b.description or ''}"
        for b in books
    ]

    # 3. Generate embeddings
    embeddings = model.encode(metadata_list)

    # 4. Find book index
    book_ids = [b.id for b in books]

    if book_id not in book_ids:
        return []

    idx = book_ids.index(book_id)

    # 5. Similarity
    similarity_matrix = cosine_similarity(embeddings)
    sim_scores = similarity_matrix[idx]

    # 6. Popularity boost
    popularity_data = (
        db.query(UserBook.book_id, func.count(UserBook.id))
        .group_by(UserBook.book_id)
        .all()
    )

    # Convert to dictionary
    popularity_dict = {book_id: count for book_id, count in popularity_data}

    # Map to books list
    popularity = np.array([
        popularity_dict.get(b.id, 0) for b in books
    ])

    # Normalize
    if popularity.max() > 0:
        popularity = popularity / popularity.max()

    # 7. Final score
    final_scores = 0.7 * sim_scores + 0.3 * popularity

    # 8. Sort
    sorted_indices = np.argsort(final_scores)[::-1]

    # 9. Get top N
    recommendations = []
    for i in sorted_indices:
        if book_ids[i] != book_id:
            recommendations.append(books[i])

        if len(recommendations) >= top_n:
            break

    return recommendations

def get_personalized_recommendations(db, user_id, top_n=10):
    # 1. Get user's books
    user_books = db.query(UserBook).filter(UserBook.user_id == user_id).all()

    if not user_books:
        return []

    book_ids = [ub.book_id for ub in user_books]

    user_book_ids = [ub.book_id for ub in user_books]

    # Fetch full book objects
    user_read_books = db.query(Book).filter(Book.id.in_(user_book_ids)).all()

    # Extract titles
    user_read_titles = [b.title for b in user_read_books]

    # 2. Get all books
    books = db.query(Book).all()

    if not books:
        return []

    # 3. Prepare metadata
    metadata_list = [
        b.book_metadata if b.book_metadata else f"{b.title} {b.title} {b.author} {b.genre} {b.genre} {b.description or ''}"
        for b in books
    ]

    # 4. Generate embeddings
    embeddings = model.encode(metadata_list)

    # 5. Get indices of user books
    all_ids = [b.id for b in books]
    user_indices = [all_ids.index(bid) for bid in book_ids if bid in all_ids]

    if not user_indices:
        return []

    # 6. Compute similarity (average of user books)
    user_vector = np.mean(embeddings[user_indices], axis=0)
    similarities = cosine_similarity([user_vector], embeddings)[0]

    # 7. Remove already read books
    recommendations = []
    sorted_indices = np.argsort(similarities)[::-1]

    for i in sorted_indices:
        if books[i].id not in book_ids:
            score = float(similarities[i])
            recommendations.append((books[i], score))

        if len(recommendations) >= top_n:
            break

    return recommendations, user_read_titles