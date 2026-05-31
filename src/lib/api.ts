// API utility functions for making HTTP requests to the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// Rooms API
export const roomsAPI = {
    getAll: () => fetchAPI('/rooms'),
    getById: (id: string) => fetchAPI(`/rooms/${id}`),
    update: (id: string, updates: any) => fetchAPI(`/rooms/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    }),
};

// Bookings API
export const bookingsAPI = {
    getAll: () => fetchAPI('/bookings'),
    getById: (id: string) => fetchAPI(`/bookings/${id}`),
    create: (booking: any) => fetchAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify(booking),
    }),
    update: (id: string, updates: any) => fetchAPI(`/bookings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    }),
};

// Complaints API
export const complaintsAPI = {
    getAll: () => fetchAPI('/complaints'),
    getById: (id: string) => fetchAPI(`/complaints/${id}`),
    create: (complaint: any) => fetchAPI('/complaints', {
        method: 'POST',
        body: JSON.stringify(complaint),
    }),
    update: (id: string, updates: any) => fetchAPI(`/complaints/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    }),
};

// Emergencies API
export const emergenciesAPI = {
    getAll: () => fetchAPI('/emergencies'),
    getById: (id: string) => fetchAPI(`/emergencies/${id}`),
    create: (emergency: any) => fetchAPI('/emergencies', {
        method: 'POST',
        body: JSON.stringify(emergency),
    }),
    update: (id: string, updates: any) => fetchAPI(`/emergencies/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    }),
};

// Feedback API
export const feedbackAPI = {
    getAll: () => fetchAPI('/feedback'),
    create: (feedback: any) => fetchAPI('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedback),
    }),
};

// Staff API
export const staffAPI = {
    getAll: () => fetchAPI('/staff'),
    getById: (id: string) => fetchAPI(`/staff/${id}`),
    create: (staff: any) => fetchAPI('/staff', {
        method: 'POST',
        body: JSON.stringify(staff),
    }),
    update: (id: string, updates: any) => fetchAPI(`/staff/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    }),
    delete: (id: string) => fetchAPI(`/staff/${id}`, {
        method: 'DELETE',
    }),
};

// Auth API
export const authAPI = {
    login: (email: string, password: string) => fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    }),
    register: (userData: any) => fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    verify: () => fetchAPI('/auth/verify', {
        headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
    }),
};

// Users API
export const usersAPI = {
    getAll: () => fetchAPI('/users'),
    delete: (id: string) => fetchAPI(`/users/${id}`, {
        method: 'DELETE',
    }),
};

// Analytics API
export const analyticsAPI = {
    getAnalytics: () => fetchAPI('/analytics'),
    getActivity: () => fetchAPI('/analytics/activity'),
};
