from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    gender: Optional[str]
    email: EmailStr
    password: str
    role: str = "user"


class UserResponse(BaseModel):
    id: int
    name: str
    gender: Optional[str]
    email: EmailStr
    role: str

    class Config:
        from_attributes = True
