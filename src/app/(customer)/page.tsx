'use client';

import Link from 'next/link';
import { MessageCircle, Calendar, FileText, Star, Heart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LOGO_SRC } from '@/constants/logos';

export default function Landing() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative min-h-[calc(100vh-5.5rem)] flex flex-col justify-center items-center overflow-hidden">
                {/* Full Width Video Background */}
                <div className="absolute inset-0 z-0">
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        src="/HotelNewVideo.mp4"
                    >
                        Your browser does not support the video tag.
                    </video>
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-blue-950/40 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-80" />
                </div>

                <div className="container relative z-10 mx-auto px-4 text-center pb-12 pt-8">
                    {/* Hero Logo */}
                    <div className="flex justify-center mb-8 animate-fade-in">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-3xl bg-white/20 blur-2xl scale-110" />
                            <img
                                src={LOGO_SRC}
                                alt="Grand Hotel"
                                className="relative h-20 md:h-28 w-auto object-contain drop-shadow-2xl rounded-2xl"
                                style={{ filter: 'drop-shadow(0 8px 32px rgba(255,255,255,0.25))' }}
                            />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-10 animate-fade-in drop-shadow-lg text-white">
                        Welcome to Grand Hotel
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 text-white max-w-3xl mx-auto animate-fade-in drop-shadow-md" style={{ animationDelay: '0.4s' }}>
                        Experience luxury and comfort with our AI-powered concierge service.
                        Book rooms, request services, and get instant assistance 24/7.
                    </p>
                    <Link href="/chat">
                        <Button size="lg" className="bg-white text-blue-950 hover:bg-blue-50 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all animate-fade-in" style={{ animationDelay: '0.6s' }}>
                            <MessageCircle className="mr-2 h-5 w-5" />
                            Start Chat with AI Assistant
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="min-h-[calc(100vh-5.5rem)] flex items-center py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Our Services</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <Link href="/availability">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-slate-200">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-xl mb-6">
                                        <Calendar className="h-7 w-7 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3">Room Booking</h3>
                                    <p className="text-gray-600 text-lg">
                                        Browse our luxurious rooms and suites. Book your perfect stay in just a few clicks.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/chat">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-slate-200">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-xl mb-6">
                                        <MessageCircle className="h-7 w-7 text-indigo-600" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3">24/7 AI Chat Support</h3>
                                    <p className="text-gray-600 text-lg">
                                        Get instant answers to your questions from our intelligent AI assistant.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/complaint">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-slate-200">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-center w-14 h-14 bg-purple-50 rounded-xl mb-6">
                                        <FileText className="h-7 w-7 text-purple-600" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3">File your Complaint</h3>
                                    <p className="text-gray-600 text-lg">
                                        Share your concerns or compliments. We value your feedback.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/emergency">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-red-100 bg-red-50/30">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-xl mb-6">
                                        <Phone className="h-7 w-7 text-red-600" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3 text-red-700">Emergency Support</h3>
                                    <p className="text-gray-700 text-lg">
                                        Report emergencies immediately. Our staff will respond right away.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/feedback">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-slate-200">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-center w-14 h-14 bg-yellow-50 rounded-xl mb-6">
                                        <Star className="h-7 w-7 text-yellow-600" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3">Rate Your Stay</h3>
                                    <p className="text-gray-600 text-lg">
                                        Share your experience and help us improve our services.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/help">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-slate-200">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-center w-14 h-14 bg-green-50 rounded-xl mb-6">
                                        <Heart className="h-7 w-7 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3">Help & FAQ</h3>
                                    <p className="text-gray-600 text-lg">
                                        Find answers to commonly asked questions about our hotel.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="min-h-[calc(100vh-5.5rem)] flex items-center justify-center bg-gradient-to-r from-[#0a192f] via-[#172a45] to-[#0a192f] text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Experience Luxury?</h2>
                    <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-2xl mx-auto">
                        Start chatting with our AI assistant or browse available rooms
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <Link href="/chat">
                            <Button size="lg" className="bg-white text-blue-950 hover:bg-blue-50 text-lg px-8 py-6 w-full sm:w-auto">
                                <MessageCircle className="mr-2 h-5 w-5" />
                                Start Chat
                            </Button>
                        </Link>
                        <Link href="/availability">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-950 text-lg px-8 py-6 w-full sm:w-auto bg-transparent">
                                <Calendar className="mr-2 h-5 w-5" />
                                View Rooms
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
