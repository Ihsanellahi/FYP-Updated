'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Booking, Complaint, Emergency, Feedback } from '@/types';
import { bookingsAPI, complaintsAPI, emergenciesAPI, feedbackAPI } from '@/lib/api';

interface DataContextType {
    bookings: Booking[];
    complaints: Complaint[];
    emergencies: Emergency[];
    feedback: Feedback[];
    loading: boolean;
    addBooking: (booking: Booking) => Promise<void>;
    updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
    addComplaint: (complaint: Complaint) => Promise<void>;
    updateComplaint: (id: string, updates: Partial<Complaint>) => Promise<void>;
    addEmergency: (emergency: Emergency) => Promise<void>;
    updateEmergency: (id: string, updates: Partial<Emergency>) => Promise<void>;
    addFeedback: (fb: Feedback) => Promise<void>;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [emergencies, setEmergencies] = useState<Emergency[]>([]);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        try {
            setLoading(true);
            const [bookingsData, complaintsData, emergenciesData, feedbackData] = await Promise.all([
                bookingsAPI.getAll(),
                complaintsAPI.getAll(),
                emergenciesAPI.getAll(),
                feedbackAPI.getAll(),
            ]);
            setBookings(bookingsData);
            setComplaints(complaintsData);
            setEmergencies(emergenciesData);
            setFeedback(feedbackData);
        } catch (error) {
            // Backend is currently separated/unavailable, silencing this error to keep the console clean
            console.warn('Backend unavailable, using default empty state for data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const addBooking = async (booking: Booking) => {
        try {
            const newBooking = await bookingsAPI.create(booking);
            setBookings(prev => [...prev, newBooking]);
        } catch (error) {
            console.error('Failed to create booking:', error);
            throw error;
        }
    };

    const updateBooking = async (id: string, updates: Partial<Booking>) => {
        try {
            const updatedBooking = await bookingsAPI.update(id, updates);
            setBookings(prev =>
                prev.map(booking => (booking.id === id ? updatedBooking : booking))
            );
        } catch (error) {
            console.error('Failed to update booking:', error);
            throw error;
        }
    };

    const addComplaint = async (complaint: Complaint) => {
        try {
            const newComplaint = await complaintsAPI.create(complaint);
            setComplaints(prev => [...prev, newComplaint]);
        } catch (error) {
            console.error('Failed to create complaint:', error);
            throw error;
        }
    };

    const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
        try {
            const updatedComplaint = await complaintsAPI.update(id, updates);
            setComplaints(prev =>
                prev.map(complaint => (complaint.id === id ? updatedComplaint : complaint))
            );
        } catch (error) {
            console.error('Failed to update complaint:', error);
            throw error;
        }
    };

    const addEmergency = async (emergency: Emergency) => {
        try {
            const newEmergency = await emergenciesAPI.create(emergency);
            setEmergencies(prev => [...prev, newEmergency]);
        } catch (error) {
            console.error('Failed to create emergency:', error);
            throw error;
        }
    };

    const updateEmergency = async (id: string, updates: Partial<Emergency>) => {
        try {
            const updatedEmergency = await emergenciesAPI.update(id, updates);
            setEmergencies(prev =>
                prev.map(emergency => (emergency.id === id ? updatedEmergency : emergency))
            );
        } catch (error) {
            console.error('Failed to update emergency:', error);
            throw error;
        }
    };

    const addFeedback = async (fb: Feedback) => {
        try {
            const newFeedback = await feedbackAPI.create(fb);
            setFeedback(prev => [...prev, newFeedback]);
        } catch (error) {
            console.error('Failed to create feedback:', error);
            throw error;
        }
    };

    return (
        <DataContext.Provider
            value={{
                bookings,
                complaints,
                emergencies,
                feedback,
                loading,
                addBooking,
                updateBooking,
                addComplaint,
                updateComplaint,
                addEmergency,
                updateEmergency,
                addFeedback,
                refreshData,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
