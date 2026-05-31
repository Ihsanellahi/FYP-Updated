"""Analytics router."""

from fastapi import APIRouter
from data.store import get_analytics, get_activity

router = APIRouter()


@router.get("/")
def analytics():
    return get_analytics()


@router.get("/activity")
def activity_feed():
    return get_activity()
