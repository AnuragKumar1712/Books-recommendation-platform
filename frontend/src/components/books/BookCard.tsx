import { Link } from "react-router-dom";
import type { Book } from "../../types/book";

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link to={`/books/${book.id}`}>
      <div
        className="
        h-full
        flex flex-col
        bg-[var(--color-card)]
        border border-[var(--color-border)]
        rounded-xl
        p-4
        literary-shadow
        book-hover
        literary-transition
        cursor-pointer
        "
      >
        {/* Book Cover */}
        <div
          className="
          h-64
          mb-4
          flex items-center justify-center
          bg-[var(--color-background)]
          border border-[var(--color-border)]
          rounded-lg
          overflow-hidden
          "
        >
          {book.image_url ? (
            <img
              src={book.image_url}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[var(--color-muted-foreground)] text-sm">
              No Image
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[var(--color-card-foreground)] line-clamp-2">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          {book.author}
        </p>

        {/* Meta */}
        <div className="mt-auto flex justify-between items-center text-sm pt-3">
          <span
            className="
            px-2 py-0.5
            rounded-md
            bg-[var(--color-primary)]/20
            text-[var(--color-primary)]
            "
          >
            {book.genre}
          </span>

          <span
            className="
            px-2 py-0.5
            rounded-md
            bg-[var(--color-accent)]/20
            text-[var(--color-accent)]
            "
          >
            ⭐ {book.rating}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
