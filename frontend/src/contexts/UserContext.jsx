import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const verifyUser = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const response = await axiosInstance.get('/user/verify', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.authenticated) {
                setUser(response.data.user);
            } else {
                // फक्त तेव्हाच काढा जेव्हा स्पष्टपणे authenticated: false येईल
                localStorage.removeItem('userToken');
                setUser(null);
            }
        } catch (error) {
            // जर 401 (unauthorized) आला तरच token काढा, अन्यथा ठेवा
            if (error.response?.status === 401) {
                console.warn('User token invalid, removing');
                localStorage.removeItem('userToken');
                setUser(null);
            } else {
                console.error('User verification network error, keeping token', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { verifyUser(); }, []);

    const login = async (email, password) => {
        try {
            const res = await axiosInstance.post('/user/login', { email, password });
            if (res.data.success) {
                localStorage.setItem('userToken', res.data.token);
                setUser(res.data.user);
                return { success: true, user: res.data.user };
            }
            return { success: false, message: res.data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};