import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const { status } = error.response;
            
            if (status === 401) {
                // Handle unauthorized access
                localStorage.removeItem('token');
                // Only redirect to login if not already on login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            } else if (status === 403) {
                // Handle forbidden access (not admin)
                if (window.location.pathname.includes('/admin')) {
                    window.location.href = '/';
                }
            } else if (status === 419) {
                // CSRF token mismatch, try to refresh the page
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default api; 