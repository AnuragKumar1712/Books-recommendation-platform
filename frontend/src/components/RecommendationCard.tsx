import { useState } from "react";
import type { SimilarBook } from "../types/recommendation";

interface RecommendationCardProps {
  title: string;
  author: string;
  genre: string;
  rating: number;
  reason: string;
  score: number; // 0–1
  similarBooks?: SimilarBook[];
}

const RecommendationCard = ({
  title,
  author,
  genre,
  rating,
  reason,
  score,
  similarBooks = [],
}: RecommendationCardProps) => {
  const [showSimilar, setShowSimilar] = useState(false);
  const confidence = Math.round(score * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{author}</p>

      <div className="mt-3 flex items-center gap-3 text-sm">
        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded">
          {genre}
        </span>
        <span className="text-yellow-500 font-medium">⭐ {rating}</span>
      </div>

      {/* Confidence */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Confidence</span>
          <span>{confidence}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600 italic">“{reason}”</p>

      {similarBooks.length > 0 && (
        <button
          onClick={() => setShowSimilar(!showSimilar)}
          className="mt-4 text-sm text-indigo-600 hover:underline"
        >
          {showSimilar ? "Hide similar books" : "View similar books"}
        </button>
      )}

      {showSimilar && (
        <div className="mt-4 border-t pt-4 space-y-2">
          {similarBooks.map((book) => (
            <div
              key={book.id}
              className="flex justify-between text-sm text-gray-700"
            >
              <span>
                {book.title} — {book.author}
              </span>
              <span className="text-yellow-500">⭐ {book.rating}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
