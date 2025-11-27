// REST API Client to replace Apollo Client
const getApiUrl = () => {
    if (typeof window !== 'undefined') {
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
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

    getDailyReport: async () => {
        const result = await apiRequest('/api/reports/daily');
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

    getMonthlyReport: async () => {
        const result = await apiRequest('/api/reports/monthly');
        return result.data;
    },
};

export default api;

