'use client';

import { mockRooms } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function AvailabilityManagement() {
    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Availability Management</h1>
                <p className="text-gray-600">Monitor and manage room availability</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Rooms</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room Number</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Price/Night</TableHead>
                                <TableHead>Amenities</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockRooms.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell className="font-medium">#{room.number}</TableCell>
                                    <TableCell>{room.type}</TableCell>
                                    <TableCell>{room.capacity} Guest{room.capacity > 1 ? 's' : ''}</TableCell>
                                    <TableCell>${room.price}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {room.amenities.slice(0, 3).map((amenity, idx) => (
                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                    {amenity}
                                                </Badge>
                                            ))}
                                            {room.amenities.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{room.amenities.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={room.available ? 'success' : 'destructive'}>
                                            {room.available ? 'Available' : 'Occupied'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Simple Calendar View */}
            <Card>
                <CardHeader>
                    <CardTitle>Booking Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-center font-semibold text-sm text-gray-600 p-2">
                                {day}
                            </div>
                        ))}
                        {Array.from({ length: 35 }, (_, i) => {
                            const isOccupied = Math.random() > 0.6;
                            return (
                                <div
                                    key={i}
                                    className={`p-3 text-center rounded-lg border ${isOccupied ? 'bg-red-100 border-red-200' : 'bg-green-50 border-green-200'
                                        }`}
                                >
                                    <div className="text-sm font-medium">{i + 1}</div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        {isOccupied ? 'Booked' : 'Free'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                            <span>Available</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                            <span>Occupied</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
