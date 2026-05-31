'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { mockStaff } from '@/data/mockData';
import type { EmergencyStatus } from '@/types';

export default function EmergencyDetails() {
    const params = useParams();
    const emergencyId = params.emergencyId as string;
    const router = useRouter();
    const { emergencies, updateEmergency } = useData();

    const emergency = emergencies.find((e) => e.id === emergencyId);
    const [status, setStatus] = useState<EmergencyStatus>(emergency?.status || 'New');
    const [respondedBy, setRespondedBy] = useState(emergency?.respondedBy || '');

    if (!emergency) {
        return (
            <div className="text-center py-12 font-sans">
                <p className="text-xl text-gray-600">Emergency not found</p>
                <Button onClick={() => router.push('/staff/emergencies')} className="mt-4">
                    Back to Emergencies
                </Button>
            </div>
        );
    }

    const handleUpdate = async () => {
        try {
            await updateEmergency(emergency.id, {
                status,
                respondedBy: respondedBy || undefined,
                acknowledgedAt: status !== 'New' && !emergency.acknowledgedAt ? new Date().toISOString() : emergency.acknowledgedAt,
                resolvedAt: status === 'Resolved' ? new Date().toISOString() : undefined,
            });
            router.push('/staff/emergencies');
        } catch (error) {
            console.error('Failed to update emergency:', error);
        }
    };

    const getStatusVariant = (s: EmergencyStatus) => {
        switch (s) {
            case 'Resolved': return 'success';
            case 'New': return 'destructive';
            case 'Acknowledged': return 'warning';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {status === 'New' && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-4 flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-900">Unacknowledged Emergency!</h3>
                        <p className="text-sm text-red-800">
                            This emergency requires immediate attention. Please update the status.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" onClick={() => router.push('/staff/emergencies')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Emergency Details</h1>
                        <p className="text-gray-600">Emergency ID: {emergency.id}</p>
                    </div>
                </div>
                <Badge variant={getStatusVariant(status)} className="text-sm px-4 py-2">
                    {status}
                </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-red-200">
                    <CardHeader className="bg-red-50">
                        <CardTitle>Emergency Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-6">
                        <div>
                            <p className="text-sm text-gray-600">Type</p>
                            <Badge variant="destructive" className="mt-1">{emergency.type}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Contact Number</p>
                            <p className="font-medium">{emergency.contactNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-medium">{emergency.location || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Reported</p>
                            <p className="font-medium">{formatDateTime(emergency.createdAt)}</p>
                        </div>
                        {emergency.acknowledgedAt && (
                            <div>
                                <p className="text-sm text-gray-600">Acknowledged</p>
                                <p className="font-medium">{formatDateTime(emergency.acknowledgedAt)}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Response Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as EmergencyStatus)}
                            >
                                <option value="New">New</option>
                                <option value="Acknowledged">Acknowledged</option>
                                <option value="Resolved">Resolved</option>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Responded By</label>
                            <Select
                                value={respondedBy}
                                onChange={(e) => setRespondedBy(e.target.value)}
                            >
                                <option value="">Select responder</option>
                                {mockStaff.map((staff) => (
                                    <option key={staff.id} value={staff.id}>
                                        {staff.name} ({staff.department})
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700">{emergency.description}</p>
                </CardContent>
            </Card>

            <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => router.push('/staff/emergencies')}>
                    Cancel
                </Button>
                <Button onClick={handleUpdate} className="bg-red-600 hover:bg-red-700">
                    Update Emergency
                </Button>
            </div>
        </div>
    );
}
