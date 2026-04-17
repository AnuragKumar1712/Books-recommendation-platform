import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Trash2, Plus, Search, Pencil, Check, X } from "lucide-react";
import { bookService } from "../services/bookService";
import type { Book } from "../types/book";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 10;

const Dashboard = () => {
  const { user } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingBookId, setEditingBookId] = useState<number | null>(null);

  const [editBook, setEditBook] = useState({
    title: "",
    author: "",
    genre: "",
    rating: "",
    year: "",
    description: "",
  });

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    rating: "",
    year: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchBooks = async (page = currentPage) => {
    setLoading(true);

    const response = await bookService.getBooks({
      filters: {
        genre: "All",
        minRating: 0,
        yearRange: "All",
        search: search,
      },
      page: page,
      pageSize: ITEMS_PER_PAGE,
    });

    setBooks(response.data);
    setTotalPages(response.totalPages);

    setLoading(false);
  };

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBooks(1);
  };

  const handleAddBook = async () => {
    if (
      !newBook.title ||
      !newBook.author ||
      !newBook.genre ||
      !newBook.rating ||
      !newBook.year
    )
      return;

    const formData = new FormData();

    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("genre", newBook.genre);
    formData.append("rating", newBook.rating);
    formData.append("year", newBook.year);
    formData.append("description", newBook.description);

    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/books/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed");

      alert("Book added successfully!");

      setNewBook({
        title: "",
        author: "",
        genre: "",
        rating: "",
        year: "",
        description: "",
      });

      setImageFile(null);

      setCurrentPage(1);
      fetchBooks(1);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add book");
    }
  };

  const handleDeleteBook = async (id: number) => {
    await bookService.deleteBook(id);
    fetchBooks(currentPage);
  };

  const handleEditStart = (book: Book) => {
    setEditingBookId(book.id);

    setEditBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      rating: String(book.rating),
      year: String(book.year ?? ""),
      description: book.description || "",
    });
  };

  const handleEditSave = async (id: number) => {
    await bookService.updateBook(id, {
      title: editBook.title,
      author: editBook.author,
      genre: editBook.genre,
      rating: Number(editBook.rating),
      year: Number(editBook.year),
      description: editBook.description,
    });

    setEditingBookId(null);
    fetchBooks(currentPage);
  };

  const handleEditCancel = () => {
    setEditingBookId(null);
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
          Welcome, {user?.name}
        </h1>

        <p className="mt-2 text-[var(--color-muted-foreground)]">
          Manage book catalog and platform data.
        </p>
      </div>

      {/* Add Book */}
      <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 mb-12">
        <h2 className="text-xl font-semibold mb-6">Add New Book</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <input
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            placeholder="Genre"
            value={newBook.genre}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            placeholder="Rating"
            type="number"
            step="0.1"
            value={newBook.rating}
            onChange={(e) => setNewBook({ ...newBook, rating: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            placeholder="Year"
            type="number"
            value={newBook.year}
            onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <textarea
            placeholder="Description"
            value={newBook.description}
            onChange={(e) =>
              setNewBook({ ...newBook, description: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-sm col-span-full"
          />

          {/* Upload Button */}
          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm hover:opacity-90 transition">
              Upload Cover
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            {/* ❌ Remove Button */}
            {imageFile && (
              <button
                onClick={() => setImageFile(null)}
                className="px-3 py-2 text-sm rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                Remove
              </button>
            )}
          </div>

          {/* File Name */}
          {imageFile && (
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Selected: {imageFile.name}
            </p>
          )}

          {/* Preview */}
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="mt-2 h-32 rounded-lg border object-cover"
            />
          )}
        </div>

        <button
          onClick={handleAddBook}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm cursor-pointer"
        >
          <Plus size={16} />
          Add Book
        </button>
      </section>

      {/* Catalog */}
      <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        {/* Header + Search */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Book Catalog</h2>

          <div className="flex gap-2">
            <input
              placeholder="Search title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm"
            />

            <button
              onClick={handleSearch}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg flex gap-1 items-center cursor-pointer"
            >
              <Search size={14} />
              Search
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Author</th>
                <th className="px-6 py-3 text-left">Genre</th>
                <th className="px-6 py-3 text-left">Rating</th>
                <th className="px-6 py-3 text-left">Year</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : (
                books.map((book) => {
                  const isEditing = editingBookId === book.id;

                  return (
                    <tr key={book.id} className="border-t">
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            value={editBook.title}
                            onChange={(e) =>
                              setEditBook({
                                ...editBook,
                                title: e.target.value,
                              })
                            }
                            className="border px-2 py-1 rounded"
                          />
                        ) : (
                          book.title
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            value={editBook.author}
                            onChange={(e) =>
                              setEditBook({
                                ...editBook,
                                author: e.target.value,
                              })
                            }
                            className="border px-2 py-1 rounded"
                          />
                        ) : (
                          book.author
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            value={editBook.genre}
                            onChange={(e) =>
                              setEditBook({
                                ...editBook,
                                genre: e.target.value,
                              })
                            }
                            className="border px-2 py-1 rounded"
                          />
                        ) : (
                          book.genre
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.1"
                            value={editBook.rating}
                            onChange={(e) =>
                              setEditBook({
                                ...editBook,
                                rating: e.target.value,
                              })
                            }
                            className="border px-2 py-1 rounded w-20"
                          />
                        ) : (
                          book.rating
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editBook.year}
                            onChange={(e) =>
                              setEditBook({
                                ...editBook,
                                year: e.target.value,
                              })
                            }
                            className="border px-2 py-1 rounded w-24"
                          />
                        ) : (
                          book.year
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {isEditing ? (
                          <textarea
                            value={editBook.description}
                            onChange={(e) =>
                              setEditBook({
                                ...editBook,
                                description: e.target.value,
                              })
                            }
                            className="border px-2 py-1 rounded"
                          />
                        ) : (
                          <span className="line-clamp-2">
                            {book.description}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right flex justify-end gap-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleEditSave(book.id)}
                              className="text-green-500 cursor-pointer"
                            >
                              <Check size={16} />
                            </button>

                            <button
                              onClick={handleEditCancel}
                              className="text-gray-400 cursor-pointer"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditStart(book)}
                              className="text-blue-500 cursor-pointer"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="text-red-500 cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="py-6">
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

export default Dashboard;
