import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import AnalysisFilters from "../components/AnalysisFilters";
import Pagination from "../components/Pagination";
import GenreBarChart from "../components/charts/GenreBarChart";
import RatingsBarChart from "../components/charts/RatingsBarChart";
import { useBooks } from "../hooks/useBooks";
import type { BookFilters } from "../types/book";

const ITEMS_PER_PAGE = 10;

const Analysis = () => {
  const [filters, setFilters] = useState<BookFilters>({
    genre: "All",
    minRating: 0,
    yearRange: "All",
    search: "",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleApplyFilters = () => {
    setCurrentPage(1);
  };

  const { books, totalPages, loading, error } = useBooks({
    filters,
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
  });

  const { books: allBooks } = useBooks({
    filters,
    page: 1,
    pageSize: 1000,
  });

  /* ---------- Charts Data ---------- */

  const genreMap = allBooks.reduce<Record<string, number>>((acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {});

  const genreData = Object.entries(genreMap).map(([genre, count]) => ({
    genre,
    count,
  }));

  const ratingBuckets = [
    { range: "0–1", min: 0, max: 1 },
    { range: "1–2", min: 1, max: 2 },
    { range: "2–3", min: 2, max: 3 },
    { range: "3–4", min: 3, max: 4 },
    { range: "4–5", min: 4, max: 5 },
  ];

  const ratingsData = ratingBuckets.map((bucket) => ({
    range: bucket.range,
    count: allBooks.filter(
      (b) => b.rating >= bucket.min && b.rating < bucket.max,
    ).length,
  }));

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
          Book Analysis
        </h1>

        <p className="mt-2 text-[var(--color-muted-foreground)]">
          Search, filter, and analyze book data.
        </p>
      </div>

      {/* Filters */}
      <AnalysisFilters
        filters={filters}
        onChange={setFilters}
        onApply={handleApplyFilters}
      />

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <GenreBarChart data={genreData} />
        <RatingsBarChart data={ratingsData} />
      </section>

      {/* Table */}
      <section
        className="
        bg-[var(--color-card)]
        border border-[var(--color-border)]
        rounded-xl
        literary-shadow
        overflow-hidden
      "
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-card-foreground)]">
            Analyzed Books
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-left font-medium">Author</th>
                <th className="px-6 py-3 text-left font-medium">Genre</th>
                <th className="px-6 py-3 text-left font-medium">Rating</th>
                <th className="px-6 py-3 text-left font-medium">Published</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-muted-foreground)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-center text-red-400"
                  >
                    {error}
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center">
                    No books found
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr
                    key={book.id}
                    className="hover:bg-[var(--color-muted)]/40 transition"
                  >
                    <td className="px-6 py-4 text-[var(--color-card-foreground)]">
                      {book.title}
                    </td>
                    <td className="px-6 py-4">{book.author}</td>
                    <td className="px-6 py-4">{book.genre}</td>
                    <td className="px-6 py-4">{book.rating}</td>
                    <td className="px-6 py-4">{book.year}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex justify-center border-t border-[var(--color-border)]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </MainLayout>
  );
};

export default Analysis;
