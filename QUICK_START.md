# Quick Start Guide

## 🚀 How to Run the Application

### Step 1: Install Backend Dependencies (Already Done ✅)

The backend dependencies have been installed. If you need to reinstall:

```bash
cd backend
npm install
```

### Step 2: Start the Backend Server

Open a terminal/command prompt and run:

```bash
cd backend
npm run dev
```

**OR** for production mode:

```bash
cd backend
npm start
```

The backend will start on **http://localhost:3001**

### Step 3: Start the Frontend (in a NEW terminal)

Open a **NEW** terminal/command prompt and run:

```bash
# Make sure you're in the root directory (not in backend folder)
npm run dev
```

The frontend will start on **http://localhost:5173** (or another port)

## ✅ Verification

1. **Backend is running**: Open http://localhost:3001/api/health
   - You should see: `{"status":"ok","message":"Hotel Management API is running"}`

2. **Frontend is running**: Open http://localhost:5173
   - You should see the hotel landing page

## 🔍 Troubleshooting

### Backend won't start?

**Error: Cannot find module 'express'**
```bash
cd backend
npm install
```

**Error: Port 3001 already in use**
- Change the port: Set `PORT=3002` before running `npm start`
- Or close the process using port 3001

### Frontend can't connect to backend?

**Check:**
1. Is the backend running? (Check http://localhost:3001/api/health)
2. Are both running in separate terminals?
3. Check browser console (F12) for CORS errors

**Error: Failed to fetch /api/...**
- Make sure backend is running first
- Check that API URL in `src/lib/api.ts` is `http://localhost:3001/api`

### Still having issues?

1. **Clear node_modules and reinstall:**
   ```bash
   # Frontend
   rm -rf node_modules package-lock.json
   npm install
   
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version:**
   ```bash
   node --version  # Should be v14 or higher
   npm --version
   ```

## 📋 Checklist

Before running, ensure:
- [x] Node.js is installed (v14+)
- [x] Backend dependencies installed (`cd backend && npm install`)
- [x] Frontend dependencies installed (`npm install` in root)
- [ ] Backend server is running (`cd backend && npm run dev`)
- [ ] Frontend dev server is running (`npm run dev` in root)

## 🎯 Quick Commands Reference

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Start backend (dev mode with auto-reload)
cd backend && npm run dev

# Start backend (production mode)
cd backend && npm start

# Start frontend
npm run dev

# Build frontend for production
npm run build
```

## 💡 Tip

Run backend and frontend in **separate terminal windows** so you can see logs from both.
