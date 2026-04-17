import type { Recommendation } from "../types/recommendation";

export const getMockRecommendations = (): Promise<Recommendation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Dune",
          author: "Frank Herbert",
          genre: "Fantasy",
          rating: 4.5,
          score: 0.92,
          reason:
            "Recommended because you enjoy science fiction and epic narratives",
          similarBooks: [
            {
              id: 101,
              title: "Foundation",
              author: "Isaac Asimov",
              rating: 4.4,
            },
            {
              id: 102,
              title: "Neuromancer",
              author: "William Gibson",
              rating: 4.2,
            },
          ],
        },
        {
          id: 2,
          title: "Atomic Habits",
          author: "James Clear",
          genre: "Non-Fiction",
          rating: 4.6,
          score: 0.86,
          reason: "Highly rated book in personal development",
          similarBooks: [
            { id: 201, title: "Deep Work", author: "Cal Newport", rating: 4.5 },
            {
              id: 202,
              title: "The Power of Habit",
              author: "Charles Duhigg",
              rating: 4.3,
            },
          ],
        },
      ]);
    }, 800);
  });
};
