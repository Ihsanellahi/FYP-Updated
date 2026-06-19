'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

// ✅ Fetch booking directly from Firebase REST API — does not depend on state loading


function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { updateBooking } = useData();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    const bookingId = searchParams.get('bookingId');
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (!bookingId || !sessionId) {
            setStatus('error');
            return;
        }

        const processPayment = async () => {
    try {
        // ✅ Step 1 — Read all data from URL params (most reliable)
        const totalPrice = Number(searchParams.get('totalPrice')) || 0;
        const guestName = searchParams.get('guestName') || '';
        const guestEmail = searchParams.get('guestEmail') || '';
        const guestPhone = searchParams.get('guestPhone') || '';
        const roomNumber = searchParams.get('roomNumber') || '';
        const roomType = searchParams.get('roomType') || '';
        const checkIn = searchParams.get('checkIn') || '';
        const checkOut = searchParams.get('checkOut') || '';
        const guests = Number(searchParams.get('guests')) || 1;
        const specialRequests = searchParams.get('specialRequests') || 'None';

        // ✅ Step 2 — Update booking status to Confirmed in Firebase
        await updateBooking(bookingId, { status: 'Confirmed' });

        // ✅ Step 3 — Send to Orchestrator with complete data from URL
        fetch(process.env.NEXT_PUBLIC_N8N_ORCHESTRATOR_WEBHOOK!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                source: 'booking',
                data: {
                    bookingId,
                    guestName,
                    guestEmail,
                    guestPhone,
                    roomNumber,
                    roomType,
                    checkIn,
                    checkOut,
                    guests,
                    totalPrice,
                    status: 'Confirmed',
                    paymentMethod: 'Online',
                    specialRequests,
                    createdAt: new Date().toISOString(),
                },
            }),
        }).catch((err) => console.error('n8n orchestrator error:', err));

        setStatus('success');
    } catch (error) {
        console.error('Failed to process payment success:', error);
        setStatus('error');
    }
};

// Small delay to ensure Stripe redirect is complete
setTimeout(processPayment, 1000);

        // Small delay to ensure Stripe redirect is complete
        setTimeout(processPayment, 1500);
    }, [bookingId, sessionId]);

    if (status === 'loading') {
        return (
            <div className="container mx-auto px-4 py-16 max-w-lg text-center font-sans">
                <Card>
                    <CardContent className="pt-12 pb-12">
                        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Processing your payment...</h2>
                        <p className="text-gray-600">Please wait while we confirm your booking.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="container mx-auto px-4 py-16 max-w-lg text-center font-sans">
                <Card className="border-red-200">
                    <CardContent className="pt-12 pb-12">
                        <div className="text-5xl mb-4">❌</div>
                        <h2 className="text-xl font-bold mb-2 text-red-700">Something went wrong</h2>
                        <p className="text-gray-600 mb-6">We could not confirm your booking. Please contact support.</p>
                        <Button onClick={() => router.push('/')}>Return Home</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-lg font-sans">
            <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-12 pb-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-green-900 mb-2">Payment Successful!</h1>
                    <p className="text-green-800 mb-2 font-medium">Your booking is now confirmed.</p>
                    <p className="text-green-700 text-sm mb-6">
                        A confirmation email and WhatsApp message have been sent to you.
                    </p>

                    <div className="bg-white rounded-lg p-4 mb-6 border border-green-200">
                        <p className="text-sm text-gray-600">Booking ID</p>
                        <p className="font-bold text-lg text-gray-900">{bookingId}</p>
                    </div>

                    <div className="space-x-3">
                        <Button
                            onClick={() => router.push(`/booking-confirmation/${bookingId}`)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            View Booking Details
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/')}>
                            Return Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}