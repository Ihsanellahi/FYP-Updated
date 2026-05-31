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
import { CheckCircle } from 'lucide-react';
import type { Complaint } from '@/types';

export default function ComplaintPage() {
    const router = useRouter();
    const { addComplaint } = useData();
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        guestName: '',
        guestEmail: '',
        category: '' as Complaint['category'] | '',
        description: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.guestName.trim()) newErrors.guestName = 'Name is required';
        if (!formData.guestEmail.trim()) newErrors.guestEmail = 'Email is required';
        if (!formData.category) newErrors.category = 'Please select a category';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const newComplaint: Complaint = {
            id: 'CMP' + generateId().toUpperCase(),
            guestName: formData.guestName,
            guestEmail: formData.guestEmail,
            category: formData.category as Complaint['category'],
            description: formData.description,
            status: 'New',
            createdAt: new Date().toISOString(),
        };

        try {
            await addComplaint(newComplaint);
            setSubmitted(true);
        } catch (err) {
            console.error('Failed to submit complaint:', err);
        }
    };

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl font-sans">
                <Card>
                    <CardContent className="pt-12 pb-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Complaint Submitted</h2>
                        <p className="text-gray-600 mb-6">
                            Thank you for your feedback. Our team will review your complaint and respond within 24 hours.
                        </p>
                        <div className="space-x-3">
                            <Button onClick={() => router.push('/')}>Return Home</Button>
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
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">File a Complaint</CardTitle>
                    <p className="text-gray-600">We take your concerns seriously and will address them promptly</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Your Name *</label>
                            <Input
                                value={formData.guestName}
                                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                placeholder="John Doe"
                            />
                            {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <Input
                                type="email"
                                value={formData.guestEmail}
                                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                                placeholder="john@example.com"
                            />
                            {errors.guestEmail && <p className="text-red-500 text-xs mt-1">{errors.guestEmail}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Category *</label>
                            <Select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as Complaint['category'] })}
                            >
                                <option value="">Select a category</option>
                                <option value="Service">Service</option>
                                <option value="Room">Room</option>
                                <option value="Staff">Staff</option>
                                <option value="Billing">Billing</option>
                                <option value="Other">Other</option>
                            </Select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description *</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Please describe your complaint in detail..."
                                rows={6}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <Button type="submit" className="flex-1">
                                Submit Complaint
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
