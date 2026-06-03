# Full Stack Setup Guide

This project now has both a React frontend and a Node.js backend API.

## 🏗️ Architecture

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Node.js + Express
- **Communication**: REST API (JSON)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Install Frontend Dependencies

```bash
# In the root directory
npm install
```

### 2. Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend
npm install
```

### 3. Start the Backend Server

```bash
# From backend directory
npm run dev

# Server will start on http://localhost:3001
```

### 4. Start the Frontend (in a new terminal)

```bash
# From root directory
npm run dev

# Frontend will start on http://localhost:5173 (or another port)
```

## 🔧 Configuration

### Backend Port
The backend runs on port `3001` by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=3001 npm run dev
```

### Frontend API URL
The frontend is configured to connect to `http://localhost:3001/api` by default.

To change this, create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

## 📡 API Endpoints

The backend provides REST API endpoints for:

- **Rooms**: `/api/rooms`
- **Bookings**: `/api/bookings`
- **Complaints**: `/api/complaints`
- **Emergencies**: `/api/emergencies`
- **Feedback**: `/api/feedback`
- **Staff**: `/api/staff`
- **Auth**: `/api/auth/login`
- **Analytics**: `/api/analytics`

See `backend/README.md` for full API documentation.

## 🎯 What's Changed

### Backend (New)
- Express server with REST API
- In-memory data store (similar to mock data)
- CORS enabled for frontend communication
- Mock authentication

### Frontend (Updated)
- `DataContext` now uses API calls instead of local state
- `AuthContext` now uses API for authentication
- `Login` page updated for async authentication
- API utility functions in `src/lib/api.ts`

### Pages Still Using Mock Data (Optional Updates)
Some pages still import mock data directly for specific features:
- `Availability.tsx` - Uses `getAvailableRooms()` from mockData
- `AvailabilityManagement.tsx` - Uses `mockRooms`
- `Analytics.tsx` - Uses `mockAnalytics`
- `StaffManagement.tsx` - Uses `mockStaff`
- `ComplaintDetails.tsx` and `EmergencyDetails.tsx` - Use `mockStaff` for staff lists

These can be updated to use API calls if needed. The main data flow (bookings, complaints, emergencies, feedback) now goes through the API.

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3001/api/health

# Get all bookings
curl http://localhost:3001/api/bookings

# Get all rooms
curl http://localhost:3001/api/rooms
```

### Test Frontend Connection

1. Start both servers
2. Open browser developer tools (F12)
3. Check Network tab for API calls
4. Verify data loads from backend

## 🔒 Authentication

Demo credentials:
- **Admin**: `admin@grandhotel.com` / `admin123`
- **Staff**: `alice@grandhotel.com` / `staff123`

## 📝 Notes

- Data is stored in memory and resets when the backend server restarts
- CORS is enabled for all origins (for demo purposes)
- No database is used - can be added later
- Frontend will automatically connect to backend when both are running

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check CORS configuration in `backend/server.js`
- Verify `VITE_API_URL` in frontend `.env` file

### API calls failing
- Check browser console for errors
- Verify backend is running: `curl http://localhost:3001/api/health`
- Check Network tab in browser dev tools

### Port already in use
- Change backend port: `PORT=3002 npm run dev`
- Update frontend `.env`: `VITE_API_URL=http://localhost:3002/api`

## 🎓 Next Steps

To make this production-ready:
1. Add a database (MongoDB, PostgreSQL, etc.)
2. Implement proper JWT authentication
3. Add input validation and sanitization
4. Add rate limiting
5. Add logging and error tracking
6. Update remaining pages to use API calls
