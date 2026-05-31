"""
In-memory data store — Python translation of data/store.js.
Users are persisted to data/users.json on every write.
"""

import copy
import json
import os
from datetime import datetime, timezone

from data.mock_data import (
    mock_activity, mock_analytics, mock_bookings, mock_complaints,
    mock_emergencies, mock_feedback, mock_rooms, mock_staff,
)

rooms:       list = copy.deepcopy(mock_rooms)
bookings:    list = copy.deepcopy(mock_bookings)
complaints:  list = copy.deepcopy(mock_complaints)
emergencies: list = copy.deepcopy(mock_emergencies)
feedback:    list = copy.deepcopy(mock_feedback)
activity:    list = copy.deepcopy(mock_activity)

_USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")
users: list = []

try:
    if os.path.exists(_USERS_FILE):
        with open(_USERS_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)
    else:
        users = [
            {**s, "password": "admin123" if s["role"] == "Admin" else "staff123"}
            for s in copy.deepcopy(mock_staff)
        ]
        with open(_USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=2)
except Exception as exc:
    print(f"Error loading users: {exc}")
    users = []


def _save_users():
    try:
        with open(_USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=2)
    except Exception as exc:
        print(f"Error saving users: {exc}")


def _now_iso(): return datetime.now(tz=timezone.utc).isoformat()
def _now_ms():  return int(datetime.now(tz=timezone.utc).timestamp() * 1000)

# Rooms
def get_rooms(): return rooms
def get_room_by_id(room_id): return next((r for r in rooms if r["id"] == room_id), None)
def update_room(room_id, updates):
    for i, r in enumerate(rooms):
        if r["id"] == room_id:
            rooms[i] = {**r, **updates}
            return rooms[i]
    return None

# Bookings
def get_bookings(): return bookings
def get_booking_by_id(bid): return next((b for b in bookings if b["id"] == bid), None)
def add_booking(booking):
    bookings.append(booking)
    room = get_room_by_id(booking.get("roomId", ""))
    if room: update_room(booking["roomId"], {"available": False})
    add_activity({"id": f"act-{_now_ms()}", "type": "booking", "description": f"New booking by {booking.get('guestName')} for Room {booking.get('roomNumber')}", "timestamp": _now_iso(), "status": booking.get("status")})
    return booking
def update_booking(bid, updates):
    for i, b in enumerate(bookings):
        if b["id"] == bid:
            bookings[i] = {**b, **updates}
            return bookings[i]
    return None

# Complaints
def get_complaints(): return complaints
def get_complaint_by_id(cid): return next((c for c in complaints if c["id"] == cid), None)
def add_complaint(complaint):
    complaints.append(complaint)
    add_activity({"id": f"act-{_now_ms()}", "type": "complaint", "description": f"New complaint: {complaint.get('category')} - {str(complaint.get('description',''))[:50]}", "timestamp": _now_iso(), "status": complaint.get("status")})
    return complaint
def update_complaint(cid, updates):
    for i, c in enumerate(complaints):
        if c["id"] == cid:
            complaints[i] = {**c, **updates}
            return complaints[i]
    return None

# Emergencies
def get_emergencies(): return emergencies
def get_emergency_by_id(eid): return next((e for e in emergencies if e["id"] == eid), None)
def add_emergency(emergency):
    emergencies.append(emergency)
    add_activity({"id": f"act-{_now_ms()}", "type": "emergency", "description": f"{emergency.get('type')} emergency: {emergency.get('description')}", "timestamp": _now_iso(), "status": emergency.get("status")})
    return emergency
def update_emergency(eid, updates):
    for i, e in enumerate(emergencies):
        if e["id"] == eid:
            emergencies[i] = {**e, **updates}
            return emergencies[i]
    return None

# Feedback
def get_feedback(): return feedback
def add_feedback(fb):
    feedback.append(fb)
    return fb

# Users
def get_users(): return users
def get_user_by_id(uid): return next((u for u in users if u["id"] == uid), None)
def get_user_by_email(email): return next((u for u in users if u["email"] == email), None)
def add_user(user):
    users.append(user); _save_users(); return user
def update_user(uid, updates):
    for i, u in enumerate(users):
        if u["id"] == uid:
            users[i] = {**u, **updates}; _save_users(); return users[i]
    return None
def delete_user(uid):
    for i, u in enumerate(users):
        if u["id"] == uid:
            users.pop(i); _save_users(); return True
    return False

# Staff aliases
def get_staff(): return [u for u in users if u.get("role") in ("Staff", "Admin")]
get_staff_by_id = get_user_by_id
add_staff    = add_user
update_staff = update_user
delete_staff = delete_user

# Activity
def get_activity(): return activity
def add_activity(item):
    activity.insert(0, item)
    if len(activity) > 100: activity[:] = activity[:100]
    return item

# Analytics
def get_analytics():
    now = datetime.now(tz=timezone.utc)
    complaints_counts = [
        {"status": "New",         "count": sum(1 for c in complaints if c["status"] == "New")},
        {"status": "In Progress", "count": sum(1 for c in complaints if c["status"] == "In Progress")},
        {"status": "Resolved",    "count": sum(1 for c in complaints if c["status"] == "Resolved")},
    ]
    emergency_counts = [{"type": t, "count": sum(1 for e in emergencies if e["type"] == t)} for t in ("Medical", "Fire", "Security", "Other")]
    total_rooms  = len(rooms)
    booked_rooms = sum(1 for b in bookings if b["status"] == "Confirmed" and datetime.fromisoformat(b["checkOut"]).replace(tzinfo=timezone.utc) > now)
    occupancy_rate = round((booked_rooms / total_rooms) * 100, 1) if total_rooms else 0
    avg_rating = round(sum(f["rating"] for f in feedback) / len(feedback), 1) if feedback else mock_analytics["avgRating"]
    return {"bookingsByMonth": mock_analytics["bookingsByMonth"], "complaintsCounts": complaints_counts, "emergencyCounts": emergency_counts, "occupancyRate": occupancy_rate, "avgRating": avg_rating}
