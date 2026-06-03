import { 
    collection, 
    getDocs, 
    getDoc, 
    doc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy 
} from 'firebase/firestore';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { db, auth, isFirebaseConfigured } from './firebase';

// ============================================================================
// MOCK DATA SEED
// ============================================================================

const MOCK_USERS = [
    { id: 'staff-1', name: 'Admin User', email: 'admin@grandhotel.com', role: 'Admin', department: 'Management', phone: '+1234567800', password: 'admin123' },
    { id: 'staff-2', name: 'Alice Manager', email: 'alice@grandhotel.com', role: 'Staff', department: 'Front Desk', phone: '+1234567801', password: 'staff123' },
    { id: 'staff-3', name: 'Bob Security', email: 'bob@grandhotel.com', role: 'Staff', department: 'Security', phone: '+1234567802', password: 'staff123' },
    { id: 'staff-4', name: 'Carol Housekeeping', email: 'carol@grandhotel.com', role: 'Staff', department: 'Housekeeping', phone: '+1234567803', password: 'staff123' },
];

const MOCK_ROOMS = [
    { id: 'room-1', number: '101', type: 'Single', price: 99.0, capacity: 1, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], available: true, imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500', description: 'Cozy single room perfect for solo travelers' },
    { id: 'room-2', number: '102', type: 'Double', price: 149.0, capacity: 2, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], available: true, imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500', description: 'Comfortable double room with city view' },
    { id: 'room-3', number: '201', type: 'Suite', price: 299.0, capacity: 3, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Living Room'], available: true, imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500', description: 'Spacious suite with separate living area' },
    { id: 'room-4', number: '202', type: 'Deluxe', price: 399.0, capacity: 4, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Living Room', 'Kitchen'], available: false, imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500', description: 'Luxurious deluxe room with stunning views' },
    { id: 'room-5', number: '301', type: 'Presidential', price: 799.0, capacity: 6, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Living Room', 'Kitchen', 'Private Pool', 'Butler Service'], available: true, imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500', description: 'Ultimate luxury presidential suite' },
    { id: 'room-6', number: '103', type: 'Double', price: 149.0, capacity: 2, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], available: true, imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500', description: 'Modern double room with contemporary design' },
];

const MOCK_BOOKINGS = [
    { id: 'BK001', guestName: 'John Doe', guestEmail: 'john.doe@email.com', guestPhone: '+1234567890', roomId: 'room-2', roomNumber: '102', roomType: 'Double', checkIn: '2026-01-10', checkOut: '2026-01-15', guests: 2, totalPrice: 745.0, status: 'Confirmed', createdAt: '2026-01-02T10:30:00' },
    { id: 'BK002', guestName: 'Jane Smith', guestEmail: 'jane.smith@email.com', guestPhone: '+1234567891', roomId: 'room-4', roomNumber: '202', roomType: 'Deluxe', checkIn: '2026-01-04', checkOut: '2026-01-08', guests: 3, totalPrice: 1596.0, status: 'Confirmed', createdAt: '2026-01-01T14:20:00' },
    { id: 'BK003', guestName: 'Mike Johnson', guestEmail: 'mike.j@email.com', guestPhone: '+1234567892', roomId: 'room-1', roomNumber: '101', roomType: 'Single', checkIn: '2026-01-05', checkOut: '2026-01-07', guests: 1, totalPrice: 198.0, status: 'Pending', createdAt: '2026-01-04T09:15:00' },
    { id: 'BK004', guestName: 'Sarah Williams', guestEmail: 'sarah.w@email.com', guestPhone: '+1234567893', roomId: 'room-3', roomNumber: '201', roomType: 'Suite', checkIn: '2026-01-20', checkOut: '2026-01-25', guests: 2, totalPrice: 1495.0, status: 'Pending', createdAt: '2026-01-03T16:45:00', specialRequests: 'Late checkout if possible' },
];

const MOCK_COMPLAINTS = [
    { id: 'CMP001', guestName: 'Robert Brown', guestEmail: 'robert.b@email.com', category: 'Room', description: 'Air conditioning not working properly in room 105', status: 'New', createdAt: '2026-01-04T08:30:00', assignedTo: null, notes: null, resolvedAt: null },
    { id: 'CMP002', guestName: 'Emily Davis', guestEmail: 'emily.d@email.com', category: 'Service', description: 'Room service took over 2 hours to deliver breakfast', status: 'In Progress', createdAt: '2026-01-03T10:15:00', assignedTo: 'staff-2', notes: 'Apologized to guest, investigating kitchen delays', resolvedAt: null },
    { id: 'CMP003', guestName: 'David Wilson', guestEmail: 'david.w@email.com', category: 'Staff', description: 'Front desk staff was rude during check-in', status: 'Resolved', createdAt: '2026-01-02T14:20:00', assignedTo: 'staff-1', notes: 'Staff member counseled, guest received complimentary upgrade', resolvedAt: '2026-01-03T09:00:00' },
];

const MOCK_EMERGENCIES = [
    { id: 'EMG001', type: 'Medical', description: 'Guest fell in lobby, requesting medical assistance', contactNumber: '+1234567894', location: 'Main Lobby', status: 'Resolved', createdAt: '2026-01-03T15:30:00', acknowledgedAt: '2026-01-03T15:32:00', resolvedAt: '2026-01-03T16:15:00', respondedBy: 'staff-3' },
    { id: 'EMG002', type: 'Security', description: 'Suspicious person loitering near parking area', contactNumber: '+1234567895', location: 'Parking Lot B', status: 'Acknowledged', createdAt: '2026-01-04T07:45:00', acknowledgedAt: '2026-01-04T07:47:00', resolvedAt: null, respondedBy: 'staff-4' },
    { id: 'EMG003', type: 'Fire', description: 'Smoke detected in room 304', contactNumber: '+1234567896', location: 'Room 304', status: 'New', createdAt: '2026-01-04T10:50:00', acknowledgedAt: null, resolvedAt: null, respondedBy: null },
];

const MOCK_FEEDBACK = [
    { id: 'FB001', guestName: 'Michael Chen', guestEmail: 'michael.c@email.com', rating: 5, comments: 'Excellent service and beautiful rooms!', createdAt: '2026-01-03T12:00:00' },
    { id: 'FB002', guestName: 'Lisa Anderson', guestEmail: 'lisa.a@email.com', rating: 4, comments: 'Great stay, but WiFi could be faster', createdAt: '2026-01-02T18:30:00' },
];

const MOCK_ACTIVITIES = [
    { id: 'act-1', type: 'booking', description: 'New booking by John Doe for Room 102', timestamp: '2026-01-04T10:30:00', status: 'Confirmed' },
    { id: 'act-2', type: 'complaint', description: 'New complaint about AC in Room 105', timestamp: '2026-01-04T08:30:00', status: 'New' },
    { id: 'act-3', type: 'emergency', description: 'Fire emergency in Room 304', timestamp: '2026-01-04T10:50:00', status: 'New' },
    { id: 'act-4', type: 'checkin', description: 'Jane Smith checked in to Room 202', timestamp: '2026-01-04T09:00:00', status: null },
    { id: 'act-5', type: 'checkout', description: 'Michael Chen checked out from Room 301', timestamp: '2026-01-03T11:00:00', status: null },
];

// ============================================================================
// LOCAL STORAGE DATABASES HELPERS
// ============================================================================

const KEYS = {
    ROOMS: 'hotel_rooms',
    BOOKINGS: 'hotel_bookings',
    COMPLAINTS: 'hotel_complaints',
    EMERGENCIES: 'hotel_emergencies',
    FEEDBACK: 'hotel_feedback',
    USERS: 'hotel_users',
    ACTIVITIES: 'hotel_activities'
};

const getLS = (key: string, defaultVal: any) => {
    if (typeof window === 'undefined') return defaultVal;
    const val = localStorage.getItem(key);
    if (!val) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
    }
    try {
        return JSON.parse(val);
    } catch {
        return defaultVal;
    }
};

const setLS = (key: string, val: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(val));
    }
};

// Initialize LocalStorage with default seeds if empty
const initLocalStorageDB = () => {
    getLS(KEYS.ROOMS, MOCK_ROOMS);
    getLS(KEYS.BOOKINGS, MOCK_BOOKINGS);
    getLS(KEYS.COMPLAINTS, MOCK_COMPLAINTS);
    getLS(KEYS.EMERGENCIES, MOCK_EMERGENCIES);
    getLS(KEYS.FEEDBACK, MOCK_FEEDBACK);
    getLS(KEYS.USERS, MOCK_USERS);
    getLS(KEYS.ACTIVITIES, MOCK_ACTIVITIES);
};

if (typeof window !== 'undefined') {
    initLocalStorageDB();
}

// ============================================================================
// FIRESTORE AUTO-SEEDER
// ============================================================================

let hasSeededFirestore = false;

const seedAuthUsers = async () => {
    if (typeof window === 'undefined' || !auth || !db) return;
    
    // Check if auth has already been seeded in this browser session
    if (localStorage.getItem('auth_seeded') === 'true') return;
    
    const defaultAuthUsers = [
        { email: 'admin@grandhotel.com', password: 'admin123', name: 'Admin User', role: 'Admin' },
        { email: 'alice@grandhotel.com', password: 'staff123', name: 'Alice Manager', role: 'Staff' },
        { email: 'bob@grandhotel.com', password: 'staff123', name: 'Bob Security', role: 'Staff' },
        { email: 'carol@grandhotel.com', password: 'staff123', name: 'Carol Housekeeping', role: 'Staff' }
    ];
    
    console.log('Seeding Firebase Authentication users...');
    for (const u of defaultAuthUsers) {
        try {
            const userCred = await createUserWithEmailAndPassword(auth, u.email, u.password);
            const uid = userCred.user.uid;
            
            // Write/overwrite user profile to Firestore keyed by their actual Auth UID!
            await setDoc(doc(db, 'users', uid), {
                id: uid,
                name: u.name,
                email: u.email,
                role: u.role
            });
            
            console.log(`Auth user ${u.email} created successfully.`);
            await auth.signOut();
        } catch (e: any) {
            if (e.code === 'auth/email-already-in-use') {
                console.log(`Auth user ${u.email} already exists.`);
            } else {
                console.error(`Failed to create auth user ${u.email}:`, e);
            }
        }
    }
    localStorage.setItem('auth_seeded', 'true');
    console.log('Firebase Authentication seeding complete.');
};

const seedFirestoreIfEmpty = async () => {
    if (!isFirebaseConfigured || !db || hasSeededFirestore) return;
    
    try {
        const roomsSnap = await getDocs(collection(db, 'rooms'));
        if (roomsSnap.empty) {
            console.log('Seeding Firestore database with mock hotel data...');
            // Seed Rooms
            for (const item of MOCK_ROOMS) {
                await setDoc(doc(db, 'rooms', item.id), item);
            }
            // Seed Users
            for (const item of MOCK_USERS) {
                await setDoc(doc(db, 'users', item.id), item);
            }
            // Seed Bookings
            for (const item of MOCK_BOOKINGS) {
                await setDoc(doc(db, 'bookings', item.id), item);
            }
            // Seed Complaints
            for (const item of MOCK_COMPLAINTS) {
                await setDoc(doc(db, 'complaints', item.id), item);
            }
            // Seed Emergencies
            for (const item of MOCK_EMERGENCIES) {
                await setDoc(doc(db, 'emergencies', item.id), item);
            }
            // Seed Feedback
            for (const item of MOCK_FEEDBACK) {
                await setDoc(doc(db, 'feedback', item.id), item);
            }
            // Seed Activities
            for (const item of MOCK_ACTIVITIES) {
                await setDoc(doc(db, 'activities', item.id), item);
            }
            console.log('Firestore database seeded successfully.');
            
            // Also trigger auth seeding
            await seedAuthUsers();
        }
        
        hasSeededFirestore = true;
    } catch (e) {
        console.error('Failed to check/seed Firestore:', e);
    }
};

// Trigger async seeding checking
if (typeof window !== 'undefined') {
    seedFirestoreIfEmpty();
}

// ============================================================================
// API IMPLEMENTATIONS (FIREBASE VS. LOCAL STORAGE)
// ============================================================================

// --- Rooms API ---
export const roomsAPI = {
    getAll: async () => {
        if (isFirebaseConfigured && db) {
            await seedFirestoreIfEmpty();
            const snap = await getDocs(collection(db, 'rooms'));
            return snap.docs.map(doc => doc.data());
        } else {
            return getLS(KEYS.ROOMS, MOCK_ROOMS);
        }
    },
    getById: async (id: string) => {
        if (isFirebaseConfigured && db) {
            const docSnap = await getDoc(doc(db, 'rooms', id));
            return docSnap.exists() ? docSnap.data() : null;
        } else {
            const rooms = getLS(KEYS.ROOMS, MOCK_ROOMS);
            return rooms.find((r: any) => r.id === id) || null;
        }
    },
    update: async (id: string, updates: any) => {
        if (isFirebaseConfigured && db) {
            const docRef = doc(db, 'rooms', id);
            await updateDoc(docRef, updates);
            const fresh = await getDoc(docRef);
            return fresh.data();
        } else {
            const rooms = getLS(KEYS.ROOMS, MOCK_ROOMS);
            const index = rooms.findIndex((r: any) => r.id === id);
            if (index !== -1) {
                rooms[index] = { ...rooms[index], ...updates };
                setLS(KEYS.ROOMS, rooms);
                return rooms[index];
            }
            throw new Error('Room not found');
        }
    }
};

// --- Activities Utility ---
const addActivity = async (activity: any) => {
    const actId = `act-${Date.now()}`;
    const newAct = {
        id: actId,
        timestamp: new Date().toISOString(),
        ...activity
    };

    if (isFirebaseConfigured && db) {
        await setDoc(doc(db, 'activities', actId), newAct);
    } else {
        const list = getLS(KEYS.ACTIVITIES, MOCK_ACTIVITIES);
        list.unshift(newAct);
        setLS(KEYS.ACTIVITIES, list);
    }
};

// --- Bookings API ---
export const bookingsAPI = {
    getAll: async () => {
        if (isFirebaseConfigured && db) {
            const snap = await getDocs(collection(db, 'bookings'));
            return snap.docs.map(doc => doc.data());
        } else {
            return getLS(KEYS.BOOKINGS, MOCK_BOOKINGS);
        }
    },
    getById: async (id: string) => {
        if (isFirebaseConfigured && db) {
            const docSnap = await getDoc(doc(db, 'bookings', id));
            return docSnap.exists() ? docSnap.data() : null;
        } else {
            const list = getLS(KEYS.BOOKINGS, MOCK_BOOKINGS);
            return list.find((b: any) => b.id === id) || null;
        }
    },
    create: async (booking: any) => {
        const id = booking.id || `BK-${Date.now()}`;
        const newBooking = {
            ...booking,
            id,
            createdAt: new Date().toISOString(),
            status: booking.status || 'Pending'
        };

        if (isFirebaseConfigured && db) {
            await setDoc(doc(db, 'bookings', id), newBooking);
            // Toggle room availability
            if (booking.roomId) {
                await roomsAPI.update(booking.roomId, { available: false });
            }
        } else {
            const list = getLS(KEYS.BOOKINGS, MOCK_BOOKINGS);
            list.unshift(newBooking);
            setLS(KEYS.BOOKINGS, list);
            if (booking.roomId) {
                const rooms = getLS(KEYS.ROOMS, MOCK_ROOMS);
                const index = rooms.findIndex((r: any) => r.id === booking.roomId);
                if (index !== -1) {
                    rooms[index].available = false;
                    setLS(KEYS.ROOMS, rooms);
                }
            }
        }

        // Add activity audit entry
        await addActivity({
            type: 'booking',
            description: `New booking by ${booking.guestName} for Room ${booking.roomNumber}`,
            status: newBooking.status
        });

        return newBooking;
    },
    update: async (id: string, updates: any) => {
        if (isFirebaseConfigured && db) {
            const docRef = doc(db, 'bookings', id);
            await updateDoc(docRef, updates);
            const fresh = await getDoc(docRef);
            return fresh.data();
        } else {
            const list = getLS(KEYS.BOOKINGS, MOCK_BOOKINGS);
            const index = list.findIndex((b: any) => b.id === id);
            if (index !== -1) {
                list[index] = { ...list[index], ...updates };
                setLS(KEYS.BOOKINGS, list);
                return list[index];
            }
            throw new Error('Booking not found');
        }
    }
};

// --- Complaints API ---
export const complaintsAPI = {
    getAll: async () => {
        if (isFirebaseConfigured && db) {
            const snap = await getDocs(collection(db, 'complaints'));
            return snap.docs.map(doc => doc.data());
        } else {
            return getLS(KEYS.COMPLAINTS, MOCK_COMPLAINTS);
        }
    },
    getById: async (id: string) => {
        if (isFirebaseConfigured && db) {
            const docSnap = await getDoc(doc(db, 'complaints', id));
            return docSnap.exists() ? docSnap.data() : null;
        } else {
            const list = getLS(KEYS.COMPLAINTS, MOCK_COMPLAINTS);
            return list.find((c: any) => c.id === id) || null;
        }
    },
    create: async (complaint: any) => {
        const id = `CMP-${Date.now()}`;
        const newComplaint = {
            ...complaint,
            id,
            createdAt: new Date().toISOString(),
            status: complaint.status || 'New',
            assignedTo: complaint.assignedTo || null,
            notes: complaint.notes || null,
            resolvedAt: complaint.resolvedAt || null
        };

        if (isFirebaseConfigured && db) {
            await setDoc(doc(db, 'complaints', id), newComplaint);
        } else {
            const list = getLS(KEYS.COMPLAINTS, MOCK_COMPLAINTS);
            list.unshift(newComplaint);
            setLS(KEYS.COMPLAINTS, list);
        }

        await addActivity({
            type: 'complaint',
            description: `New complaint: ${complaint.category} - ${String(complaint.description).slice(0, 50)}`,
            status: newComplaint.status
        });

        return newComplaint;
    },
    update: async (id: string, updates: any) => {
        if (isFirebaseConfigured && db) {
            const docRef = doc(db, 'complaints', id);
            await updateDoc(docRef, updates);
            const fresh = await getDoc(docRef);
            return fresh.data();
        } else {
            const list = getLS(KEYS.COMPLAINTS, MOCK_COMPLAINTS);
            const index = list.findIndex((c: any) => c.id === id);
            if (index !== -1) {
                list[index] = { ...list[index], ...updates };
                setLS(KEYS.COMPLAINTS, list);
                return list[index];
            }
            throw new Error('Complaint not found');
        }
    }
};

// --- Emergencies API ---
export const emergenciesAPI = {
    getAll: async () => {
        if (isFirebaseConfigured && db) {
            const snap = await getDocs(collection(db, 'emergencies'));
            return snap.docs.map(doc => doc.data());
        } else {
            return getLS(KEYS.EMERGENCIES, MOCK_EMERGENCIES);
        }
    },
    getById: async (id: string) => {
        if (isFirebaseConfigured && db) {
            const docSnap = await getDoc(doc(db, 'emergencies', id));
            return docSnap.exists() ? docSnap.data() : null;
        } else {
            const list = getLS(KEYS.EMERGENCIES, MOCK_EMERGENCIES);
            return list.find((e: any) => e.id === id) || null;
        }
    },
    create: async (emergency: any) => {
        const id = `EMG-${Date.now()}`;
        const newEmergency = {
            ...emergency,
            id,
            createdAt: new Date().toISOString(),
            status: emergency.status || 'New',
            acknowledgedAt: emergency.acknowledgedAt || null,
            resolvedAt: emergency.resolvedAt || null,
            respondedBy: emergency.respondedBy || null
        };

        if (isFirebaseConfigured && db) {
            await setDoc(doc(db, 'emergencies', id), newEmergency);
        } else {
            const list = getLS(KEYS.EMERGENCIES, MOCK_EMERGENCIES);
            list.unshift(newEmergency);
            setLS(KEYS.EMERGENCIES, list);
        }

        await addActivity({
            type: 'emergency',
            description: `${emergency.type} emergency: ${emergency.description}`,
            status: newEmergency.status
        });

        return newEmergency;
    },
    update: async (id: string, updates: any) => {
        if (isFirebaseConfigured && db) {
            const docRef = doc(db, 'emergencies', id);
            await updateDoc(docRef, updates);
            const fresh = await getDoc(docRef);
            return fresh.data();
        } else {
            const list = getLS(KEYS.EMERGENCIES, MOCK_EMERGENCIES);
            const index = list.findIndex((e: any) => e.id === id);
            if (index !== -1) {
                list[index] = { ...list[index], ...updates };
                setLS(KEYS.EMERGENCIES, list);
                return list[index];
            }
            throw new Error('Emergency not found');
        }
    }
};

// --- Feedback API ---
export const feedbackAPI = {
    getAll: async () => {
        if (isFirebaseConfigured && db) {
            const snap = await getDocs(collection(db, 'feedback'));
            return snap.docs.map(doc => doc.data());
        } else {
            return getLS(KEYS.FEEDBACK, MOCK_FEEDBACK);
        }
    },
    create: async (feedback: any) => {
        const id = `FB-${Date.now()}`;
        const newFB = {
            ...feedback,
            id,
            createdAt: new Date().toISOString()
        };

        if (isFirebaseConfigured && db) {
            await setDoc(doc(db, 'feedback', id), newFB);
        } else {
            const list = getLS(KEYS.FEEDBACK, MOCK_FEEDBACK);
            list.unshift(newFB);
            setLS(KEYS.FEEDBACK, list);
        }

        return newFB;
    }
};

// --- Staff API ---
export const staffAPI = {
    getAll: async () => {
        if (isFirebaseConfigured && db) {
            const snap = await getDocs(collection(db, 'users'));
            const list = snap.docs.map(doc => doc.data());
            return list.filter((u: any) => u.role === 'Staff' || u.role === 'Admin');
        } else {
            const users = getLS(KEYS.USERS, MOCK_USERS);
            return users.filter((u: any) => u.role === 'Staff' || u.role === 'Admin');
        }
    },
    getById: async (id: string) => {
        if (isFirebaseConfigured && db) {
            const docSnap = await getDoc(doc(db, 'users', id));
            return docSnap.exists() ? docSnap.data() : null;
        } else {
            const users = getLS(KEYS.USERS, MOCK_USERS);
            return users.find((u: any) => u.id === id) || null;
        }
    },
    create: async (staff: any) => {
        const id = staff.id || `staff-${Date.now()}`;
        const newStaff = {
            ...staff,
            id,
            role: staff.role || 'Staff'
        };

        if (isFirebaseConfigured && db) {
            await setDoc(doc(db, 'users', id), newStaff);
        } else {
            const users = getLS(KEYS.USERS, MOCK_USERS);
            users.push(newStaff);
            setLS(KEYS.USERS, users);
        }

        return newStaff;
    },
    update: async (id: string, updates: any) => {
        if (isFirebaseConfigured && db) {
            const docRef = doc(db, 'users', id);
            await updateDoc(docRef, updates);
            const fresh = await getDoc(docRef);
            return fresh.data();
        } else {
            const users = getLS(KEYS.USERS, MOCK_USERS);
            const index = users.findIndex((u: any) => u.id === id);
            if (index !== -1) {
                users[index] = { ...users[index], ...updates };
                setLS(KEYS.USERS, users);
                return users[index];
            }
            throw new Error('User not found');
        }
    },
    delete: async (id: string) => {
        if (isFirebaseConfigured && db) {
            await deleteDoc(doc(db, 'users', id));
            return true;
        } else {
            const users = getLS(KEYS.USERS, MOCK_USERS);
            const filtered = users.filter((u: any) => u.id !== id);
            setLS(KEYS.USERS, filtered);
            return true;
        }
    }
};

// --- Auth API ---
export const authAPI = {
    login: async (email: string, password: string): Promise<any> => {
        if (isFirebaseConfigured && auth && db) {
            try {
                const userCred = await signInWithEmailAndPassword(auth, email, password);
                const uid = userCred.user.uid;
                const docSnap = await getDoc(doc(db, 'users', uid));
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    return {
                        success: true,
                        user: userData as any,
                        token: `fb-jwt-${uid}`
                    };
                }
                // Fallback: If in auth but not in users table yet, create profile
                const fallbackUser = { id: uid, name: email.split('@')[0], email, role: 'customer' as const };
                await setDoc(doc(db, 'users', uid), fallbackUser);
                return {
                    success: true,
                    user: fallbackUser as any,
                    token: `fb-jwt-${uid}`
                };
            } catch (e: any) {
                console.error('Firebase signin failure:', e);
                throw new Error(e.message || 'Invalid credentials');
            }
        } else {
            // LocalStorage auth
            const users = getLS(KEYS.USERS, MOCK_USERS);
            const matched = users.find((u: any) => u.email === email && u.password === password);
            if (matched) {
                return {
                    success: true,
                    user: {
                        id: matched.id,
                        name: matched.name,
                        email: matched.email,
                        role: matched.role as any
                    },
                    token: `mock-jwt-token-${Date.now()}`
                };
            }
            throw new Error('Invalid credentials');
        }
    },
    loginWithGoogle: async (): Promise<any> => {
        if (isFirebaseConfigured && auth && db) {
            try {
                const provider = new GoogleAuthProvider();
                const userCred = await signInWithPopup(auth, provider);
                const uid = userCred.user.uid;
                const email = userCred.user.email || '';
                const name = userCred.user.displayName || email.split('@')[0] || 'Google User';
                const phone = userCred.user.phoneNumber || '';
                
                const docSnap = await getDoc(doc(db, 'users', uid));
                let userData: any;
                if (docSnap.exists()) {
                    userData = docSnap.data();
                } else {
                    userData = {
                        id: uid,
                        name,
                        email,
                        phone,
                        role: 'customer' as const
                    };
                    await setDoc(doc(db, 'users', uid), userData);
                }
                return {
                    success: true,
                    user: userData,
                    token: `fb-jwt-${uid}`
                };
            } catch (e: any) {
                console.error('Firebase Google signin failure:', e);
                throw new Error(e.message || 'Google signin failed');
            }
        } else {
            // LocalStorage fallback login for Google
            const uid = 'google-mock-uid';
            const userData = {
                id: uid,
                name: 'Google Mock User',
                email: 'google@grandhotel.com',
                role: 'customer' as const
            };
            const users = getLS(KEYS.USERS, MOCK_USERS);
            if (!users.some((u: any) => u.id === uid)) {
                users.push(userData);
                setLS(KEYS.USERS, users);
            }
            return {
                success: true,
                user: userData,
                token: `mock-jwt-token-google`
            };
        }
    },
    loginWithApple: async (): Promise<any> => {
        if (isFirebaseConfigured && auth && db) {
            try {
                const provider = new OAuthProvider('apple.com');
                const userCred = await signInWithPopup(auth, provider);
                const uid = userCred.user.uid;
                const email = userCred.user.email || '';
                const name = userCred.user.displayName || email.split('@')[0] || 'Apple User';
                const phone = userCred.user.phoneNumber || '';
                
                const docSnap = await getDoc(doc(db, 'users', uid));
                let userData: any;
                if (docSnap.exists()) {
                    userData = docSnap.data();
                } else {
                    userData = {
                        id: uid,
                        name,
                        email,
                        phone,
                        role: 'customer' as const
                    };
                    await setDoc(doc(db, 'users', uid), userData);
                }
                return {
                    success: true,
                    user: userData,
                    token: `fb-jwt-${uid}`
                };
            } catch (e: any) {
                console.error('Firebase Apple signin failure:', e);
                throw new Error(e.message || 'Apple signin failed');
            }
        } else {
            // LocalStorage fallback login for Apple
            const uid = 'apple-mock-uid';
            const userData = {
                id: uid,
                name: 'Apple Mock User',
                email: 'apple@grandhotel.com',
                role: 'customer' as const
            };
            const users = getLS(KEYS.USERS, MOCK_USERS);
            if (!users.some((u: any) => u.id === uid)) {
                users.push(userData);
                setLS(KEYS.USERS, users);
            }
            return {
                success: true,
                user: userData,
                token: `mock-jwt-token-apple`
            };
        }
    },
    register: async (userData: any): Promise<any> => {
        if (isFirebaseConfigured && auth && db) {
            try {
                const userCred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
                const uid = userCred.user.uid;
                const newProfile = {
                    id: uid,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone || '',
                    role: 'customer' as const
                };
                await setDoc(doc(db, 'users', uid), newProfile);
                return {
                    success: true,
                    user: newProfile as any,
                    token: `fb-jwt-${uid}`
                };
            } catch (e: any) {
                console.error('Firebase signup failure:', e);
                throw new Error(e.message || 'Registration failed');
            }
        } else {
            // LocalStorage register
            const users = getLS(KEYS.USERS, MOCK_USERS);
            const exists = users.some((u: any) => u.email === userData.email);
            if (exists) {
                throw new Error('User already exists');
            }

            const uid = `user-${Date.now()}`;
            const newProfile = {
                id: uid,
                name: userData.name,
                email: userData.email,
                phone: userData.phone || '',
                password: userData.password,
                role: 'customer' as const
            };

            users.push(newProfile);
            setLS(KEYS.USERS, users);

            return {
                success: true,
                user: {
                    id: uid,
                    name: userData.name,
                    email: userData.email,
                    role: 'customer' as any
                },
                token: `mock-jwt-token-${Date.now()}`
            };
        }
    },
    verify: async () => {
        if (isFirebaseConfigured && auth) {
            return new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    unsubscribe();
                    if (user) {
                        resolve({ valid: true });
                    } else {
                        resolve({ valid: false });
                    }
                });
            });
        } else {
            const token = localStorage.getItem('token') || '';
            if (token.startsWith('mock-jwt-token-') || token.startsWith('fb-jwt-')) {
                return { valid: true };
            }
            return { valid: false };
        }
    }
};

// --- Users API ---
export const usersAPI = {
    getAll: async () => {
        if (isFirebaseConfigured && db) {
            const snap = await getDocs(collection(db, 'users'));
            return snap.docs.map(doc => doc.data());
        } else {
            return getLS(KEYS.USERS, MOCK_USERS);
        }
    },
    delete: async (id: string) => {
        if (isFirebaseConfigured && db) {
            await deleteDoc(doc(db, 'users', id));
            return true;
        } else {
            const users = getLS(KEYS.USERS, MOCK_USERS);
            const filtered = users.filter((u: any) => u.id !== id);
            setLS(KEYS.USERS, filtered);
            return true;
        }
    }
};

// --- Analytics API ---
export const analyticsAPI = {
    getAnalytics: async () => {
        const bookings = await bookingsAPI.getAll();
        const complaints = await complaintsAPI.getAll();
        const emergencies = await emergenciesAPI.getAll();
        const feedback = await feedbackAPI.getAll();
        const rooms = await roomsAPI.getAll();

        const complaintsCounts = [
            { status: 'New', count: complaints.filter((c: any) => c.status === 'New').length },
            { status: 'In Progress', count: complaints.filter((c: any) => c.status === 'In Progress').length },
            { status: 'Resolved', count: complaints.filter((c: any) => c.status === 'Resolved').length },
        ];

        const emergencyCounts = [
            { type: 'Medical', count: emergencies.filter((e: any) => e.type === 'Medical').length },
            { type: 'Fire', count: emergencies.filter((e: any) => e.type === 'Fire').length },
            { type: 'Security', count: emergencies.filter((e: any) => e.type === 'Security').length },
            { type: 'Other', count: emergencies.filter((e: any) => e.type === 'Other').length },
        ];

        const totalRooms = rooms.length;
        const bookedRooms = bookings.filter((b: any) => b.status === 'Confirmed' && new Date(b.checkOut) > new Date()).length;
        const occupancyRate = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;
        
        const sumRatings = feedback.reduce((sum: number, f: any) => sum + f.rating, 0);
        const avgRating = feedback.length > 0 ? Math.round((sumRatings / feedback.length) * 10) / 10 : 4.5;

        // Static bookings monthly mock trend matching original design
        const bookingsByMonth = [
            { name: 'Jan', bookings: 12 },
            { name: 'Feb', bookings: 19 },
            { name: 'Mar', bookings: 32 },
            { name: 'Apr', bookings: 45 },
            { name: 'May', bookings: 54 },
            { name: 'Jun', bookings: bookedRooms + 60 },
        ];

        return {
            bookingsByMonth,
            complaintsCounts,
            emergencyCounts,
            occupancyRate,
            avgRating
        };
    },
    getActivity: async () => {
        if (isFirebaseConfigured && db) {
            const q = query(collection(db, 'activities'), orderBy('timestamp', 'desc'));
            const snap = await getDocs(q);
            return snap.docs.map(doc => doc.data());
        } else {
            return getLS(KEYS.ACTIVITIES, MOCK_ACTIVITIES);
        }
    }
};
