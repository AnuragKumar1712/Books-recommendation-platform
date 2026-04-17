import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getImageUrl } from "../utils/image";
import { bookService } from "../services/bookService";
import type { Book } from "../types/book";
import HorizontalScroll from "../components/HorizontalScroll";
import { useNavigate } from "react-router-dom";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await bookService.getPersonalizedRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const groupedRecommendations = recommendations.reduce(
    (acc: Record<string, Book[]>, book) => {
      const key = book.category || "Top Picks";

      if (!acc[key]) acc[key] = [];
      acc[key].push(book);

      return acc;
    },
    {},
  );

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
          Book Recommendations
        </h1>

        <p className="mt-2 text-[var(--color-muted-foreground)]">
          Personalized suggestions powered by your reading behavior and data
          insights.
        </p>
      </div>

      {/* Explanation Card */}
      <section
        className="
        bg-[var(--color-card)]
        border border-[var(--color-border)]
        rounded-xl
        p-6
        literary-shadow
        mb-12
        "
      >
        <h2 className="text-lg font-semibold text-[var(--color-card-foreground)]">
          How recommendations work
        </h2>

        <p className="mt-3 text-sm text-[var(--color-muted-foreground)] leading-relaxed">
          Recommendations are generated using similarity scores, user
          preferences, ratings, and genre patterns. Each suggestion is ranked
          based on how closely it matches your reading behavior.
        </p>
      </section>

      {/* Recommendations */}
      {loading ? (
        // <div className="text-center py-20 text-[var(--color-muted-foreground)]">
          <section className="space-y-10 p-5">
            {[1, 2, 3].map((section) => (
              <div key={section}>
                {/* Section Title Skeleton */}
                <div className="h-6 w-40 skeleton mb-4" />

                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="min-w-[200px]">
                      <div className="p-4 rounded-xl border border-[var(--color-border)]">
                        {/* Image Skeleton */}
                        <div className="h-[160px] skeleton mb-4 rounded-lg" />

                        {/* Title */}
                        <div className="h-4 skeleton mb-2 w-3/4" />

                        {/* Author */}
                        <div className="h-3 skeleton mb-2 w-1/2" />

                        {/* Meta */}
                        <div className="flex justify-between mt-3">
                          <div className="h-3 w-12 skeleton" />
                          <div className="h-3 w-8 skeleton" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        // </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-muted-foreground)]">
          No recommendations available yet.
        </div>
      ) : (
        <section className="space-y-10">
          {Object.entries(groupedRecommendations).map(([section, books]) => (
            <div key={section}>
              {/* Section Title */}
              <h2 className="text-xl font-semibold text-[var(--color-card-foreground)] mb-4">
                🔥 {section}
              </h2>

              <HorizontalScroll>
                {books.map((book, index) => (
                  <div
                    key={book.id}
                    className="min-w-[200px] max-w-[200px] cursor-pointer"
                  >
                    <div
                      onClick={() => navigate(`/books/${book.id}`)}
                      className="
                      relative
                      flex flex-col
                      h-[350px]
                      bg-[var(--color-card)]
                      border border-[var(--color-border)]
                      rounded-xl
                      p-4
                      literary-shadow
                      book-hover
                      transition
                      transform hover:scale-95 hover:shadow-xl duration-300
                      "
                    >
                      {/* Match Badge */}
                      {book.score && (
                        <span className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] px-2 py-1 rounded-full shadow-md">
                          {Math.round(book.score * 100)}%
                        </span>
                      )}

                      {/* Image */}
                      <div className="h-[160px] mb-4 rounded-lg overflow-hidden bg-[var(--color-background)] border border-[var(--color-border)]">
                        {book.image_url ? (
                          <img
                            src={getImageUrl(book.image_url)}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-sm text-[var(--color-muted-foreground)]">
                            No Image
                          </div>
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

                      {/* Reason */}
                      {book.reason && index === 0 && (
                        <div className="mt-2 px-2 py-1 rounded-md bg-[var(--color-muted)] text-[10px] text-[var(--color-muted-foreground)] italic">
                          {book.reason}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="mt-auto flex justify-between items-center pt-3 text-sm">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                          {book.genre}
                        </span>

                        <span className="px-2 py-0.5 rounded-md bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                          ⭐ {book.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </HorizontalScroll>
            </div>
          ))}
        </section>
      )}
    </MainLayout>
  );
};

export default Recommendations;
