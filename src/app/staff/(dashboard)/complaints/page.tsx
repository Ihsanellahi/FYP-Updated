'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import { Eye } from 'lucide-react';
import type { ComplaintStatus } from '@/types';

export default function ComplaintsList() {
    const { complaints } = useData();
    const [statusFilter, setStatusFilter] = useState<ComplaintStatus | ''>('');

    const filteredComplaints = complaints.filter((complaint) => {
        return !statusFilter || complaint.status === statusFilter;
    });

    const getStatusVariant = (status: ComplaintStatus) => {
        switch (status) {
            case 'Resolved':
                return 'success';
            case 'New':
                return 'destructive';
            case 'In Progress':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Complaints Management</h1>
                <p className="text-gray-600">View and manage customer complaints</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Complaints</CardTitle>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | '')}
                        >
                            <option value="">All Status</option>
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Complaint ID</TableHead>
                                <TableHead>Guest Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredComplaints.map((complaint) => (
                                <TableRow key={complaint.id}>
                                    <TableCell className="font-medium">{complaint.id}</TableCell>
                                    <TableCell>{complaint.guestName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{complaint.category}</Badge>
                                    </TableCell>
                                    <TableCell>{formatDateTime(complaint.createdAt)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(complaint.status)}>
                                            {complaint.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/staff/complaints/${complaint.id}`}>
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
                    {filteredComplaints.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No complaints found matching your filters
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
