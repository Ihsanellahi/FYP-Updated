"""Bookings router."""

from fastapi import APIRouter, HTTPException, status
from data.store import get_bookings, get_booking_by_id, add_booking, update_booking

router = APIRouter()


@router.get("/")
def list_bookings():
    return get_bookings()


@router.get("/{booking_id}")
def get_booking(booking_id: str):
    booking = get_booking_by_id(booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return booking


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_booking(body: dict):
    return add_booking(body)


@router.patch("/{booking_id}")
def patch_booking(booking_id: str, updates: dict):
    booking = update_booking(booking_id, updates)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return booking
