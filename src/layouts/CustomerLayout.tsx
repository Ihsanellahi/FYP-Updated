'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MessageCircle, Calendar, FileText, Phone, Menu, X, ShieldAlert, LogOut } from 'lucide-react';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navItems = [
    { to: '/chat', label: 'Chat', icon: MessageCircle },
    { to: '/availability', label: 'Rooms', icon: Calendar },
    { to: '/help', label: 'Help', icon: FileText },
] as const;

const navLinkClass = (isActive: boolean) =>
    cn(
        'group relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium tracking-wide transition-all duration-300',
        isActive
            ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white shadow-lg shadow-blue-950/30'
            : 'text-slate-600 hover:bg-white hover:text-blue-950 hover:shadow-md hover:shadow-slate-200/80'
    );

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { isAuthenticated, loading, logout } = useAuth();

    const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup';

    useEffect(() => {
        if (!loading && !isAuthenticated && !isPublicRoute && !isLoggingOut) {
            router.push(`/login?from=${encodeURIComponent(pathname)}`);
        }
    }, [isAuthenticated, loading, isPublicRoute, pathname, router, isLoggingOut]);

    useEffect(() => {
        if (isLoggingOut && pathname === '/') {
            setIsLoggingOut(false);
        }
    }, [pathname, isLoggingOut]);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleLogoutConfirm = () => {
        setIsLoggingOut(true);
        setShowLogoutConfirm(false);
        setMobileMenuOpen(false);
        router.push('/');
        logout();
    };

    const handleLogoutCancel = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 shadow-[0_8px_32px_-8px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                <div className="container mx-auto px-4">
                    <div className="flex h-[5.5rem] items-center justify-between">
                        <Logo />

                        {isAuthenticated && (
                            <nav
                                className="hidden items-center gap-3 md:flex"
                                aria-label="Main navigation"
                            >
                                <div className="flex items-center gap-1 rounded-full border border-slate-200/90 bg-gradient-to-b from-slate-50 to-slate-100/90 p-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]">
                                    {navItems.map(({ to, label, icon: Icon }) => {
                                        const isActive = pathname === to;
                                        return (
                                            <Link key={to} href={to} className={navLinkClass(isActive)}>
                                                <span className="flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300 group-hover:bg-blue-950/10">
                                                    <Icon className="h-4 w-4 shrink-0 stroke-[1.75]" />
                                                </span>
                                                <span>{label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>

                                <Link
                                    href="/emergency"
                                    className={cn(
                                        'group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300',
                                        pathname === '/emergency'
                                            ? 'bg-gradient-to-r from-rose-700 to-red-600 text-white shadow-xl shadow-red-600/40 ring-2 ring-red-400/50'
                                            : 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-lg shadow-red-500/30 hover:from-rose-500 hover:to-red-500 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5'
                                    )}
                                >
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                                        <Phone className="h-4 w-4 shrink-0 stroke-[2]" />
                                    </span>
                                    <span>Emergency</span>
                                </Link>

                                <button
                                    onClick={handleLogoutClick}
                                    className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </nav>
                        )}

                        {!isAuthenticated && (
                            <div className="hidden md:flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-700"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-gradient-to-b from-white to-slate-50 text-slate-700 shadow-sm transition hover:shadow-md md:hidden"
                            aria-expanded={mobileMenuOpen}
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <nav
                            className="border-t border-slate-100 pb-4 pt-3 md:hidden"
                            aria-label="Mobile navigation"
                        >
                            <div className="flex flex-col gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-2">
                                {isAuthenticated ? (
                                    <>
                                        {navItems.map(({ to, label, icon: Icon }) => {
                                            const isActive = pathname === to;
                                            return (
                                                <Link
                                                    key={to}
                                                    href={to}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={cn(
                                                        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium tracking-wide transition-all',
                                                        isActive
                                                            ? 'bg-gradient-to-r from-blue-950 to-indigo-950 text-white shadow-md'
                                                            : 'text-slate-600 hover:bg-white hover:shadow-sm'
                                                    )}
                                                >
                                                    <Icon className="h-4 w-4 shrink-0 stroke-[1.75]" />
                                                    <span>{label}</span>
                                                </Link>
                                            );
                                        })}
                                        <Link
                                            href="/emergency"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                'mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-all',
                                                pathname === '/emergency'
                                                    ? 'bg-gradient-to-r from-rose-700 to-red-600 text-white shadow-md'
                                                    : 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-sm'
                                            )}
                                        >
                                            <Phone className="h-4 w-4 shrink-0 stroke-[2]" />
                                            <span>Emergency</span>
                                        </Link>
                                        <button
                                            onClick={handleLogoutClick}
                                            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 cursor-pointer"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>
                    )}
                </div>
            </header>
            <main className="flex-1 font-sans">
                {!isPublicRoute && loading ? (
                    <div className="flex min-h-[calc(100vh-20rem)] items-center justify-center font-sans">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : !isPublicRoute && !isAuthenticated ? (
                    null
                ) : (
                    children
                )}
            </main>
            <Footer />

            {/* Logout Confirmation Dialog */}
            {showLogoutConfirm && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200"
                    style={{ background: 'linear-gradient(135deg, #0a192fee 0%, #172a45ee 50%, #0a192fee 100%)' }}
                >
                    {/* Click outside to cancel */}
                    <div className="absolute inset-0" onClick={handleLogoutCancel} />

                    {/* Dialog */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Top accent bar */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-900 via-blue-950 to-indigo-900" />

                        <div className="p-7">
                            {/* Icon */}
                            <div className="flex justify-center mb-5">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50">
                                    <ShieldAlert className="h-8 w-8 text-blue-900" />
                                </div>
                            </div>

                            {/* Text */}
                            <div className="text-center mb-7">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                    Sign Out?
                                </h2>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Are you sure you want to sign out of your account?
                                    You will need to sign in again to book rooms or request services.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleLogoutCancel}
                                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-slate-50 hover:border-gray-300 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogoutConfirm}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-800 hover:to-indigo-800 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Yes, Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
