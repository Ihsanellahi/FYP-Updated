'use client';

import Link from 'next/link';
import { MessageCircle, Calendar, FileText, Star, Heart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LOGO_SRC } from '@/constants/logos';

export default function Landing() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-[#0a192f] via-[#172a45] to-[#0a192f] text-white pt-0 pb-24">
                {/* Full Width Video Section */}
                <div className="w-full mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="relative w-full aspect-[21/9] md:aspect-[25/9] overflow-hidden shadow-2xl bg-blue-950/50">
                        <video 
                            className="w-full h-full object-cover block"
                            autoPlay 
                            muted 
                            loop
                            /* Using the HotelNewVideo.mp4 from the public directory */
                            src="/HotelNewVideo.mp4"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>

                <div className="container mx-auto px-4 text-center">
                    {/* Hero Logo */}
                    <div className="flex justify-center mb-8 animate-fade-in">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl scale-110" />
                            <img
                                src={LOGO_SRC}
                                alt="Grand Hotel"
                                className="relative h-20 md:h-28 w-auto object-contain drop-shadow-2xl rounded-2xl"
                                style={{ filter: 'drop-shadow(0 8px 32px rgba(255,255,255,0.25))' }}
                            />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-10 animate-fade-in">
                        Welcome to Grand Hotel
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        Experience luxury and comfort with our AI-powered concierge service.
                        Book rooms, request services, and get instant assistance 24/7.
                    </p>
                    <Link href="/chat">
                        <Button size="lg" className="bg-white text-blue-950 hover:bg-blue-50 text-lg px-8 py-6">
                            <MessageCircle className="mr-2 h-5 w-5" />
                            Start Chat with AI Assistant
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Services</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link href="/availability">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                                        <Calendar className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Room Booking</h3>
                                    <p className="text-gray-600">
                                        Browse our luxurious rooms and suites. Book your perfect stay in just a few clicks.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/chat">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                                        <MessageCircle className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">24/7 AI Chat Support</h3>
                                    <p className="text-gray-600">
                                        Get instant answers to your questions from our intelligent AI assistant.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/complaint">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                                        <FileText className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Complaint & Feedback</h3>
                                    <p className="text-gray-600">
                                        Share your concerns or compliments. We value your feedback.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/emergency">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-red-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                                        <Phone className="h-6 w-6 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-red-600">Emergency Support</h3>
                                    <p className="text-gray-600">
                                        Report emergencies immediately. Our staff will respond right away.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/feedback">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
                                        <Star className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Rate Your Stay</h3>
                                    <p className="text-gray-600">
                                        Share your experience and help us improve our services.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/help">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                                        <Heart className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Help & FAQ</h3>
                                    <p className="text-gray-600">
                                        Find answers to commonly asked questions about our hotel.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-[#0a192f] via-[#172a45] to-[#0a192f] text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Experience Luxury?</h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Start chatting with our AI assistant or browse available rooms
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link href="/chat">
                            <Button size="lg" className="bg-white text-blue-950 hover:bg-blue-50">
                                Start Chat
                            </Button>
                        </Link>
                        <Link href="/availability">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-950">
                                View Rooms
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
