import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Calendar, FileText } from 'lucide-react';
import { LOGO_SRC } from '@/components/Logo';
import { cn } from '@/lib/utils';

const footerLink =
    'text-slate-300 transition-colors duration-200 hover:text-white';

const iconBadge = cn(
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
    'bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/25',
    'transition-colors duration-200 group-hover:bg-blue-500/25 group-hover:text-blue-200'
);

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-blue-900/40 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-slate-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <Link to="/" className="group mb-4 flex items-center space-x-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-md shadow-blue-950/50">
                                <img
                                    src={LOGO_SRC}
                                    alt=""
                                    className="h-12 w-12 object-cover object-top"
                                />
                            </span>
                            <span className="text-xl font-bold text-white">Grand Hotel</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Experience luxury and comfort with our AI-powered concierge. Book rooms,
                            request services, and get assistance around the clock.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link to="/" className={footerLink}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/chat" className={footerLink}>
                                    AI Chat Assistant
                                </Link>
                            </li>
                            <li>
                                <Link to="/availability" className={footerLink}>
                                    Room Availability
                                </Link>
                            </li>
                            <li>
                                <Link to="/help" className={footerLink}>
                                    Help & FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                            Guest Services
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link to="/booking" className={cn('group flex items-center gap-3', footerLink)}>
                                    <span className={iconBadge}>
                                        <Calendar className="h-4 w-4" />
                                    </span>
                                    Book a Room
                                </Link>
                            </li>
                            <li>
                                <Link to="/complaint" className={cn('group flex items-center gap-3', footerLink)}>
                                    <span className={iconBadge}>
                                        <FileText className="h-4 w-4" />
                                    </span>
                                    Submit Complaint
                                </Link>
                            </li>
                            <li>
                                <Link to="/feedback" className={cn('group flex items-center gap-3', footerLink)}>
                                    <span className={iconBadge}>
                                        <MessageCircle className="h-4 w-4" />
                                    </span>
                                    Leave Feedback
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/emergency"
                                    className="group flex items-center gap-3 text-red-300 transition-colors hover:text-red-200"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-300 ring-1 ring-red-400/30 transition-colors group-hover:bg-red-500/25 group-hover:text-red-200">
                                        <Phone className="h-4 w-4" />
                                    </span>
                                    Emergency
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                            Contact Us
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li className="group flex items-start gap-3">
                                <span className={iconBadge}>
                                    <MapPin className="h-4 w-4" />
                                </span>
                                <span className="pt-1.5 text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                                    University of Central Punjab, Lahore
                                </span>
                            </li>
                            <li className="group flex items-center gap-3">
                                <span className={iconBadge}>
                                    <Phone className="h-4 w-4" />
                                </span>
                                <a
                                    href="tel:+923444100702"
                                    className={cn(footerLink, 'font-medium')}
                                >
                                    +923444100702
                                </a>
                            </li>
                            <li className="group flex items-center gap-3">
                                <span className={iconBadge}>
                                    <Mail className="h-4 w-4" />
                                </span>
                                <a
                                    href="mailto:harisautomates@gmail.com"
                                    className={cn(footerLink, 'break-all')}
                                >
                                    harisautomates@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-blue-800/40 pt-8 text-sm text-slate-500 sm:flex-row">
                    <p>&copy; {currentYear} Grand Hotel. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/help" className={footerLink}>
                            Privacy Policy
                        </Link>
                        <Link to="/help" className={footerLink}>
                            Terms of Service
                        </Link>
                        <Link to="/staff/login" className={footerLink}>
                            Staff Login
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
