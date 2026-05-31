"""Staff router."""

from fastapi import APIRouter, HTTPException, status
from data.store import get_staff, get_staff_by_id, add_staff, update_staff, delete_staff

router = APIRouter()


@router.get("/")
def list_staff():
    return get_staff()


@router.get("/{staff_id}")
def get_staff_member(staff_id: str):
    member = get_staff_by_id(staff_id)
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff not found")
    return member


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_staff(body: dict):
    return add_staff(body)


@router.patch("/{staff_id}")
def patch_staff(staff_id: str, updates: dict):
    member = update_staff(staff_id, updates)
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff not found")
    return member


@router.delete("/{staff_id}")
def remove_staff(staff_id: str):
    deleted = delete_staff(staff_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff not found")
    return {"message": "Staff member deleted successfully"}
