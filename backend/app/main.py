from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base

from app.models import book, user
from app.models import user_book

from app.routes import auth
from app.routes.books import router as books_router

from fastapi.staticfiles import StaticFiles

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books_router)
app.include_router(auth.router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {"message": "Books API is running"}

# from dotenv import load_dotenv
# load_dotenv()

# import os
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles

# from app.database import engine, Base
# from app.models import book, user
# from app.models import user_book

# from app.routes import auth
# from app.routes.books import router as books_router

# Base.metadata.create_all(bind=engine)

# app = FastAPI()

# # CORS FIX
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ROUTES
# app.include_router(books_router)
# app.include_router(auth.router)

# # STATIC FILES FIX
# if not os.path.exists("uploads"):
#     os.makedirs("uploads")

# app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# @app.get("/")
# def root():
#     return {"message": "Books API is running"}