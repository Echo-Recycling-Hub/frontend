import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './authService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authService.verifyToken(token).then(response => {
                setIsAuthenticated(true);
                setUser(response.user);
            }).catch(() => {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
            });
        }
    }, []);

    const login = async (userid, password) => {
        try {
            const response = await authService.login(userid, password);
            if (response.token && response.user) {
                localStorage.setItem('token', response.token);
                setUser(response.user);
                setIsAuthenticated(true);
                navigate('/');
            } else {
                console.error('Token not found in response');
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
