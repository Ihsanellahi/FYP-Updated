# Grand Hotel Management API — FastAPI Backend

## Tech Stack

| Technology  | Details             |
|-------------|---------------------|
| Language    | Python              |
| Runtime     | Python Environment  |
| Framework   | FastAPI             |
| Entry Point | `main.py`           |
| Dev Tool    | Uvicorn with reload |
| Other       | CORS middleware     |

## Setup & Run

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the development server
```bash
python -m uvicorn main:app --reload --port 3001
```

The API will be live at **http://localhost:3001**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register new customer |
| GET | `/api/auth/verify` | Verify token |
| GET | `/api/rooms` | List all rooms |
| GET | `/api/rooms/{id}` | Get room by ID |
| PATCH | `/api/rooms/{id}` | Update room |
| GET | `/api/bookings` | List all bookings |
| GET | `/api/bookings/{id}` | Get booking by ID |
| POST | `/api/bookings` | Create booking |
| PATCH | `/api/bookings/{id}` | Update booking |
| GET | `/api/complaints` | List complaints |
| POST | `/api/complaints` | Create complaint |
| PATCH | `/api/complaints/{id}` | Update complaint |
| GET | `/api/emergencies` | List emergencies |
| POST | `/api/emergencies` | Create emergency |
| PATCH | `/api/emergencies/{id}` | Update emergency |
| GET | `/api/feedback` | List feedback |
| POST | `/api/feedback` | Submit feedback |
| GET | `/api/staff` | List staff |
| POST | `/api/staff` | Add staff member |
| PATCH | `/api/staff/{id}` | Update staff |
| DELETE | `/api/staff/{id}` | Delete staff |
| GET | `/api/users` | List all users |
| DELETE | `/api/users/{id}` | Delete user |
| GET | `/api/analytics` | Analytics data |
| GET | `/api/analytics/activity` | Activity feed |

## Interactive Docs

FastAPI auto-generates interactive API documentation:
- **Swagger UI**: http://localhost:3001/docs
- **ReDoc**: http://localhost:3001/redoc

## Default Credentials

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | `admin@grandhotel.com`   | `admin123` |
| Staff | `alice@grandhotel.com`   | `staff123` |

## Project Structure

```
backend/
├── main.py              ← FastAPI app entry point
├── requirements.txt     ← Python dependencies
├── data/
│   ├── mock_data.py     ← Seed data
│   └── store.py         ← In-memory store + users.json persistence
└── routers/
    ├── auth.py
    ├── rooms.py
    ├── bookings.py
    ├── complaints.py
    ├── emergencies.py
    ├── feedback.py
    ├── staff.py
    ├── users.py
    └── analytics.py
```
