'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Settings() {
    const [notifications, setNotifications] = useState({
        emailBookings: true,
        emailComplaints: true,
        emailEmergencies: true,
        pushNotifications: false,
    });

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage system preferences and configurations</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Email Notifications - New Bookings</p>
                            <p className="text-sm text-gray-500">Receive email when new bookings are made</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.emailBookings}
                                onChange={(e) =>
                                    setNotifications({ ...notifications, emailBookings: e.target.checked })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Email Notifications - New Complaints</p>
                            <p className="text-sm text-gray-500">Receive email when complaints are submitted</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.emailComplaints}
                                onChange={(e) =>
                                    setNotifications({ ...notifications, emailComplaints: e.target.checked })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Emergency Alerts</p>
                            <p className="text-sm text-gray-500">Immediate notifications for emergencies</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.emailEmergencies}
                                onChange={(e) =>
                                    setNotifications({ ...notifications, emailEmergencies: e.target.checked })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-gray-500">Enable browser push notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.pushNotifications}
                                onChange={(e) =>
                                    setNotifications({ ...notifications, pushNotifications: e.target.checked })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>System Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="p-4 border rounded-lg">
                        <p className="font-medium mb-1">Payment Gateway</p>
                        <p className="text-sm text-gray-500">Connect to Stripe, PayPal, or other payment processors</p>
                        <Button variant="outline" size="sm" className="mt-2">Configure</Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <p className="font-medium mb-1">Email Service</p>
                        <p className="text-sm text-gray-500">Configure SMTP settings for email delivery</p>
                        <Button variant="outline" size="sm" className="mt-2">Configure</Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <p className="font-medium mb-1">SMS Gateway</p>
                        <p className="text-sm text-gray-500">Enable SMS notifications via Twilio or similar</p>
                        <Button variant="outline" size="sm" className="mt-2">Configure</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} className="cursor-pointer">Save Settings</Button>
            </div>
        </div>
    );
}
