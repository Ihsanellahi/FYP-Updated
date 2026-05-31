'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { mockStaff } from '@/data/mockData';
import type { ComplaintStatus } from '@/types';

export default function ComplaintDetails() {
    const params = useParams();
    const complaintId = params.complaintId as string;
    const router = useRouter();
    const { complaints, updateComplaint } = useData();

    const complaint = complaints.find((c) => c.id === complaintId);
    const [status, setStatus] = useState<ComplaintStatus>(complaint?.status || 'New');
    const [assignedTo, setAssignedTo] = useState(complaint?.assignedTo || '');
    const [notes, setNotes] = useState(complaint?.notes || '');

    if (!complaint) {
        return (
            <div className="text-center py-12 font-sans">
                <p className="text-xl text-gray-600">Complaint not found</p>
                <Button onClick={() => router.push('/staff/complaints')} className="mt-4">
                    Back to Complaints
                </Button>
            </div>
        );
    }

    const handleUpdate = async () => {
        try {
            await updateComplaint(complaint.id, {
                status,
                assignedTo: assignedTo || undefined,
                notes: notes || undefined,
                resolvedAt: status === 'Resolved' ? new Date().toISOString() : undefined,
            });
            router.push('/staff/complaints');
        } catch (error) {
            console.error('Failed to update complaint:', error);
        }
    };

    const getStatusVariant = (s: ComplaintStatus) => {
        switch (s) {
            case 'Resolved': return 'success';
            case 'New': return 'destructive';
            case 'In Progress': return 'warning';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" onClick={() => router.push('/staff/complaints')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Complaint Details</h1>
                        <p className="text-gray-600">Complaint ID: {complaint.id}</p>
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
                            <p className="font-medium">{complaint.guestName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{complaint.guestEmail}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Category</p>
                            <Badge variant="outline">{complaint.category}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Submitted</p>
                            <p className="font-medium">{formatDateTime(complaint.createdAt)}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Complaint Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                            >
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Assign To</label>
                            <Select
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                            >
                                <option value="">Unassigned</option>
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
                    <CardTitle>Complaint Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700">{complaint.description}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Response Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about how this complaint was handled..."
                        rows={4}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => router.push('/staff/complaints')}>
                    Cancel
                </Button>
                <Button onClick={handleUpdate}>
                    Update Complaint
                </Button>
            </div>
        </div>
    );
}
