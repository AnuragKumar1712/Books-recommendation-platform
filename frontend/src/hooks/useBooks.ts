import { useEffect, useState } from "react";
import { bookService } from "../services/bookService";
import type { Book, BookFilters } from "../types/book";

interface UseBooksParams {
  filters: BookFilters;
  page: number;
  pageSize: number;
}

export const useBooks = ({ filters, page, pageSize }: UseBooksParams) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookService.getBooks({
        filters,
        page,
        pageSize,
      });

      setBooks(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, pageSize]);

  return {
    books,
    totalPages,
    loading,
    error,
    refetch: fetchBooks,
  };
};
