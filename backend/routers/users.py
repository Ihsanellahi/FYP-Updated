"""Users router."""

from fastapi import APIRouter, HTTPException, status
from data.store import get_users, get_user_by_id, delete_user

router = APIRouter()


def _without_password(user: dict) -> dict:
    return {k: v for k, v in user.items() if k != "password"}


@router.get("/")
def list_users():
    return [_without_password(u) for u in get_users()]


@router.get("/{user_id}")
def get_user(user_id: str):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return _without_password(user)


@router.delete("/{user_id}")
def remove_user(user_id: str):
    deleted = delete_user(user_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"success": True, "message": "User deleted successfully"}
