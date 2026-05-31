"""Emergencies router."""

from fastapi import APIRouter, HTTPException, status
from data.store import get_emergencies, get_emergency_by_id, add_emergency, update_emergency

router = APIRouter()


@router.get("/")
def list_emergencies():
    return get_emergencies()


@router.get("/{emergency_id}")
def get_emergency(emergency_id: str):
    emergency = get_emergency_by_id(emergency_id)
    if not emergency:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emergency not found")
    return emergency


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_emergency(body: dict):
    return add_emergency(body)


@router.patch("/{emergency_id}")
def patch_emergency(emergency_id: str, updates: dict):
    emergency = update_emergency(emergency_id, updates)
    if not emergency:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emergency not found")
    return emergency
