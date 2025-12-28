// REST API Client to replace Apollo Client
// Note: In Next.js, NEXT_PUBLIC_* env vars are available at build time
// Make sure to set NEXT_PUBLIC_API_URL in your Vercel environment variables
const getApiUrl = () => {
    // Next.js makes NEXT_PUBLIC_* vars available in the browser
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
        console.warn('NEXT_PUBLIC_API_URL is not set! Using default localhost. Please set this in your Vercel environment variables.');
        return 'http://localhost:4000';
    }
    
    // Remove trailing slash if present
    return apiUrl.replace(/\/$/, '');
};

// Helper function to get auth token
const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const API_URL = getApiUrl();
    
    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_URL}${normalizedEndpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        
        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return { ok: true, data: null };
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return { ok: true, data };
    } catch (error) {
        console.error('API request error:', {
            url,
            method: config.method || 'GET',
            error: error.message
        });
        throw error;
    }
};

// API methods
export const api = {
    // Auth
    login: async (email, password) => {
        const result = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        return result.data;
    },

    // Users
    getMe: async () => {
        const result = await apiRequest('/api/users/me');
        return result.data;
    },

    getUsers: async () => {
        const result = await apiRequest('/api/users');
        return result.data;
    },

    getUser: async (id) => {
        const result = await apiRequest(`/api/users/${id}`);
        return result.data;
    },

    createUser: async (userData) => {
        const result = await apiRequest('/api/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        return result.data;
    },

    updateUser: async (id, userData) => {
        const result = await apiRequest(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
        return result.data;
    },

    deleteUser: async (id) => {
        const result = await apiRequest(`/api/users/${id}`, {
            method: 'DELETE',
        });
        return result.data;
    },

    // Services
    getServices: async () => {
        const result = await apiRequest('/api/services');
        return result.data;
    },

    getService: async (id) => {
        const result = await apiRequest(`/api/services/${id}`);
        return result.data;
    },

    createService: async (serviceData) => {
        const result = await apiRequest('/api/services', {
            method: 'POST',
            body: JSON.stringify(serviceData),
        });
        return result.data;
    },

    updateService: async (id, serviceData) => {
        const result = await apiRequest(`/api/services/${id}`, {
            method: 'PUT',
            body: JSON.stringify(serviceData),
        });
        return result.data;
    },

    deleteService: async (id) => {
        const result = await apiRequest(`/api/services/${id}`, {
            method: 'DELETE',
        });
        return result.data;
    },

    // Shops
    getShops: async () => {
        const result = await apiRequest('/api/shops');
        return result.data;
    },

    getShop: async (id) => {
        const result = await apiRequest(`/api/shops/${id}`);
        return result.data;
    },

    createShop: async (shopData) => {
        const result = await apiRequest('/api/shops', {
            method: 'POST',
            body: JSON.stringify(shopData),
        });
        return result.data;
    },

    updateShop: async (id, shopData) => {
        const result = await apiRequest(`/api/shops/${id}`, {
            method: 'PUT',
            body: JSON.stringify(shopData),
        });
        return result.data;
    },

    deleteShop: async (id) => {
        const result = await apiRequest(`/api/shops/${id}`, {
            method: 'DELETE',
        });
        return result.data;
    },

    // Entries
    getEntries: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/api/entries${queryParams ? `?${queryParams}` : ''}`;
        const result = await apiRequest(endpoint);
        return result.data;
    },

    getEntry: async (id) => {
        const result = await apiRequest(`/api/entries/${id}`);
        return result.data;
    },

    createEntry: async (entryData) => {
        const result = await apiRequest('/api/entries', {
            method: 'POST',
            body: JSON.stringify(entryData),
        });
        return result.data;
    },

    updateEntry: async (id, entryData) => {
        const result = await apiRequest(`/api/entries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(entryData),
        });
        return result.data;
    },

    deleteEntry: async (id) => {
        const result = await apiRequest(`/api/entries/${id}`, {
            method: 'DELETE',
        });
        return result.data;
    },

    // Reports
    getStats: async (startDate, endDate) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        const queryParams = new URLSearchParams(params).toString();
        const endpoint = `/api/reports/stats${queryParams ? `?${queryParams}` : ''}`;
        const result = await apiRequest(endpoint);
        return result.data;
    },

    getDailyReport: async (startDate, endDate) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        const queryParams = new URLSearchParams(params).toString();
        const endpoint = `/api/reports/daily${queryParams ? `?${queryParams}` : ''}`;
        const result = await apiRequest(endpoint);
        return result.data;
    },

    getWeeklyReport: async (startDate, endDate) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        const queryParams = new URLSearchParams(params).toString();
        const endpoint = `/api/reports/weekly${queryParams ? `?${queryParams}` : ''}`;
        const result = await apiRequest(endpoint);
        return result.data;
    },

    getMonthlyReport: async (startDate, endDate) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        const queryParams = new URLSearchParams(params).toString();
        const endpoint = `/api/reports/monthly${queryParams ? `?${queryParams}` : ''}`;
        const result = await apiRequest(endpoint);
        return result.data;
    },

    // Pay Later
    getPayLaterEntries: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/api/paylater${queryParams ? `?${queryParams}` : ''}`;
        const result = await apiRequest(endpoint);
        return result.data;
    },

    getUnpaidPayLater: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/api/paylater/unpaid${queryParams ? `?${queryParams}` : ''}`;
        const result = await apiRequest(endpoint);
        return result.data;
    },

    createPayLater: async (payLaterData) => {
        const result = await apiRequest('/api/paylater', {
            method: 'POST',
            body: JSON.stringify(payLaterData),
        });
        return result.data;
    },

    markPayLaterAsPaid: async (id) => {
        const result = await apiRequest(`/api/paylater/${id}/mark-paid`, {
            method: 'PUT',
        });
        return result.data;
    },

    getPayLater: async (id) => {
        const result = await apiRequest(`/api/paylater/${id}`);
        return result.data;
    },

    deletePayLater: async (id) => {
        const result = await apiRequest(`/api/paylater/${id}`, {
            method: 'DELETE',
        });
        return result.data;
    },

    deleteAllPayLater: async (isPaid) => {
        const params = {};
        if (isPaid !== undefined) params.isPaid = isPaid;
        const queryParams = new URLSearchParams(params).toString();
        const endpoint = `/api/paylater${queryParams ? `?${queryParams}` : ''}`;
        const result = await apiRequest(endpoint, {
            method: 'DELETE',
        });
        return result.data;
    },
};

export default api;

