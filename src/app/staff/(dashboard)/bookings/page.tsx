'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Eye } from 'lucide-react';
import type { BookingStatus } from '@/types';

export default function BookingsList() {
    const { bookings } = useData();
    const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBookings = bookings.filter((booking) => {
        const matchesStatus = !statusFilter || booking.status === statusFilter;
        const matchesSearch =
            !searchTerm ||
            booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusVariant = (status: BookingStatus) => {
        switch (status) {
            case 'Confirmed':
                return 'success';
            case 'Pending':
                return 'warning';
            case 'Cancelled':
                return 'destructive';
            default:
                return 'default';
        }
    };

    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
                <p className="text-gray-600">View and manage all hotel bookings</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                        <CardTitle>All Bookings</CardTitle>
                        <div className="flex space-x-3">
                            <Input
                                placeholder="Search by name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64"
                            />
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as BookingStatus | '')}
                            >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Completed">Completed</option>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Booking ID</TableHead>
                                <TableHead>Guest Name</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Check-in</TableHead>
                                <TableHead>Check-out</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="font-medium">{booking.id}</TableCell>
                                    <TableCell>{booking.guestName}</TableCell>
                                    <TableCell>
                                        {booking.roomType} - #{booking.roomNumber}
                                    </TableCell>
                                    <TableCell>{formatDate(booking.checkIn)}</TableCell>
                                    <TableCell>{formatDate(booking.checkOut)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(booking.status)}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${booking.totalPrice}</TableCell>
                                    <TableCell>
                                        <Link href={`/staff/bookings/${booking.id}`}>
                                            <button className="text-primary hover:text-primary/80 flex items-center space-x-1 cursor-pointer">
                                                <Eye className="h-4 w-4" />
                                                <span>View</span>
                                            </button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {filteredBookings.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No bookings found matching your filters
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
