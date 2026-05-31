'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/context/DataContext';
import { generateId } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { Emergency } from '@/types';

export default function EmergencyPage() {
    const router = useRouter();
    const { addEmergency } = useData();
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        type: '' as Emergency['type'] | '',
        description: '',
        contactNumber: '',
        location: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.type) newErrors.type = 'Please select emergency type';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const newEmergency: Emergency = {
            id: 'EMG' + generateId().toUpperCase(),
            type: formData.type as Emergency['type'],
            description: formData.description,
            contactNumber: formData.contactNumber,
            location: formData.location || undefined,
            status: 'New',
            createdAt: new Date().toISOString(),
        };

        try {
            await addEmergency(newEmergency);
            setSubmitted(true);
        } catch (err) {
            console.error('Failed to submit emergency report:', err);
        }
    };

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl font-sans">
                <Card className="border-red-300 bg-red-50">
                    <CardContent className="pt-12 pb-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-red-900">Emergency Alert Sent!</h2>
                        <p className="text-red-800 mb-6 font-medium">
                            Our staff has been notified and will respond immediately. Please stay on the line.
                        </p>
                        <div className="space-x-3">
                            <Button onClick={() => router.push('/')} className="bg-red-600 hover:bg-red-700">
                                Return Home
                            </Button>
                            <Button variant="outline" onClick={() => router.push('/chat')}>
                                Chat with Support
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl font-sans">
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6 flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
                <div>
                    <h3 className="font-semibold text-red-900">Emergency Report</h3>
                    <p className="text-sm text-red-800">
                        For life-threatening emergencies, please also call 911 or your local emergency number.
                    </p>
                </div>
            </div>

            <Card className="border-red-200">
                <CardHeader className="bg-red-50">
                    <CardTitle className="text-3xl text-red-900">Report Emergency</CardTitle>
                    <p className="text-red-700">Our staff will be notified immediately</p>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Emergency Type *</label>
                            <Select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as Emergency['type'] })}
                            >
                                <option value="">Select emergency type</option>
                                <option value="Medical">Medical</option>
                                <option value="Fire">Fire</option>
                                <option value="Security">Security</option>
                                <option value="Other">Other</option>
                            </Select>
                            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Contact Number *</label>
                            <Input
                                type="tel"
                                value={formData.contactNumber}
                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                placeholder="+1234567890"
                            />
                            {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Location (Optional)</label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g., Room 201, Lobby, Parking Lot"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description *</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Please describe the emergency situation..."
                                rows={6}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                                Submit Emergency Report
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
