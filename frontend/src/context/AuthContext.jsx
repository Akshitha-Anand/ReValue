import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fake load for demo if no backend, otherwise verify token
        if (token) {
            // Decode or verify. Sticking to simple for now.
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                setUser(storedUser);
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        } else {
            // Demo default user if we want
            // setUser({ name: 'Demo User', role: 'individual' });
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            setUser(res.data.user);
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', userData);
            setUser(res.data.user);
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
