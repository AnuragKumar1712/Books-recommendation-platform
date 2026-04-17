import { useEffect, useState } from "react";
import type { Book } from "../types/book";
import { bookService } from "../services/bookService";
import BookFilters from "../components/books/BookFilters";
import BookCard from "../components/books/BookCard";
import MainLayout from "../layouts/MainLayout";

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [genreInput, setGenreInput] = useState("All");
  const [minRatingInput, setMinRatingInput] = useState(0);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [minRating, setMinRating] = useState(0);

  const [genres, setGenres] = useState<string[]>([]);

  const applyFilters = () => {
    setPage(1);
    setSearch(searchInput);
    setGenre(genreInput);
    setMinRating(minRatingInput);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getBooks({
          filters: { genre, minRating, yearRange: "All", search },
          page,
          pageSize,
        });

        setBooks(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Failed to fetch books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genre, minRating, search, page]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await bookService.getGenres();
        setGenres(data);
      } catch {
        console.error("Failed to fetch genres");
      }
    };

    fetchGenres();
  }, []);

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
          Explore Books
        </h1>
        <p className="mt-2 text-[var(--color-muted-foreground)]">
          Browse books, apply filters, and discover new reads.
        </p>
      </div>

      {/* Filters */}
      <BookFilters
        genres={genres}
        searchInput={searchInput}
        genreInput={genreInput}
        minRatingInput={minRatingInput}
        onSearchChange={setSearchInput}
        onGenreChange={setGenreInput}
        onRatingChange={setMinRatingInput}
        onApply={applyFilters}
      />

      {/* Results */}
      {loading ? (
        <div className="text-center text-[var(--color-muted-foreground)] py-20">
          Loading books...
        </div>
      ) : books.length === 0 ? (
        <div className="text-center text-[var(--color-muted-foreground)] py-20">
          No books match your search.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-12">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="
            px-4 py-2 text-sm
            border border-[var(--color-border)]
            rounded-lg
            text-[var(--color-foreground)]
            hover:bg-[var(--color-card)]
            transition
            disabled:opacity-40
            "
          >
            Prev
          </button>

          <span className="text-sm text-[var(--color-muted-foreground)]">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="
            px-4 py-2 text-sm
            border border-[var(--color-border)]
            rounded-lg
            text-[var(--color-foreground)]
            hover:bg-[var(--color-card)]
            transition
            disabled:opacity-40
            "
          >
            Next
          </button>
        </div>
      )}
    </MainLayout>
  );
};

export default Books;
