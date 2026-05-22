import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const verifyAdmin = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const response = await axiosInstance.get('/admin/check-auth', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.authenticated) {
                setAdmin(response.data.admin);
            } else {
                localStorage.removeItem('adminToken');
                setAdmin(null);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('adminToken');
                setAdmin(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { verifyAdmin(); }, []);

    const login = async (email, password) => {
        try {
            const res = await axiosInstance.post('/admin/login', { email, password });
            if (res.data.success) {
                localStorage.setItem('adminToken', res.data.token);
                setAdmin(res.data.admin);
                return { success: true };
            }
            return { success: false, message: res.data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};