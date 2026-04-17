from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.core.security import hash_password

from app.core.security import verify_password
from app.core.jwt import create_access_token
from app.schemas.auth import LoginRequest, TokenResponse

from datetime import datetime, timedelta
import uuid

from app.schemas.password import ForgotPasswordRequest
from app.schemas.password import ResetPasswordRequest

from app.core.email import send_reset_email

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    db_user = User(
        name=user.name,
        gender=user.gender,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role,
    )


    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.post("/login", response_model=TokenResponse)
def login_user(
    credentials: LoginRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == credentials.email)
        .first()
    )

    if not user or not verify_password(
        credentials.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "gender": user.gender,
            "email": user.email,
            "role": user.role,
        },
    }

@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == data.email).first()

    # Always return same message (security)
    if not user:
        return {
            "message": "A reset link has been sent to the registered email!"
        }

    # Generate reset token
    reset_token = str(uuid.uuid4())
    reset_expires = datetime.utcnow() + timedelta(minutes=15)

    user.reset_token = reset_token
    user.reset_token_expires_at = reset_expires

    db.commit()

    # DEV MODE: log reset link
    reset_link = (
        f"http://localhost:5173/reset-password?token={reset_token}"
    )
    send_reset_email(user.email, reset_token)

    return {
        "message": "If the email exists, a reset link has been sent"
    }

@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.reset_token == data.token)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token",
        )

    if (
        not user.reset_token_expires_at
        or user.reset_token_expires_at < datetime.utcnow()
    ):
        raise HTTPException(
            status_code=400,
            detail="Reset token has expired",
        )

    # Update password
    user.hashed_password = hash_password(data.new_password)

    # Invalidate token
    user.reset_token = None
    user.reset_token_expires_at = None

    db.commit()

    return {
        "message": "Password has been reset successfully"
    }
