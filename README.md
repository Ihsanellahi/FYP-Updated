# AI-Powered Multi-Agent Hotel Management System

A complete frontend-only hotel management system built with React, TypeScript, and Tailwind CSS for FYP demonstration.

## 🌟 Features

### Customer Area
- **Landing Page**: Beautiful hero section with service cards
- **AI Chat Interface**: Interactive chat with simulated AI responses and quick action buttons
- **Room Booking**: View available rooms, complete booking forms, and get confirmation
- **Service Requests**: Submit complaints, report emergencies, and provide feedback
- **Help Center**: FAQ section with expandable accordion

### Staff/Admin Dashboard
- **Authentication**: Secure login with mock credentials
- **Dashboard Home**: KPI cards showing bookings, emergencies, complaints, and activity feed
- **Bookings Management**: View, filter, and update booking statuses
- **Availability Calendar**: Room management with visual calendar grid
- **Complaints System**: Track and resolve customer complaints with staff assignment
- **Emergency Alerts**: Immediate notification system for urgent situations
- **Staff Management**: Add/remove staff members and assign roles
- **Analytics**: Interactive charts showing bookings, revenue, complaints, and emergencies
- **Settings**: Configure notification preferences and integrations

## 🚀 Tech Stack

- **React 18** with **TypeScript** for type-safe development
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **React Router v6** for client-side routing
- **Recharts** for data visualization
- **Lucide React** for beautiful icons
- **shadcn/ui** inspired components

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔑 Demo Credentials

### Admin Access
- **Email**: admin@grandhotel.com
- **Password**: admin123

### Staff Access
- **Email**: alice@grandhotel.com
- **Password**: staff123

## 📂 Project Structure

```
src/
├── components/        # Reusable UI components
│   └── ui/           # shadcn-style base components
├── context/          # React context providers
│   ├── AuthContext.tsx
│   └── DataContext.tsx
├── data/             # Mock data and utilities
│   └── mockData.ts
├── layouts/          # Layout components
│   ├── CustomerLayout.tsx
│   └── DashboardLayout.tsx
├── lib/              # Utility functions
│   └── utils.ts
├── pages/            # Page components
│   ├── customer/     # Customer-facing pages
│   └── staff/        # Staff dashboard pages
├── types/            # TypeScript type definitions
│   └── index.ts
├── App.tsx           # Main app with routing
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

## ✨ Key Features Explained

### Mock Data System
All data is stored in local state using React Context. Changes persist during the session but reset on page reload. Perfect for demonstration purposes.

### Responsive Design
The application is fully responsive with:
- Mobile-first approach
- Collapsible sidebar on mobile
- Adaptive layouts for all screen sizes

### Status Management
Bookings, complaints, and emergencies follow clear status workflows:
- **Bookings**: Pending → Confirmed → Cancelled/Completed
- **Complaints**: New → In Progress → Resolved
- **Emergencies**: New → Acknowledged → Resolved

### AI Chat Simulation
The chat interface includes keyword-based responses that simulate an AI assistant, routing users to appropriate services.

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, professional interface suitable for FYP presentation
- **Color-Coded Badges**: Visual status indicators throughout
- **Interactive Charts**: Real-time data visualization in analytics
- **Smooth Animations**: Hover effects and transitions for better UX
- **Alert System**: Urgent notifications for emergencies

## 📝 Mock Data Notes

All mock data is defined in `src/data/mockData.ts` including:
- 6 hotel rooms with varying types and amenities
- Sample bookings with different statuses
- Customer complaints and emergencies
- Staff members with different roles
- Analytics data for charts

## 🔒 Authentication

Mock authentication is implemented using localStorage. Login persists across page refreshes until logout.

## 🌐 Routes

### Customer Routes
- `/` - Landing page
- `/chat` - AI chat interface
- `/availability` - View rooms
- `/booking` - Booking form
- `/booking-confirmation/:id` - Confirmation page
- `/complaint` - File complaint
- `/emergency` - Report emergency
- `/feedback` - Submit feedback
- `/help` - FAQ and help

### Staff Routes (Protected)
- `/staff/login` - Staff login
- `/staff/dashboard` - Dashboard home
- `/staff/bookings` - Bookings list
- `/staff/bookings/:id` - Booking details
- `/staff/availability` - Room availability
- `/staff/complaints` - Complaints list
- `/staff/complaints/:id` - Complaint details
- `/staff/emergencies` - Emergencies list
- `/staff/emergencies/:id` - Emergency details
- `/staff/staff-management` - Staff management
- `/staff/analytics` - Analytics dashboard
- `/staff/settings` - Settings

## 🎓 FYP Presentation Tips

1. **Demo Flow**: Start at landing → chat → book room → view in staff dashboard
2. **Show Emergency**: Submit emergency from customer side, then show staff response
3. **Highlight Analytics**: Demonstrate the charts and KPI metrics
4. **Mobile View**: Show responsive design on different screen sizes
5. **Status Updates**: Show booking/complaint status workflow

## 📊 Technologies Justification

- **React + TypeScript**: Industry standard for type-safe frontend development
- **Vite**: Modern, fast build tool with excellent DX
- **Tailwind CSS**: Utility-first CSS for rapid UI development
- **React Router**: Standard routing library for React SPAs
- **Recharts**: Simple yet powerful charting library
- **Context API**: Built-in React state management, perfect for this scope

## 🚫 Limitations (By Design)

- No backend API integration (frontend-only demo)
- Data resets on page reload
- No real-time updates (single-user application)
- No actual payment processing
- No email/SMS notifications

## 📄 License

This project is created for educational purposes as a Final Year Project.

---

**Author**: FYP Student  
**Project**: AI-Powered Multi-Agent Hotel Management System  
**Year**: 2026
