import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('saumya_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('saumya_token', data.token);
      localStorage.setItem('saumya_user', JSON.stringify(data.user));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      return { success: true };
    }
    const error = await response.text();
    return { success: false, error };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('saumya_token');
    localStorage.removeItem('saumya_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
