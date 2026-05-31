'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/context/DataContext';
import { CheckCircle, Calendar, Users, Home, DollarSign } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function BookingConfirmation() {
    const params = useParams();
    const bookingId = params.bookingId as string;
    const { bookings } = useData();

    const booking = bookings.find(b => b.id === bookingId);

    if (!booking) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
                <p className="text-xl text-gray-600">Booking not found</p>
                <Link href="/">
                    <Button className="mt-4">Return Home</Button>
                </Link>
            </div>
        );
    }

    const nights = Math.ceil(
        (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                <p className="text-gray-600">Your reservation has been successfully submitted</p>
            </div>

            <Card>
                <CardHeader className="bg-primary text-primary-foreground">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">Booking Details</CardTitle>
                            <p className="text-sm opacity-90 mt-1">Booking ID: {booking.id}</p>
                        </div>
                        <Badge
                            variant={booking.status === 'Confirmed' ? 'success' : 'warning'}
                            className="text-sm"
                        >
                            {booking.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Guest Information</h3>
                        <div className="space-y-2 text-gray-700">
                            <p><span className="font-medium">Name:</span> {booking.guestName}</p>
                            <p><span className="font-medium">Email:</span> {booking.guestEmail}</p>
                            <p><span className="font-medium">Phone:</span> {booking.guestPhone}</p>
                        </div>
                    </div>

                    <hr />

                    <div>
                        <h3 className="font-semibold text-lg mb-3">Reservation Details</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start space-x-3">
                                <Home className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Room</p>
                                    <p className="font-medium">{booking.roomType} - #{booking.roomNumber}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Users className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Guests</p>
                                    <p className="font-medium">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Check-in</p>
                                    <p className="font-medium">{formatDate(booking.checkIn)}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Check-out</p>
                                    <p className="font-medium">{formatDate(booking.checkOut)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div>
                        <div className="flex items-start space-x-3 mb-4">
                            <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 mb-2">Payment Summary</p>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Room rate ({nights} night{nights > 1 ? 's' : ''})</span>
                                        <span>${booking.totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                        <span>Total</span>
                                        <span className="text-primary">${booking.totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {booking.specialRequests && (
                        <>
                            <hr />
                            <div>
                                <h3 className="font-semibold mb-2">Special Requests</h3>
                                <p className="text-gray-700">{booking.specialRequests}</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <div className="mt-8 text-center space-y-4">
                <p className="text-gray-600">
                    A confirmation email has been sent to <span className="font-medium">{booking.guestEmail}</span>
                </p>
                <div className="flex justify-center space-x-3">
                    <Link href="/">
                        <Button variant="outline">Return Home</Button>
                    </Link>
                    <Link href="/chat">
                        <Button>Chat with Support</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
