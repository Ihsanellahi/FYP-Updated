'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAnalytics } from '@/data/mockData';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Star, Home } from 'lucide-react';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

export default function Analytics() {
    const { bookingsByMonth, complaintsCounts, emergencyCounts, occupancyRate, avgRating } = mockAnalytics;

    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600">View hotel performance metrics and insights</p>
            </div>

            {/* Summary KPIs */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Occupancy Rate
                        </CardTitle>
                        <Home className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{occupancyRate}%</div>
                        <p className="text-xs text-gray-500 mt-1">Current month average</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Average Rating
                        </CardTitle>
                        <Star className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{avgRating}</div>
                        <p className="text-xs text-gray-500 mt-1">Out of 5 stars</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Monthly Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            ${bookingsByMonth[bookingsByMonth.length - 1].revenue.toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Current month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Monthly Bookings
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {bookingsByMonth[bookingsByMonth.length - 1].count}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Current month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Bookings Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Bookings & Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={bookingsByMonth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="count" stroke="#3b82f6" name="Bookings" strokeWidth={2} />
                            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue ($)" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Complaints Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Complaints by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={complaintsCounts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="status" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Emergency Types */}
                <Card>
                    <CardHeader>
                        <CardTitle>Emergency Reports by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={emergencyCounts}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ type, count }) => `${type}: ${count}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {emergencyCounts.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
