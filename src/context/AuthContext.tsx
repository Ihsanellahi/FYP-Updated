'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Staff' | 'customer';
}

interface AuthContextType {
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<boolean>;
    loginWithGoogle: () => Promise<boolean>;
    loginWithApple: () => Promise<boolean>;
    register: (userData: any) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('auth-user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse auth-user from localStorage:', e);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await authAPI.login(email, password);
            if (response.success && response.user) {
                setUser(response.user);
                localStorage.setItem('auth-user', JSON.stringify(response.user));
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async (): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await authAPI.loginWithGoogle();
            if (response.success && response.user) {
                setUser(response.user);
                localStorage.setItem('auth-user', JSON.stringify(response.user));
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Google login failed:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const loginWithApple = async (): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await authAPI.loginWithApple();
            if (response.success && response.user) {
                setUser(response.user);
                localStorage.setItem('auth-user', JSON.stringify(response.user));
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Apple login failed:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: any): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await authAPI.register(userData);
            if (response.success) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Registration failed:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth-user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, loginWithGoogle, loginWithApple, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
