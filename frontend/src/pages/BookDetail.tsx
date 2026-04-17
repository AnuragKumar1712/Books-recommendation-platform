import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { bookService } from "../services/bookService";
import type { Book } from "../types/book";
import { getImageUrl } from "../utils/image";

const BookDetail = () => {
  const { id } = useParams();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<"login" | "not_found" | null>(null);

  const [userRating, setUserRating] = useState<number | null>(null);

  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [similarLoading, setSimilarLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await bookService.getBookDetail(Number(id));

        setBook(data);
        setUserRating(data.user_rating ?? null);
      } catch (err: any) {
        console.error("Error:", err);

        if (err.message === "401") {
          setError("login");
        } else if (err.message === "404") {
          setError("not_found");
        } else {
          setError("not_found");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleRating = async (rating: number) => {
    if (!book) return;

    try {
      await bookService.rateBook(book.id, rating);
      setUserRating(rating);
    } catch {
      console.error("Failed to rate book");
    }
  };

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        setSimilarLoading(true);
        const data = await bookService.getSimilarBooks(Number(id));
        setSimilarBooks(data);
      } catch (error) {
        console.error("Failed to fetch similar books", error);
      } finally {
        setSimilarLoading(false);
      }
    };

    fetchSimilar();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-3">
          {/* Image Skeleton */}
          <div className="h-[300px] skeleton rounded-xl" />

          {/* Details Skeleton */}
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 skeleton w-2/3 rounded" />
            <div className="h-4 skeleton w-1/3 rounded" />

            <div className="flex gap-3 mt-4">
              <div className="h-6 w-20 skeleton rounded-full" />
              <div className="h-6 w-16 skeleton rounded-full" />
            </div>

            <div className="h-24 skeleton rounded mt-6" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error === "login") {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <p className="text-xl font-semibold text-[var(--color-foreground)]">
            🔐 Please login to view book details
          </p>

          <p className="text-[var(--color-muted-foreground)] mt-2">
            You need to be logged in to access this page.
          </p>

          <Link
            to="/login"
            className="inline-block mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
          >
            Go to Login
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (!book || error === "not_found") {
    return (
      <MainLayout>
        <div className="text-center py-20 text-[var(--color-muted-foreground)]">
          Book not found.
        </div>
      </MainLayout>
    );
  }

  const handleStatusChange = async (status: string) => {
    if (!book) return;

    try {
      await bookService.updateReadingStatus(book.id, status);

      setBook({
        ...book,
        reading_status: status === "none" ? undefined : status,
      });
    } catch {
      console.error("Failed to update reading status");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-3">
        {/* Image */}
        <div className="md:col-span-1">
          {book.image_url ? (
            <img
              src={book.image_url}
              alt={book.title}
              className="rounded-xl book-shadow book-hover w-full"
            />
          ) : (
            <div
              className="
              h-64
              bg-[var(--color-card)]
              border border-[var(--color-border)]
              flex items-center justify-center
              rounded-xl
              text-[var(--color-muted-foreground)]
              "
            >
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
            {book.title}
          </h1>

          <p className="mt-2 text-lg text-[var(--color-muted-foreground)]">
            by {book.author}
          </p>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span
              className="
              px-3 py-1
              rounded-full
              bg-[var(--color-primary)]/20
              text-[var(--color-primary)]
              "
            >
              {book.genre}
            </span>

            <span
              className="
              px-3 py-1
              rounded-full
              bg-[var(--color-accent)]/20
              text-[var(--color-accent)]
              "
            >
              ⭐ {book.rating}
            </span>

            {book.year && (
              <span
                className="
                px-3 py-1
                rounded-full
                bg-[var(--color-muted)]/40
                text-[var(--color-muted-foreground)]
                "
              >
                {book.year}
              </span>
            )}
          </div>

          {/* Read Button */}
          <div className="mt-8">
            <select
              value={book?.reading_status ?? "none"}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="
                bg-[var(--color-background)]
                border border-[var(--color-border)]
                rounded-lg
                px-3 py-2
                text-sm
                text-[var(--color-foreground)]
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--color-primary)]
                transition
                cursor-pointer"
            >
              <option
                value="none"
                className="bg-[var(--color-card)] text-[var(--color-foreground)]"
              >
                Status
              </option>

              <option
                value="want_to_read"
                className="bg-[var(--color-card)] text-[var(--color-foreground)]"
              >
                Want to Read
              </option>

              <option
                value="currently_reading"
                className="bg-[var(--color-card)] text-[var(--color-foreground)]"
              >
                Currently Reading
              </option>

              <option
                value="finished"
                className="bg-[var(--color-card)] text-[var(--color-foreground)]"
              >
                Finished
              </option>
            </select>
          </div>

          {/* Rating */}
          <div className="mt-8">
            <p className="text-sm text-[var(--color-muted-foreground)] mb-2">
              Your Rating
            </p>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`text-2xl transition ${
                    userRating && star <= userRating
                      ? "text-yellow-500"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">
              Description
            </h2>

            <p className="text-[var(--color-muted-foreground)] leading-relaxed text-sm">
              {book.description
                ? book.description
                : "No description available for this book."}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Books */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-foreground)]">
          Similar Books
        </h2>

        {/* Skeleton */}
        {similarLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item}>
                <div className="p-3 rounded-xl border border-[var(--color-border)]">
                  <div className="h-[140px] skeleton mb-3 rounded-lg" />
                  <div className="h-4 skeleton mb-2 w-3/4" />
                  <div className="h-3 skeleton mb-2 w-1/2" />
                  <div className="flex justify-between mt-3">
                    <div className="h-3 w-10 skeleton" />
                    <div className="h-3 w-8 skeleton" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Actual Data */
          similarBooks.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {similarBooks.map((book) => (
                <div key={book.id}>
                  <div
                    onClick={() => navigate(`/books/${book.id}`)}
                    className="
                      cursor-pointer
                      flex flex-col
                      h-[300px]
                      bg-[var(--color-card)]
                      border border-[var(--color-border)]
                      rounded-xl
                      p-3
                      transition
                      transform hover:scale-90 hover:shadow-xl duration-300
                    "
                  >
                    {/* Image */}
                    <div className="h-[140px] mb-3 rounded-lg overflow-hidden bg-[var(--color-background)] border border-[var(--color-border)]">
                      {book.image_url ? (
                        <img
                          src={getImageUrl(book.image_url)}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-[var(--color-muted-foreground)]">
                          No Image
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-sm line-clamp-2">
                      {book.title}
                    </h3>

                    <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                      {book.author}
                    </p>

                    <div className="mt-auto flex justify-between items-center pt-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                        {book.genre || "General"}
                      </span>

                      <span className="text-[var(--color-accent)]">
                        ⭐ {book.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </section>
    </MainLayout>
  );
};

export default BookDetail;
