"""Feedback router."""

from fastapi import APIRouter, status
from data.store import get_feedback, add_feedback

router = APIRouter()


@router.get("/")
def list_feedback():
    return get_feedback()


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_feedback(body: dict):
    return add_feedback(body)
