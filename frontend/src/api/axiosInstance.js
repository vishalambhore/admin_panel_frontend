import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://adminbackend.sparklerstech.com/api',  
});

axiosInstance.interceptors.request.use((config) => {
    // 👇 adminToken (admin login) OR userToken (normal user login)
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;