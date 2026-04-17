import pandas as pd
import os
import random

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
file_path = os.path.join(BASE_DIR, "data", "books.csv")

df = pd.read_csv(file_path)

#  Select required columns (including year)
df = df[[
    "book_id",
    "title",
    "authors",
    "average_rating",
    "image_url",
    "original_publication_year"
]]

#  Rename columns to match DB
df.rename(columns={
    "book_id": "id",
    "authors": "author",
    "average_rating": "rating",
    "original_publication_year": "year"
}, inplace=True)

#  Remove missing values
df = df.dropna(subset=["title", "author"])

#  Remove duplicates
df = df.drop_duplicates(subset=["title"])

#  Limit to 1000
df = df.head(1000)

#  Add genre
genres = ["Fiction", "Fantasy", "Mystery", "Romance", "Sci-Fi", "History"]
df["genre"] = [random.choice(genres) for _ in range(len(df))]

#  Add description (fake for now)
df["description"] = "No description available."

#  Reset index
df.reset_index(drop=True, inplace=True)

# Save
output_path = os.path.join(BASE_DIR, "data", "clean_books.csv")
df.to_csv(output_path, index=False)

print("Cleaned dataset ready!")
print(df.head())