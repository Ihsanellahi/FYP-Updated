"""Auth router — login, register, token verify."""

import time
from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel

from data.store import get_user_by_email, add_user

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: str | None = ""


def _without_password(user: dict) -> dict:
    return {k: v for k, v in user.items() if k != "password"}


def _make_token() -> str:
    return f"mock-jwt-token-{int(time.time() * 1000)}"


@router.post("/login")
def login(body: LoginRequest):
    user = get_user_by_email(body.email)
    if user and user.get("password") == body.password:
        return {"success": True, "user": _without_password(user), "token": _make_token()}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest):
    if not body.name or not body.email or not body.password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name, email, and password are required")
    if get_user_by_email(body.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
    new_user = {
        "id": f"user-{int(time.time() * 1000)}",
        "name": body.name,
        "email": body.email,
        "phone": body.phone or "",
        "password": body.password,
        "role": "customer",
    }
    add_user(new_user)
    return {"success": True, "user": _without_password(new_user), "token": _make_token()}


@router.get("/verify")
def verify(authorization: str | None = Header(default=None)):
    token = (authorization or "").replace("Bearer ", "")
    if token.startswith("mock-jwt-token-"):
        return {"valid": True}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
