import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
    setLoading(false);
  }, []);

  const signup = async (name, email, password, role) => {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      name,
      email,
      password,
      role,
    });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    return userData;
  };

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    isAdmin: user?.role === 'Admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
