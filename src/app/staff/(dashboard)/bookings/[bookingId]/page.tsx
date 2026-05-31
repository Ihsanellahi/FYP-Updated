'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { ArrowLeft, Calendar, Users, Home, DollarSign } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { BookingStatus } from '@/types';

export default function BookingDetails() {
    const params = useParams();
    const bookingId = params.bookingId as string;
    const router = useRouter();
    const { bookings, updateBooking } = useData();

    const booking = bookings.find((b) => b.id === bookingId);
    const [status, setStatus] = useState<BookingStatus>(booking?.status || 'Pending');

    if (!booking) {
        return (
            <div className="text-center py-12 font-sans">
                <p className="text-xl text-gray-600">Booking not found</p>
                <Button onClick={() => router.push('/staff/bookings')} className="mt-4">
                    Back to Bookings
                </Button>
            </div>
        );
    }

    const handleStatusChange = async (newStatus: BookingStatus) => {
        setStatus(newStatus);
        try {
            await updateBooking(booking.id, { status: newStatus });
        } catch (error) {
            console.error('Failed to update booking:', error);
            // Revert status on error
            setStatus(booking.status);
        }
    };

    const nights = Math.ceil(
        (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );

    const getStatusVariant = (s: BookingStatus) => {
        switch (s) {
            case 'Confirmed': return 'success';
            case 'Pending': return 'warning';
            case 'Cancelled': return 'destructive';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" onClick={() => router.push('/staff/bookings')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Booking Details</h1>
                        <p className="text-gray-600">Booking ID: {booking.id}</p>
                    </div>
                </div>
                <Badge variant={getStatusVariant(status)} className="text-sm px-4 py-2">
                    {status}
                </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Guest Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium">{booking.guestName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{booking.guestEmail}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium">{booking.guestPhone}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Booking Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Update Status</label>
                            <Select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Completed">Completed</option>
                            </Select>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Booked on</p>
                            <p className="font-medium">{formatDate(booking.createdAt)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Reservation Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-start space-x-3">
                            <Home className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-600">Room</p>
                                <p className="font-medium">{booking.roomType}</p>
                                <p className="text-sm text-gray-500">#{booking.roomNumber}</p>
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
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start space-x-3">
                        <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
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
                </CardContent>
            </Card>

            {booking.specialRequests && (
                <Card>
                    <CardHeader>
                        <CardTitle>Special Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">{booking.specialRequests}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
