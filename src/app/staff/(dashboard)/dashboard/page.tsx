'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User as UserIcon, ShieldAlert, Shield } from 'lucide-react';
import { usersAPI } from '@/lib/api';

export default function Dashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await usersAPI.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await usersAPI.delete(id);
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Failed to delete user.");
            }
        }
    };

    const totalUsers = users.length;
    const customersCount = users.filter(u => u.role?.toLowerCase() === 'customer').length;
    const staffAdminCount = users.filter(u => u.role?.toLowerCase() === 'admin' || u.role?.toLowerCase() === 'staff').length;

    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <Shield className="h-7 w-7 text-primary" />
                    Admin Panel
                </h1>
                <p className="text-gray-500 font-medium">Manage users and system data</p>
            </div>

            {/* KPI Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                            Total Users
                        </CardTitle>
                        <Users className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-slate-800">{totalUsers}</div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                            Customers
                        </CardTitle>
                        <UserIcon className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-blue-600">{customersCount}</div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                            Staff / Admin
                        </CardTitle>
                        <ShieldAlert className="h-5 w-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-600">{staffAdminCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Registered Users Table */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
                    <CardTitle className="text-lg font-semibold text-slate-800">Registered Users</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="text-xs text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Name</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Username</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                        <td className="px-6 py-4 text-slate-600">{user.username || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize
                                                ${user.role.toLowerCase() === 'admin' 
                                                    ? 'bg-blue-100 text-blue-700' 
                                                    : user.role.toLowerCase() === 'staff'
                                                        ? 'bg-indigo-100 text-indigo-700'
                                                        : 'bg-green-100 text-green-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-500 hover:text-red-700 font-semibold transition-colors text-sm px-2 py-1 rounded hover:bg-red-50 cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                                {loading && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            Loading users...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
