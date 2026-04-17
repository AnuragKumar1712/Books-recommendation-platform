export interface SimilarBook {
  id: number;
  title: string;
  author: string;
  rating: number;
}

export interface Recommendation {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  reason: string;
  score: number; // ML confidence (similarity score)
  similarBooks?: SimilarBook[];
}
