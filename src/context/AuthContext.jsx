import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Load user on mount or when token changes
    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // api interceptor will attach token automatically
                const { data } = await api.get('/auth/profile');
                setUser(data);
            } catch (error) {
                console.error("Auth Load Error:", error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data);
        return data;
    };

    const register = async (name, email, password, role) => {
        const { data } = await api.post('/auth/register', { name, email, password, role });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data);
        return data; // Return data so page can redirect
    };

    const googleLogin = async (credential) => {
        const { data } = await api.post('/auth/google', { credential });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, googleLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
