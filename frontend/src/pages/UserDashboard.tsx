import { useEffect, useState } from "react";
import { bookService } from "../services/bookService";
import type { Book } from "../types/book";
import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import { BookOpen, Star, Layers } from "lucide-react";
import ChartCard from "../components/ChartCard";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 10;

  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchBooks = async () => {
      const library = await bookService.getUserLibrary();
      setBooks(library);
    };

    fetchBooks();
  }, []);

  const readBooks = books.filter((b) => b.reading_status === "finished");

  const genreCounts: Record<string, number> = {};
  readBooks.forEach((book) => {
    genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
  });

  let favoriteGenre = "N/A";

  if (Object.keys(genreCounts).length > 0) {
    favoriteGenre = Object.entries(genreCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b,
    )[0];
  }

  const ratedBooks = books.filter((b) => b.user_rating);

  const avgRating =
    ratedBooks.length > 0
      ? (
          ratedBooks.reduce((sum, b) => sum + (b.user_rating ?? 0), 0) /
          ratedBooks.length
        ).toFixed(1)
      : "N/A";

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || book.reading_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage,
  );

  const currentlyReading = books.filter(
    (b) => b.reading_status === "currently_reading",
  ).length;

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
          Welcome, {user?.name}
        </h1>

        <p className="mt-2 text-[var(--color-muted-foreground)]">
          Your reading insights and activity.
        </p>
      </div>

      {/* Stats */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <StatCard
          label="Books Read"
          value={String(readBooks.length)}
          icon={<BookOpen />}
        />

        <StatCard
          label="Avg Rating Given"
          value={String(avgRating)}
          icon={<Star />}
        />

        <StatCard
          label="Favorite Genre"
          value={favoriteGenre}
          icon={<Layers />}
        />

        <StatCard
          label="Currently Reading"
          value={String(currentlyReading)}
          icon={<BookOpen />}
        />
      </section>

      {/* Charts */}
      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Ratings Distribution"
          subtitle="Distribution of book ratings"
        />

        <ChartCard title="Top Genres" subtitle="Most popular genres by count" />

        <ChartCard
          title="Books Over Time"
          subtitle="Publication trend by year"
        />

        <ChartCard
          title="Recommendation Performance"
          subtitle="Click-through & engagement"
        />
      </section>

      {/* User Book activity */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-foreground)]">
          Your Books
        </h2>

        <div className="border border-[var(--color-border)] border border-[var(--color-border)] overflow-hidden">
          <div className="flex justify-between items-center m-2 mb-4 gap-4 flex-wrap">
            {/* LEFT SIDE: Search */}
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm w-64 
              bg-[var(--color-background)]
              text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />

            {/* CENTER: Filters */}
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "All", value: "all" },
                { label: "Finished", value: "finished" },
                { label: "Reading", value: "currently_reading" },
                { label: "Want", value: "want_to_read" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setStatusFilter(filter.value);
                    setCurrentPage(1);
                  }}
                  className={`
          px-3 py-1 rounded-full text-sm border cursor-pointer
          ${
            statusFilter === filter.value
              ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
              : "border-[var(--color-border)] text-[var(--color-muted-foreground)]"
          }
        `}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* RIGHT SIDE: Count */}
            <span className="text-sm text-[var(--color-muted-foreground)]">
              {filteredBooks.length} books
            </span>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-[var(--color-card)] text-[var(--color-muted-foreground)]">
              <tr>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedBooks.map((book) => (
                <tr
                  key={book.id}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-muted)]/20 transition-all duration-200"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/books/${book.id}`}
                      className="text-[var(--color-primary)] font-medium]"
                    >
                      {book.title}
                    </Link>
                  </td>

                  <td className="px-4 py-3">{book.author}</td>

                  <td className="px-4 py-3">⭐ {book.rating}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs
                        ${book.reading_status === "finished" ? "bg-green-500/20 text-green-500" : ""}
                        ${book.reading_status === "currently_reading" ? "bg-blue-500/20 text-blue-500" : ""}
                        ${book.reading_status === "want_to_read" ? "bg-yellow-500/20 text-yellow-500" : ""}`}
                    >
                      {book.reading_status?.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center m-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-[var(--color-muted-foreground)]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </MainLayout>
  );
};

export default UserDashboard;
