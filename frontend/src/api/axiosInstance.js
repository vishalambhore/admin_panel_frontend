import axios from 'axios';

// ========== NODE BACKEND (with token) ==========
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ========== PYTHON BACKEND (with token) ==========
const pythonApi = axios.create({
    baseURL: 'http://localhost:8000/api',
});

// 🔥 ADD token interceptor for Python also
pythonApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helper functions for Python (optional)
export const pythonGet = (endpoint, params = {}) => pythonApi.get(endpoint, { params });
export const pythonPost = (endpoint, data) => pythonApi.post(endpoint, data);
export const pythonPut = (endpoint, data) => pythonApi.put(endpoint, data);
export const pythonDelete = (endpoint) => pythonApi.delete(endpoint);

export default axiosInstance;      // Node default
export { pythonApi };              // Python client with token