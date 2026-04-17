import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { bookService } from "../../services/bookService";
import type { Book } from "../../types/book";
import { Link } from "react-router-dom";

const FeaturedCarousel = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: { perView: 4, spacing: 16 },
    breakpoints: {
      "(max-width: 768px)": { slides: { perView: 1.5 } },
      "(max-width: 1024px)": { slides: { perView: 3 } },
    },
  });

  useEffect(() => {
    bookService.getFeaturedBooks().then(setBooks);
  }, []);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-(--color-foreground) mb-4">
        Featured Books
      </h2>

      <div ref={sliderRef} className="keen-slider" key={books.length}>
        {books.map((book) => (
          <div key={book.id} className="keen-slider__slide">
            <Link to={`/books/${book.id}`}>
              <div className="bg-(--color-card) border border-(--color-border) rounded-xl p-4 book-shadow book-hover literary-transition">
                {book.image_url ? (
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="h-78 w-full object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="h-48 bg-gray-100 rounded-lg mb-3" />
                )}

                <h3 className="font-semibold text-sm line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-(--color-muted-foreground)">
                  {book.author}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/books"
          className="inline-block px-6 py-3 text-sm font-medium rounded-lg bg-linear-to-r from-blue-500 to-violet-500 text-white hover:scale-105 hover:shadow-lg transition"
        >
          View All Books
        </Link>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
