'use client';

import React, { useState, type FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/context/DataContext';
import { getRoomById } from '@/data/mockData';
import { generateId } from '@/lib/utils';
import type { Booking } from '@/types';

function BookingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addBooking } = useData();
    const preselectedRoomId = searchParams.get('roomId');

    const [formData, setFormData] = useState({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        roomId: preselectedRoomId || '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        specialRequests: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.guestName.trim()) newErrors.guestName = 'Name is required';
        if (!formData.guestEmail.trim()) newErrors.guestEmail = 'Email is required';
        if (!formData.guestPhone.trim()) newErrors.guestPhone = 'Phone is required';
        if (!formData.roomId) newErrors.roomId = 'Please select a room';
        if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
        if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';

        if (formData.checkIn && formData.checkOut && formData.checkOut <= formData.checkIn) {
            newErrors.checkOut = 'Check-out must be after check-in';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const room = getRoomById(formData.roomId);
        if (!room) return;

        // Calculate total price
        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = room.price * nights;

        const newBooking: Booking = {
            id: 'BK' + generateId().toUpperCase(),
            guestName: formData.guestName,
            guestEmail: formData.guestEmail,
            guestPhone: formData.guestPhone,
            roomId: formData.roomId,
            roomNumber: room.number,
            roomType: room.type,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            guests: formData.guests,
            totalPrice,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            specialRequests: formData.specialRequests || undefined,
        };

        try {
            await addBooking(newBooking);
            router.push(`/booking-confirmation/${newBooking.id}`);
        } catch (err) {
            console.error('Failed to book:', err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Book Your Room</CardTitle>
                    <p className="text-gray-600">Fill in the details below to complete your booking</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name *</label>
                            <Input
                                value={formData.guestName}
                                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                placeholder="John Doe"
                            />
                            {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <Input
                                type="email"
                                value={formData.guestEmail}
                                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                                placeholder="john@example.com"
                            />
                            {errors.guestEmail && <p className="text-red-500 text-xs mt-1">{errors.guestEmail}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number *</label>
                            <Input
                                type="tel"
                                value={formData.guestPhone}
                                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                                placeholder="+1234567890"
                            />
                            {errors.guestPhone && <p className="text-red-500 text-xs mt-1">{errors.guestPhone}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Room Type *</label>
                            <Select
                                value={formData.roomId}
                                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                            >
                                <option value="">Select a room</option>
                                <option value="room-1">Single Room - $99/night</option>
                                <option value="room-2">Double Room - $149/night</option>
                                <option value="room-3">Suite - $299/night</option>
                                <option value="room-5">Presidential Suite - $799/night</option>
                            </Select>
                            {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId}</p>}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Check-in Date *</label>
                                <Input
                                    type="date"
                                    value={formData.checkIn}
                                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Check-out Date *</label>
                                <Input
                                    type="date"
                                    value={formData.checkOut}
                                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                />
                                {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Number of Guests *</label>
                            <Select
                                value={formData.guests.toString()}
                                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                            >
                                <option value="1">1 Guest</option>
                                <option value="2">2 Guests</option>
                                <option value="3">3 Guests</option>
                                <option value="4">4 Guests</option>
                                <option value="5">5 Guests</option>
                                <option value="6">6 Guests</option>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Special Requests (Optional)</label>
                            <Textarea
                                value={formData.specialRequests}
                                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                placeholder="Any special requests or requirements..."
                                rows={3}
                            />
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <Button type="submit" className="flex-1">
                                Confirm Booking
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/availability')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[40vh] items-center justify-center font-sans">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        }>
            <BookingContent />
        </Suspense>
    );
}
