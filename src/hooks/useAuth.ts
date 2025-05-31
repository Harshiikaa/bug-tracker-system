// src/hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Load token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
    }
  }, []);


  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success) {
        console.log('Registration successful:', data.message);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };


  // Login
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user)); 
        setToken(data.token);
        setUser(data.user);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // Get Profile
  const fetchProfile = async (authToken: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/profile', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (data.id) {
        setUser(data);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    }
  };

  // Update Profile
  const updateProfile = async (updates: {
    name?: string;
    email?: string;
    password?: string;
  }) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        console.log('Profile updated successfully');
      } else {
        throw new Error(data.message || 'Profile update failed');
      }
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return {
    token,
    user,
    register,
    login,
    fetchProfile,
    updateProfile,
    logout
  };
}