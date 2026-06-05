const fs = require('fs');

// Read .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    if (line.includes('=')) {
        const [key, ...rest] = line.split('=');
        env[key.trim()] = rest.join('=').trim().replace(/['"]/g, '');
    }
});

const PROJECT_ID = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = env.NEXT_PUBLIC_FIREBASE_API_KEY;

console.log('Project ID:', PROJECT_ID);
console.log('API Key available:', !!API_KEY);

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function test() {
    const data = {
        guestName: "Test User",
        roomId: "room-123",
        checkIn: "2026-06-10",
        checkOut: "2026-06-15",
        status: "Pending"
    };

    function toFirestoreFields(obj) {
        const fields = {};
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

    const docId = `BK-TEST-${Date.now()}`;
    const url = `${FIRESTORE_BASE}/bookings/${docId}?key=${API_KEY}`;
    console.log('Calling URL:', url.replace(API_KEY, 'REDACTED'));

    const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: toFirestoreFields(data) }),
    });

    if (!res.ok) {
        console.error('Error:', res.status, await res.text());
    } else {
        console.log('Success!', await res.json());
    }
}

test();
