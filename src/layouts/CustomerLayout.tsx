import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { MessageCircle, Calendar, FileText, Phone, Menu, X } from 'lucide-react';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

const navItems = [
    { to: '/chat', label: 'Chat', icon: MessageCircle },
    { to: '/availability', label: 'Rooms', icon: Calendar },
    { to: '/help', label: 'Help', icon: FileText },
] as const;

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
        'group relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium tracking-wide transition-all duration-300',
        isActive
            ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white shadow-lg shadow-blue-950/30'
            : 'text-slate-600 hover:bg-white hover:text-blue-950 hover:shadow-md hover:shadow-slate-200/80'
    );

export default function CustomerLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 shadow-[0_8px_32px_-8px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                <div className="container mx-auto px-4">
                    <div className="flex h-[4.25rem] items-center justify-between">
                        <Logo />

                        <nav
                            className="hidden items-center gap-3 md:flex"
                            aria-label="Main navigation"
                        >
                            <div className="flex items-center gap-1 rounded-full border border-slate-200/90 bg-gradient-to-b from-slate-50 to-slate-100/90 p-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]">
                                {navItems.map(({ to, label, icon: Icon }) => (
                                    <NavLink key={to} to={to} className={navLinkClass}>
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300 group-hover:bg-blue-950/10">
                                            <Icon className="h-4 w-4 shrink-0 stroke-[1.75]" />
                                        </span>
                                        <span>{label}</span>
                                    </NavLink>
                                ))}
                            </div>

                            <NavLink
                                to="/emergency"
                                className={({ isActive }) =>
                                    cn(
                                        'group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300',
                                        isActive
                                            ? 'bg-gradient-to-r from-rose-700 to-red-600 text-white shadow-xl shadow-red-600/40 ring-2 ring-red-400/50'
                                            : 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-lg shadow-red-500/30 hover:from-rose-500 hover:to-red-500 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5'
                                    )
                                }
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                                    <Phone className="h-4 w-4 shrink-0 stroke-[2]" />
                                </span>
                                <span>Emergency</span>
                            </NavLink>
                        </nav>

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
                                {navItems.map(({ to, label, icon: Icon }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            cn(
                                                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium tracking-wide transition-all',
                                                isActive
                                                    ? 'bg-gradient-to-r from-blue-950 to-indigo-950 text-white shadow-md'
                                                    : 'text-slate-600 hover:bg-white hover:shadow-sm'
                                            )
                                        }
                                    >
                                        <Icon className="h-4 w-4 shrink-0 stroke-[1.75]" />
                                        <span>{label}</span>
                                    </NavLink>
                                ))}
                                <NavLink
                                    to="/emergency"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        cn(
                                            'mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-all',
                                            isActive
                                                ? 'bg-gradient-to-r from-rose-700 to-red-600 text-white shadow-md'
                                                : 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-sm'
                                        )
                                    }
                                >
                                    <Phone className="h-4 w-4 shrink-0 stroke-[2]" />
                                    <span>Emergency</span>
                                </NavLink>
                            </div>
                        </nav>
                    )}
                </div>
            </header>
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
