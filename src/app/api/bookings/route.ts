import { NextRequest } from 'next/server';

export const maxDuration = 60; // Set max timeout to 60 seconds for Vercel

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Convert a plain JS object to Firestore REST API document format
function toFirestoreFields(obj: Record<string, any>): Record<string, any> {
    const fields: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
        if (val === null || val === undefined) {
            fields[key] = { nullValue: null };
        } else if (typeof val === 'boolean') {
            fields[key] = { booleanValue: val };
        } else if (typeof val === 'number') {
            fields[key] = { doubleValue: val };
        } else if (typeof val === 'string') {
            fields[key] = { stringValue: val };
        } else if (typeof val === 'object') {
            fields[key] = { stringValue: JSON.stringify(val) };
        }
    }
    return fields;
}

// Write a document to Firestore via REST API
async function writeDocument(collection: string, docId: string, data: Record<string, any>) {
    const url = `${FIRESTORE_BASE}/${collection}/${docId}?key=${API_KEY}`;
    const body = { fields: toFirestoreFields(data) };

    const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Firestore write failed (${res.status}): ${err}`);
    }
    return await res.json();
}

// POST /api/bookings — Create a new booking via Firestore REST API
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

        await writeDocument('bookings', id, newBooking);

        // Log activity
        const actId = `act-${Date.now()}`;
        await writeDocument('activities', actId, {
            id: actId,
            type: 'booking',
            description: `New booking by ${newBooking.guestName} for Room ${newBooking.roomNumber || ''}`,
            status: newBooking.status,
            timestamp: new Date().toISOString(),
        });

        console.log(`[/api/bookings] ✅ Booking ${id} saved to Firestore via REST API`);
        return Response.json({ success: true, booking: newBooking });
    } catch (error: any) {
        console.error('[/api/bookings] ❌ Error saving booking:', error);
        return Response.json({ success: false, error: error.message || 'Failed to save booking' }, { status: 500 });
    }
}

// GET /api/bookings — Fetch all bookings via Firestore REST API
export async function GET() {
    try {
        const url = `${FIRESTORE_BASE}/bookings?key=${API_KEY}&pageSize=200`;
        const res = await fetch(url);
        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Firestore read failed (${res.status}): ${err}`);
        }
        const data = await res.json();
        const bookings = (data.documents || []).map((doc: any) => {
            const out: Record<string, any> = {};
            for (const [k, v] of Object.entries(doc.fields as Record<string, any>)) {
                out[k] = v.stringValue ?? v.doubleValue ?? v.booleanValue ?? v.nullValue ?? null;
            }
            return out;
        });
        return Response.json({ success: true, bookings });
    } catch (error: any) {
        console.error('[/api/bookings] ❌ Error fetching bookings:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
