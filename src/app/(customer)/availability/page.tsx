'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAvailableRooms } from '@/data/mockData';
import { Users } from 'lucide-react';

export default function Availability() {
    const availableRooms = getAvailableRooms();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Rooms</h1>
                <p className="text-gray-600">Choose from our selection of luxurious rooms and suites</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableRooms.map((room) => (
                    <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={room.imageUrl}
                                alt={`${room.type} room`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                            <Badge className="absolute top-3 right-3 bg-green-500">
                                Available
                            </Badge>
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{room.type} Room</CardTitle>
                                    <p className="text-sm text-gray-500">Room #{room.number}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">${room.price}</div>
                                    <div className="text-xs text-gray-500">per night</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">{room.description}</p>

                            <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span>{room.capacity} Guest{room.capacity > 1 ? 's' : ''}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-700">Amenities:</p>
                                <div className="flex flex-wrap gap-2">
                                    {room.amenities.slice(0, 4).map((amenity, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                            {amenity}
                                        </Badge>
                                    ))}
                                    {room.amenities.length > 4 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{room.amenities.length - 4} more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/booking?roomId=${room.id}`} className="w-full">
                                <Button className="w-full">Book Now</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {availableRooms.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">No rooms currently available</p>
                    <p className="text-gray-500 mt-2">Please check back later</p>
                </div>
            )}
        </div>
    );
}
