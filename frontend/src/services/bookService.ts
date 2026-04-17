import type { Book } from "../types/book";
import { api } from "./api";

interface GetBooksParams {
  filters: {
    genre: string;
    minRating: number;
    yearRange: string;
    search: string;
  };
  page: number;
  pageSize: number;
}

interface BookPayload {
  title: string;
  author: string;
  genre: string;
  rating: number;
  year: number;
}

export const bookService = {
  getBooks: async ({ filters, page, pageSize }: GetBooksParams) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      genre: filters.genre,
      minRating: String(filters.minRating),
      yearRange: filters.yearRange,
      search: filters.search,
    });

    return api(`/books?${params.toString()}`);
  },

  getGenres: async (): Promise<string[]> => {
    return api<string[]>("/books/genres");
  },

  getFeaturedBooks: async (): Promise<Book[]> => {
    return api<Book[]>("/books/featured");
  },

  getBookById: async (id: number): Promise<Book> => {
    return api<Book>(`/books/${id}`);
  },

  getBookDetail: async (id: number): Promise<Book> => {
    return api<Book>(`/books/${id}/detail`);
  },

  toggleReadStatus: async (id: number): Promise<Book> => {
    return api<Book>(`/books/${id}/toggle-read`, {
      method: "PATCH",
    });
  },

  rateBook: async (id: number, rating: number): Promise<Book> => {
    return api<Book>(`/books/${id}/rate?rating=${rating}`, {
      method: "PATCH",
    });
  },

  addBook: async (book: BookPayload): Promise<Book> => {
    return api<Book>("/books", {
      method: "POST",
      body: JSON.stringify(book),
    });
  },

  updateBook: async (id: number, book: BookPayload): Promise<Book> => {
    return api<Book>(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(book),
    });
  },

  deleteBook: async (id: number): Promise<{ message: string }> => {
    return api<{ message: string }>(`/books/${id}`, {
      method: "DELETE",
    });
  },

  getUserLibrary: async (): Promise<Book[]> => {
    return api<Book[]>("/books/me/library");
  },

  updateReadingStatus: async (id: number, status: string) => {
    return api(`/books/${id}/status?status=${status}`, {
      method: "PATCH",
    });
  },

  getSimilarBooks: async (bookId: number): Promise<Book[]> => {
    return api<Book[]>(`/books/${bookId}/recommend`);
  },

  getPersonalizedRecommendations: async (): Promise<Book[]> => {
    return api<Book[]>("/books/me/recommend");
  },
};
