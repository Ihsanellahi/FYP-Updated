"""Rooms router."""

from fastapi import APIRouter, HTTPException, status
from data.store import get_rooms, get_room_by_id, update_room

router = APIRouter()


@router.get("/")
def list_rooms():
    return get_rooms()


@router.get("/{room_id}")
def get_room(room_id: str):
    room = get_room_by_id(room_id)
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return room


@router.patch("/{room_id}")
def patch_room(room_id: str, updates: dict):
    room = update_room(room_id, updates)
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return room
