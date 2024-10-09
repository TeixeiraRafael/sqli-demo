import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../axiosInstance';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('/login', {
        username,
        password,
      });

      const token = response.data.access_token;
      localStorage.setItem('access_token', token);
      setIsAuthenticated(true);

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/register', { username, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.detail || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false); 
  };

  const contextValue = {
    isAuthenticated,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
