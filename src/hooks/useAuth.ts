// src/hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  // useEffect(() => {
  //   fetch('/api/auth/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email: 'john@example.com', password: 'password123' })
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.success) {
  //         setToken(data.token);
  //       }
  //     })
  //     .catch(err => console.error('Login error:', err));
  // }, []);

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

  return { token, register };
}