"""Complaints router."""

from fastapi import APIRouter, HTTPException, status
from data.store import get_complaints, get_complaint_by_id, add_complaint, update_complaint

router = APIRouter()


@router.get("/")
def list_complaints():
    return get_complaints()


@router.get("/{complaint_id}")
def get_complaint(complaint_id: str):
    complaint = get_complaint_by_id(complaint_id)
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    return complaint


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_complaint(body: dict):
    return add_complaint(body)


@router.patch("/{complaint_id}")
def patch_complaint(complaint_id: str, updates: dict):
    complaint = update_complaint(complaint_id, updates)
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    return complaint
