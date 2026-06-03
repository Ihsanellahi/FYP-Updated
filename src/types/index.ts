// Core type definitions for the hotel management system

export type RoomType = 'Single' | 'Double' | 'Suite' | 'Deluxe' | 'Presidential';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
export type ComplaintStatus = 'New' | 'In Progress' | 'Resolved';
export type EmergencyStatus = 'New' | 'Acknowledged' | 'Resolved';
export type StaffRole = 'Admin' | 'Staff';

export interface Room {
    id: string;
    number: string;
    type: RoomType;
    price: number;
    capacity: number;
    amenities: string[];
    available: boolean;
    imageUrl: string;
    description: string;
}

export interface Booking {
    id: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    roomId: string;
    roomNumber: string;
    roomType: RoomType;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: BookingStatus;
    createdAt: string;
    specialRequests?: string;
}

export interface Complaint {
    id: string;
    guestName: string;
    guestEmail: string;
    category: 'Service' | 'Room' | 'Staff' | 'Billing' | 'Other';
    description: string;
    status: ComplaintStatus;
    assignedTo?: string;
    createdAt: string;
    resolvedAt?: string;
    notes?: string;
}

export interface Emergency {
    id: string;
    type: 'Medical' | 'Fire' | 'Security' | 'Other';
    description: string;
    contactNumber: string;
    location?: string;
    status: EmergencyStatus;
    createdAt: string;
    acknowledgedAt?: string;
    resolvedAt?: string;
    respondedBy?: string;
}

export interface Staff {
    id: string;
    name: string;
    email: string;
    role: StaffRole;
    department: string;
    phone: string;
    avatar?: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    message: string;
    timestamp: string;
}

export interface Feedback {
    id: string;
    guestName: string;
    guestEmail: string;
    rating: number;
    comments: string;
    createdAt: string;
}

export interface ActivityItem {
    id: string;
    type: 'booking' | 'complaint' | 'emergency' | 'checkin' | 'checkout';
    description: string;
    timestamp: string;
    status?: string;
}

export interface AnalyticsData {
    bookingsByMonth: { month: string; count: number; revenue: number }[];
    complaintsCounts: { status: ComplaintStatus; count: number }[];
    emergencyCounts: { type: string; count: number }[];
    occupancyRate: number;
    avgRating: number;
}
