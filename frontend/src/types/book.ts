export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  year?: number;
  image_url?: string;
  description?: string;

  // user specific fields
  reading_status?: "None" | "want_to_read" | "currently_reading" | "finished";
  user_rating?: number | null;
}

export interface BookFilters {
  genre: string;
  minRating: number;
  yearRange: string;
  search: string;
}
