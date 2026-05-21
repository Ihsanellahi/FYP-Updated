import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, MessageCircle, Calendar, FileText } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <Hotel className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold text-white">Grand Hotel</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Experience luxury and comfort with our AI-powered concierge. Book rooms,
                            request services, and get assistance around the clock.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/chat" className="hover:text-white transition-colors">
                                    AI Chat Assistant
                                </Link>
                            </li>
                            <li>
                                <Link to="/availability" className="hover:text-white transition-colors">
                                    Room Availability
                                </Link>
                            </li>
                            <li>
                                <Link to="/help" className="hover:text-white transition-colors">
                                    Help & FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                            Guest Services
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/booking" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <Calendar className="h-4 w-4" />
                                    Book a Room
                                </Link>
                            </li>
                            <li>
                                <Link to="/complaint" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <FileText className="h-4 w-4" />
                                    Submit Complaint
                                </Link>
                            </li>
                            <li>
                                <Link to="/feedback" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <MessageCircle className="h-4 w-4" />
                                    Leave Feedback
                                </Link>
                            </li>
                            <li>
                                <Link to="/emergency" className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
                                    <Phone className="h-4 w-4" />
                                    Emergency
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                            Contact Us
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                <span>University of Central Punjab, Lahore</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 shrink-0 text-primary" />
                                <a href="tel:+923444100702" className="hover:text-white transition-colors">
                                    +923444100702
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 shrink-0 text-primary" />
                                <a href="mailto:harisautomates@gmail.com" className="hover:text-white transition-colors">
                                    harisautomates@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-sm text-gray-500 sm:flex-row">
                    <p>&copy; {currentYear} Grand Hotel. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/help" className="hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/help" className="hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                        <Link to="/staff/login" className="hover:text-white transition-colors">
                            Staff Login
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
