'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/context/DataContext';
import { generateId } from '@/lib/utils';
import { Star, CheckCircle } from 'lucide-react';
import type { Feedback } from '@/types';

export default function FeedbackPage() {
    const router = useRouter();
    const { addFeedback } = useData();
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        guestName: '',
        guestEmail: '',
        rating: 0,
        comments: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.guestName.trim()) newErrors.guestName = 'Name is required';
        if (!formData.guestEmail.trim()) newErrors.guestEmail = 'Email is required';
        if (formData.rating === 0) newErrors.rating = 'Please select a rating';
        if (!formData.comments.trim()) newErrors.comments = 'Please provide your feedback';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const newFeedback: Feedback = {
            id: 'FB' + generateId().toUpperCase(),
            guestName: formData.guestName,
            guestEmail: formData.guestEmail,
            rating: formData.rating,
            comments: formData.comments,
            createdAt: new Date().toISOString(),
        };

        try {
            await addFeedback(newFeedback);

            // Send to n8n feedback agent
            fetch(process.env.NEXT_PUBLIC_N8N_FEEDBACK_WEBHOOK!, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestName: formData.guestName,
                    guestEmail: formData.guestEmail,
                    rating: formData.rating,
                    comments: formData.comments,
                }),
            }).catch((err) => console.error('n8n webhook error:', err));

            setSubmitted(true);
        } catch (err) {
            console.error('Failed to submit feedback:', err);
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
                        <h2 className="text-2xl font-bold mb-2">Thank You for Your Feedback!</h2>
                        <p className="text-gray-600 mb-6">
                            We appreciate you taking the time to share your experience with us.
                        </p>
                        <div className="space-x-3">
                            <Button onClick={() => router.push('/')}>Return Home</Button>
                            <Button variant="outline" onClick={() => router.push('/chat')}>
                                Chat with Us
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
                    <CardTitle className="text-3xl">Share Your Feedback</CardTitle>
                    <p className="text-gray-600">Your opinion helps us improve our services</p>
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
                            <label className="block text-sm font-medium mb-2">Rating *</label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                                    >
                                        <Star
                                            className={`h-10 w-10 ${star <= formData.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {formData.rating > 0 && (
                                <p className="text-sm text-gray-600 mt-2">
                                    You rated us {formData.rating} out of 5 stars
                                </p>
                            )}
                            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Your Comments *</label>
                            <Textarea
                                value={formData.comments}
                                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                placeholder="Tell us about your experience..."
                                rows={6}
                            />
                            {errors.comments && <p className="text-red-500 text-xs mt-1">{errors.comments}</p>}
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <Button type="submit" className="flex-1">
                                Submit Feedback
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
