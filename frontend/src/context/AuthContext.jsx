import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (name, email, password, role) => {
    const response = await api.post('/auth/signup', {
      name,
      email,
      password,
      role,
    });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
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
