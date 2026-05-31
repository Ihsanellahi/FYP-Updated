from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, rooms, bookings, complaints, emergencies, feedback, staff, users, analytics

app = FastAPI(
    title="Grand Hotel Management API",
    description="AI-Powered Multi-Agent System for Automated Booking and Management",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS – allow all origins (matches existing Node.js behaviour)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(auth.router,        prefix="/api/auth",        tags=["Auth"])
app.include_router(rooms.router,       prefix="/api/rooms",       tags=["Rooms"])
app.include_router(bookings.router,    prefix="/api/bookings",    tags=["Bookings"])
app.include_router(complaints.router,  prefix="/api/complaints",  tags=["Complaints"])
app.include_router(emergencies.router, prefix="/api/emergencies", tags=["Emergencies"])
app.include_router(feedback.router,    prefix="/api/feedback",    tags=["Feedback"])
app.include_router(staff.router,       prefix="/api/staff",       tags=["Staff"])
app.include_router(users.router,       prefix="/api/users",       tags=["Users"])
app.include_router(analytics.router,   prefix="/api/analytics",   tags=["Analytics"])

# ---------------------------------------------------------------------------
# Root & health
# ---------------------------------------------------------------------------
@app.get("/", tags=["Root"])
def root():
    return (
        "Grand Hotel Management API is running. "
        "Please access the frontend application at http://localhost:3000"
    )


@app.get("/api/health", tags=["Root"])
def health():
    return {"status": "ok", "message": "Hotel Management API is running"}
