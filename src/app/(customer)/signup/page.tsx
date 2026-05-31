'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, User, Phone, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

export default function Signup() {
    const router = useRouter();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const passwordsMatch = confirmPassword === '' || formData.password === confirmPassword;
    const showMismatch = confirmPassword !== '' && formData.password !== confirmPassword;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== confirmPassword) {
            setError('Passwords do not match. Please try again.');
            return;
        }

        setIsLoading(true);
        
        try {
            const success = await register(formData);
            if (success) {
                router.push('/login');
            } else {
                setError('Registration failed. Email might already exist.');
            }
        } catch (err) {
            setError('An error occurred during registration.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4.25rem)] items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Create an Account</h1>
                    <p className="text-slate-600">Join us to manage your bookings and more</p>
                </div>

                <div className="bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-blue-900/5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-sm flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    className="pl-11 h-12 bg-white/50 border-slate-200/80 focus:bg-white transition-colors rounded-xl"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-11 h-12 bg-white/50 border-slate-200/80 focus:bg-white transition-colors rounded-xl"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Phone Number (Optional)</label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="pl-11 h-12 bg-white/50 border-slate-200/80 focus:bg-white transition-colors rounded-xl"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    type="password"
                                    placeholder="Create a strong password"
                                    className="pl-11 h-12 bg-white/50 border-slate-200/80 focus:bg-white transition-colors rounded-xl"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 ${showMismatch ? 'text-red-400' : 'text-slate-400'}`} />
                                <Input
                                    type="password"
                                    placeholder="Re-enter your password"
                                    className={`pl-11 h-12 bg-white/50 focus:bg-white transition-colors rounded-xl ${
                                        showMismatch
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                            : confirmPassword && passwordsMatch
                                            ? 'border-green-400 focus:border-green-500 focus:ring-green-200'
                                            : 'border-slate-200/80'
                                    }`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {showMismatch && (
                                <p className="mt-1.5 ml-1 text-xs text-red-500 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    Passwords do not match
                                </p>
                            )}
                            {confirmPassword && passwordsMatch && (
                                <p className="mt-1.5 ml-1 text-xs text-green-600 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Passwords match
                                </p>
                            )}
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-12 mt-2 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={isLoading || showMismatch}
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>
                    
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white/80 px-4 text-slate-500 rounded-full">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-11 rounded-xl border-slate-200 bg-white/50 hover:bg-white text-slate-700">
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline" className="h-11 rounded-xl border-slate-200 bg-white/50 hover:bg-white text-slate-700">
                                <Apple className="mr-2 h-5 w-5" />
                                Apple
                            </Button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
