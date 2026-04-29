import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await axios.get('/api/auth/me', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(res.data);
                }
            } catch (err) {
                // Only remove token if it's invalid (401), not if account is suspended (403)
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                }
                console.error('Auth check error:', err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    // Login function
    const login = useCallback(async (email, password) => {
        setError(null);
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return false;
        }
    }, []);

    // Register function
    const register = useCallback(async (userData) => {
        setError(null);
        try {
            const res = await axios.post('/api/auth/register', userData);
            return { success: true, message: res.data.message };
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            return { success: false };
        }
    }, []);

    // Verify Email Function
    const verifyEmailToken = useCallback(async (token) => {
        try {
            const res = await axios.get(`/api/auth/verify-email/${token}`);
            return { success: true, message: res.data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Verification failed' };
        }
    }, []);

    // Forgot Password
    const forgotPassword = useCallback(async (email) => {
        setError(null);
        try {
            const res = await axios.post('/api/auth/forgot-password', { email });
            return { success: true, message: res.data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to send reset email' };
        }
    }, []);

    // Reset Password
    const resetPassword = useCallback(async (token, password) => {
        setError(null);
        try {
            const res = await axios.put(`/api/auth/reset-password/${token}`, { password });
            return { success: true, message: res.data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to reset password' };
        }
    }, []);

    // Google Login function
    const googleLogin = useCallback(async (idToken) => {
        setError(null);
        try {
            const res = await axios.post('/api/auth/google', { idToken });
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Google Login failed');
            return false;
        }
    }, []);

    // Logout function
    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            if(token) {
                await axios.post('/api/auth/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        } catch (err) {
            console.error('Logout error on server', err);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser,
            loading, 
            error, 
            login, 
            googleLogin,
            register, 
            logout, 
            setError,
            verifyEmailToken,
            forgotPassword,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};
