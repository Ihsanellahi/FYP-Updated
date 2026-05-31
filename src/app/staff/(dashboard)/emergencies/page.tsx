'use client';

import Link from 'next/link';
import { useData } from '@/context/DataContext';
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
import { formatDateTime } from '@/lib/utils';
import { Eye, AlertTriangle } from 'lucide-react';
import type { EmergencyStatus } from '@/types';

export default function EmergenciesList() {
    const { emergencies } = useData();

    const getStatusVariant = (status: EmergencyStatus) => {
        switch (status) {
            case 'Resolved':
                return 'success';
            case 'New':
                return 'destructive';
            case 'Acknowledged':
                return 'warning';
            default:
                return 'default';
        }
    };

    const newEmergencies = emergencies.filter((e) => e.status === 'New');

    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Emergency Alerts</h1>
                <p className="text-gray-600">Monitor and respond to emergency situations</p>
            </div>

            {newEmergencies.length > 0 && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-4 flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-900">Active Emergencies!</h3>
                        <p className="text-sm text-red-800">
                            You have {newEmergencies.length} unacknowledged emergenc{newEmergencies.length > 1 ? 'ies' : 'y'} requiring immediate attention.
                        </p>
                    </div>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>All Emergency Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Emergency ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Reported</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {emergencies.map((emergency) => (
                                <TableRow key={emergency.id} className={emergency.status === 'New' ? 'bg-red-50' : ''}>
                                    <TableCell className="font-medium">{emergency.id}</TableCell>
                                    <TableCell>
                                        <Badge variant={emergency.type === 'Fire' || emergency.type === 'Medical' ? 'destructive' : 'warning'}>
                                            {emergency.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{emergency.location || 'Not specified'}</TableCell>
                                    <TableCell>{emergency.contactNumber}</TableCell>
                                    <TableCell>{formatDateTime(emergency.createdAt)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(emergency.status)}>
                                            {emergency.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/staff/emergencies/${emergency.id}`}>
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
                    {emergencies.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No emergency reports
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
