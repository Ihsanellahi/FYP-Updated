import type {
    Room,
    Booking,
    Complaint,
    Emergency,
    Staff,
    Feedback,
    ActivityItem,
    AnalyticsData,
} from '@/types';

// Mock Rooms Data
export const mockRooms: Room[] = [
    {
        id: 'room-1',
        number: '101',
        type: 'Single',
        price: 99,
        capacity: 1,
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
        available: true,
        imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
        description: 'Cozy single room perfect for solo travelers',
    },
    {
        id: 'room-2',
        number: '102',
        type: 'Double',
        price: 149,
        capacity: 2,
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'],
        available: true,
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500',
        description: 'Comfortable double room with city view',
    },
    {
        id: 'room-3',
        number: '201',
        type: 'Suite',
        price: 299,
        capacity: 3,
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Living Room'],
        available: true,
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500',
        description: 'Spacious suite with separate living area',
    },
    {
        id: 'room-4',
        number: '202',
        type: 'Deluxe',
        price: 399,
        capacity: 4,
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Living Room', 'Kitchen'],
        available: false,
        imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500',
        description: 'Luxurious deluxe room with stunning views',
    },
    {
        id: 'room-5',
        number: '301',
        type: 'Presidential',
        price: 799,
        capacity: 6,
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Living Room', 'Kitchen', 'Private Pool', 'Butler Service'],
        available: true,
        imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500',
        description: 'Ultimate luxury presidential suite',
    },
    {
        id: 'room-6',
        number: '103',
        type: 'Double',
        price: 149,
        capacity: 2,
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
        available: true,
        imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500',
        description: 'Modern double room with contemporary design',
    },
];

// Mock Bookings Data
export const mockBookings: Booking[] = [
    {
        id: 'BK001',
        guestName: 'John Doe',
        guestEmail: 'john.doe@email.com',
        guestPhone: '+1234567890',
        roomId: 'room-2',
        roomNumber: '102',
        roomType: 'Double',
        checkIn: '2026-01-10',
        checkOut: '2026-01-15',
        guests: 2,
        totalPrice: 745,
        status: 'Confirmed',
        createdAt: '2026-01-02T10:30:00',
    },
    {
        id: 'BK002',
        guestName: 'Jane Smith',
        guestEmail: 'jane.smith@email.com',
        guestPhone: '+1234567891',
        roomId: 'room-4',
        roomNumber: '202',
        roomType: 'Deluxe',
        checkIn: '2026-01-04',
        checkOut: '2026-01-08',
        guests: 3,
        totalPrice: 1596,
        status: 'Confirmed',
        createdAt: '2026-01-01T14:20:00',
    },
    {
        id: 'BK003',
        guestName: 'Mike Johnson',
        guestEmail: 'mike.j@email.com',
        guestPhone: '+1234567892',
        roomId: 'room-1',
        roomNumber: '101',
        roomType: 'Single',
        checkIn: '2026-01-05',
        checkOut: '2026-01-07',
        guests: 1,
        totalPrice: 198,
        status: 'Pending',
        createdAt: '2026-01-04T09:15:00',
    },
    {
        id: 'BK004',
        guestName: 'Sarah Williams',
        guestEmail: 'sarah.w@email.com',
        guestPhone: '+1234567893',
        roomId: 'room-3',
        roomNumber: '201',
        roomType: 'Suite',
        checkIn: '2026-01-20',
        checkOut: '2026-01-25',
        guests: 2,
        totalPrice: 1495,
        status: 'Pending',
        createdAt: '2026-01-03T16:45:00',
        specialRequests: 'Late checkout if possible',
    },
];

// Mock Complaints Data
export const mockComplaints: Complaint[] = [
    {
        id: 'CMP001',
        guestName: 'Robert Brown',
        guestEmail: 'robert.b@email.com',
        category: 'Room',
        description: 'Air conditioning not working properly in room 105',
        status: 'New',
        createdAt: '2026-01-04T08:30:00',
    },
    {
        id: 'CMP002',
        guestName: 'Emily Davis',
        guestEmail: 'emily.d@email.com',
        category: 'Service',
        description: 'Room service took over 2 hours to deliver breakfast',
        status: 'In Progress',
        assignedTo: 'staff-2',
        createdAt: '2026-01-03T10:15:00',
        notes: 'Apologized to guest, investigating kitchen delays',
    },
    {
        id: 'CMP003',
        guestName: 'David Wilson',
        guestEmail: 'david.w@email.com',
        category: 'Staff',
        description: 'Front desk staff was rude during check-in',
        status: 'Resolved',
        assignedTo: 'staff-1',
        createdAt: '2026-01-02T14:20:00',
        resolvedAt: '2026-01-03T09:00:00',
        notes: 'Staff member counseled, guest received complimentary upgrade',
    },
];

// Mock Emergency Data
export const mockEmergencies: Emergency[] = [
    {
        id: 'EMG001',
        type: 'Medical',
        description: 'Guest fell in lobby, requesting medical assistance',
        contactNumber: '+1234567894',
        location: 'Main Lobby',
        status: 'Resolved',
        createdAt: '2026-01-03T15:30:00',
        acknowledgedAt: '2026-01-03T15:32:00',
        resolvedAt: '2026-01-03T16:15:00',
        respondedBy: 'staff-3',
    },
    {
        id: 'EMG002',
        type: 'Security',
        description: 'Suspicious person loitering near parking area',
        contactNumber: '+1234567895',
        location: 'Parking Lot B',
        status: 'Acknowledged',
        createdAt: '2026-01-04T07:45:00',
        acknowledgedAt: '2026-01-04T07:47:00',
        respondedBy: 'staff-4',
    },
    {
        id: 'EMG003',
        type: 'Fire',
        description: 'Smoke detected in room 304',
        contactNumber: '+1234567896',
        location: 'Room 304',
        status: 'New',
        createdAt: '2026-01-04T10:50:00',
    },
];

// Mock Staff Data
export const mockStaff: Staff[] = [
    {
        id: 'staff-1',
        name: 'Admin User',
        email: 'admin@grandhotel.com',
        role: 'Admin',
        department: 'Management',
        phone: '+1234567800',
    },
    {
        id: 'staff-2',
        name: 'Alice Manager',
        email: 'alice@grandhotel.com',
        role: 'Staff',
        department: 'Front Desk',
        phone: '+1234567801',
    },
    {
        id: 'staff-3',
        name: 'Bob Security',
        email: 'bob@grandhotel.com',
        role: 'Staff',
        department: 'Security',
        phone: '+1234567802',
    },
    {
        id: 'staff-4',
        name: 'Carol Housekeeping',
        email: 'carol@grandhotel.com',
        role: 'Staff',
        department: 'Housekeeping',
        phone: '+1234567803',
    },
];

// Mock Feedback Data
export const mockFeedback: Feedback[] = [
    {
        id: 'FB001',
        guestName: 'Michael Chen',
        guestEmail: 'michael.c@email.com',
        rating: 5,
        comments: 'Excellent service and beautiful rooms!',
        createdAt: '2026-01-03T12:00:00',
    },
    {
        id: 'FB002',
        guestName: 'Lisa Anderson',
        guestEmail: 'lisa.a@email.com',
        rating: 4,
        comments: 'Great stay, but WiFi could be faster',
        createdAt: '2026-01-02T18:30:00',
    },
];

// Mock Activity Feed
export const mockActivity: ActivityItem[] = [
    {
        id: 'act-1',
        type: 'booking',
        description: 'New booking by John Doe for Room 102',
        timestamp: '2026-01-04T10:30:00',
        status: 'Confirmed',
    },
    {
        id: 'act-2',
        type: 'complaint',
        description: 'New complaint about AC in Room 105',
        timestamp: '2026-01-04T08:30:00',
        status: 'New',
    },
    {
        id: 'act-3',
        type: 'emergency',
        description: 'Fire emergency in Room 304',
        timestamp: '2026-01-04T10:50:00',
        status: 'New',
    },
    {
        id: 'act-4',
        type: 'checkin',
        description: 'Jane Smith checked in to Room 202',
        timestamp: '2026-01-04T09:00:00',
    },
    {
        id: 'act-5',
        type: 'checkout',
        description: 'Michael Chen checked out from Room 301',
        timestamp: '2026-01-03T11:00:00',
    },
];

// Mock Analytics Data
export const mockAnalytics: AnalyticsData = {
    bookingsByMonth: [
        { month: 'Aug', count: 45, revenue: 12500 },
        { month: 'Sep', count: 52, revenue: 15200 },
        { month: 'Oct', count: 48, revenue: 13800 },
        { month: 'Nov', count: 61, revenue: 18900 },
        { month: 'Dec', count: 78, revenue: 24500 },
        { month: 'Jan', count: 34, revenue: 9800 },
    ],
    complaintsCounts: [
        { status: 'New', count: 5 },
        { status: 'In Progress', count: 8 },
        { status: 'Resolved', count: 42 },
    ],
    emergencyCounts: [
        { type: 'Medical', count: 3 },
        { type: 'Fire', count: 1 },
        { type: 'Security', count: 4 },
        { type: 'Other', count: 2 },
    ],
    occupancyRate: 78.5,
    avgRating: 4.6,
};

// Helper function to get room by ID
export function getRoomById(id: string): Room | undefined {
    return mockRooms.find(room => room.id === id);
}

// Helper function to get available rooms
export function getAvailableRooms(): Room[] {
    return mockRooms.filter(room => room.available);
}

// Helper function to get staff by ID
export function getStaffById(id: string): Staff | undefined {
    return mockStaff.find(staff => staff.id === id);
}
