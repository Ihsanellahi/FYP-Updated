import { NextRequest } from 'next/server';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK once
function getAdminDb() {
    let app: App;
    if (getApps().length === 0) {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountKey) {
            app = initializeApp({
                credential: cert(JSON.parse(serviceAccountKey)),
            });
        } else {
            // No service account — use project ID alone
            // This works because Firestore rules allow all reads/writes currently
            app = initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
            });
        }
    } else {
        app = getApps()[0];
    }
    return getFirestore(app);
}

// POST /api/bookings — Create a new booking
export async function POST(req: NextRequest) {
    try {
        const booking = await req.json();

        if (!booking || !booking.guestName || !booking.roomId || !booking.checkIn || !booking.checkOut) {
            return Response.json({ success: false, error: 'Missing required booking fields' }, { status: 400 });
        }

        const id = booking.id || `BK-${Date.now()}`;
        const newBooking = {
            ...booking,
            id,
            status: booking.status || 'Pending',
            createdAt: new Date().toISOString(),
        };

        const db = getAdminDb();
        await db.collection('bookings').doc(id).set(newBooking);

        // Log activity
        const actId = `act-${Date.now()}`;
        await db.collection('activities').doc(actId).set({
            id: actId,
            type: 'booking',
            description: `New booking by ${newBooking.guestName} for Room ${newBooking.roomNumber || ''}`,
            status: newBooking.status,
            timestamp: new Date().toISOString(),
        });

        console.log(`[/api/bookings] ✅ Booking ${id} saved to Firestore`);
        return Response.json({ success: true, booking: newBooking });
    } catch (error: any) {
        console.error('[/api/bookings] ❌ Error saving booking:', error);
        return Response.json({ success: false, error: error.message || 'Failed to save booking' }, { status: 500 });
    }
}

// GET /api/bookings — Fetch all bookings
export async function GET() {
    try {
        const db = getAdminDb();
        const snap = await db.collection('bookings').get();
        const bookings = snap.docs.map(doc => doc.data());
        return Response.json({ success: true, bookings });
    } catch (error: any) {
        console.error('[/api/bookings] ❌ Error fetching bookings:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
