'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { mockStaff } from '@/data/mockData';
import { Plus } from 'lucide-react';
import type { Staff, StaffRole } from '@/types';

export default function StaffManagement() {
    const [staffList, setStaffList] = useState<Staff[]>(mockStaff);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Staff' as StaffRole,
        department: '',
        phone: '',
    });

    const handleAddStaff = () => {
        const newStaff: Staff = {
            id: `staff-${staffList.length + 1}`,
            ...formData,
        };
        setStaffList([...staffList, newStaff]);
        setFormData({ name: '', email: '', role: 'Staff', department: '', phone: '' });
        setDialogOpen(false);
    };

    const handleDeleteStaff = (id: string) => {
        setStaffList(staffList.filter((s) => s.id !== id));
    };

    return (
        <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
                    <p className="text-gray-600">Manage hotel staff and their roles</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Staff
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Staff Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <Select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })}
                                >
                                    <option value="Staff">Staff</option>
                                    <option value="Admin">Admin</option>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Department</label>
                                <Input
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    placeholder="e.g., Front Desk, Housekeeping"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <Input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1234567890"
                                />
                            </div>
                            <Button onClick={handleAddStaff} className="w-full">
                                Add Staff Member
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Staff Members ({staffList.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staffList.map((staff) => (
                                <TableRow key={staff.id}>
                                    <TableCell className="font-medium">{staff.name}</TableCell>
                                    <TableCell>{staff.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={staff.role === 'Admin' ? 'default' : 'secondary'}>
                                            {staff.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{staff.department}</TableCell>
                                    <TableCell>{staff.phone}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteStaff(staff.id)}
                                            className="text-red-600 hover:text-red-700 cursor-pointer"
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
