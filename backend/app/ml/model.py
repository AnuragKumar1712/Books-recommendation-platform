from sentence_transformers import SentenceTransformer

# Load model once globally
model = SentenceTransformer('all-MiniLM-L6-v2')

# from sklearn.feature_extraction.text import TfidfVectorizer

# vectorizer = TfidfVectorizer(stop_words='english')