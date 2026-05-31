'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: 'What are the check-in and check-out times?',
        answer: 'Check-in time is 3:00 PM and check-out time is 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability.',
    },
    {
        question: 'Do you offer free WiFi?',
        answer: 'Yes, complimentary high-speed WiFi is available throughout the hotel, including all guest rooms and public areas.',
    },
    {
        question: 'Is parking available?',
        answer: 'Yes, we offer both complimentary self-parking and valet parking services. Our parking lot is secure and monitored 24/7.',
    },
    {
        question: 'Can I cancel or modify my booking?',
        answer: 'Yes, bookings can be canceled or modified up to 24 hours before check-in without penalty. Please contact our front desk or submit a request through the complaint form.',
    },
    {
        question: 'Do you have a restaurant or room service?',
        answer: 'Yes, we have an on-site restaurant open from 7:00 AM to 11:00 PM. Room service is available 24/7 for your convenience.',
    },
    {
        question: 'Are pets allowed?',
        answer: 'Yes, we are a pet-friendly hotel. Small pets (under 25 lbs) are welcome with a non-refundable cleaning fee of $50 per stay.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), debit cards, and cash payments.',
    },
    {
        question: 'Is the hotel accessible for guests with disabilities?',
        answer: 'Yes, we have wheelchair-accessible rooms and facilities throughout the hotel. Please let us know your specific needs when booking.',
    },
    {
        question: 'Do you offer airport shuttle service?',
        answer: 'Yes, we provide complimentary shuttle service to and from the airport. Please notify us 24 hours in advance to arrange pickup.',
    },
    {
        question: 'What amenities are included in the rooms?',
        answer: 'All rooms include WiFi, AC, flat-screen TV, mini bar, coffee maker, and premium toiletries. Suites and premium rooms may include additional amenities like balconies, jacuzzis, and living areas.',
    },
];

export default function Help() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl font-sans">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Help & FAQ</h1>
                <p className="text-gray-600">Find answers to frequently asked questions</p>
            </div>

            <Card id="contact-info" className="mb-6">
                <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle>Need Immediate Assistance?</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="font-semibold mb-2">Front Desk</p>
                            <a
                                href="tel:+923444100702"
                                className="text-gray-600 hover:text-primary transition-colors font-medium"
                            >
                                +923444100702
                            </a>
                            <p className="text-sm text-gray-500 mt-1">
                                University of Central Punjab, Lahore
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold mb-2">Email</p>
                            <a
                                href="mailto:harisautomates@gmail.com"
                                className="text-gray-600 hover:text-primary transition-colors font-medium"
                            >
                                harisautomates@gmail.com
                            </a>
                            <p className="text-sm text-gray-500 mt-1">Response within 24h</p>
                        </div>
                        <div>
                            <p className="font-semibold mb-2">AI Chat</p>
                            <p className="text-gray-600 font-medium">Instant Assistance</p>
                            <p className="text-sm text-gray-500 mt-1">
                                <Link href="/chat" className="text-primary hover:underline font-semibold">
                                    Start Chat →
                                </Link>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-3">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                {faqs.map((faq, index) => (
                    <Card key={index} className="overflow-hidden">
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer"
                        >
                            <span className="font-semibold text-gray-900">{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                        </button>
                        {openIndex === index && (
                            <div className="px-6 pb-4 text-gray-600 border-t pt-4">
                                {faq.answer}
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
                <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
                <p className="text-gray-600 mb-4">
                    Our AI assistant or support team is here to help you 24/7
                </p>
                <div className="space-x-3">
                    <Link href="/chat">
                        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors cursor-pointer font-medium">
                            Chat with AI
                        </button>
                    </Link>
                    <a href="#contact-info">
                        <button className="bg-white border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer font-medium text-gray-700">
                            Contact Us
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}
