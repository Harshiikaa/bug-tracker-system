// src/hooks/useAuth.ts
"use client";

import {
  fetchUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
  User,
} from "@/api/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Load token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    }
  }, []);

  //  Profile Query (enabled only if token exists)
  const { data: user, refetch: refetchProfile } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: () => fetchUserProfile(token!),
    enabled: !!token,
  });

  // Register Mutation
  const register = useMutation({
    mutationFn: registerUser,
  });

  // Login Mutation
  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      setToken(data.token);
      queryClient.setQueryData(["profile"], data.user); // Optimistic update
    },
  });

  // Update Profile Mutation
  const updateProfile = useMutation({
    mutationFn: (updates: any) => updateUserProfile(user!.id, token!, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
  });

  // Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    queryClient.removeQueries({ queryKey: ["profile"] });
  };

  // const register = async (name: string, email: string, password: string) => {

  //   try {
  //     const data = await registerUser({ name, email, password });
  //     console.log('Registration successful:', data);
  //   } catch (err: any) {
  //     console.error('Registration failed:', err.message);
  //   }
  // };

  // Login

  // const login = async (email: string, password: string) => {
  //   try {
  //     const data = await loginUser({ email, password });
  //     localStorage.setItem('authToken', data.token);
  //     setToken(data.token);
  //     setUser(data.user);
  //   } catch (err: any) {
  //     console.error('Login failed:', err.message);
  //   }
  // };

  // Get Profile
  // const fetchProfile = async (authToken: string) => {
  //   try {
  //     const data = await fetchUserProfile(authToken);
  //     if (data?.id) {
  //       setUser(data);
  //     }
  //   } catch (err) {
  //     console.error('Fetch profile error:', err);
  //   }
  // };

  // Update Profile
  // const updateProfile = async (updates: {
  //   name?: string;
  //   email?: string;
  //   password?: string;
  // }) => {
  //   try {
  //     const res = await fetch('http://localhost:3001/api/auth/profile', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: JSON.stringify(updates)
  //     });
  //     const data = await res.json();
  //     if (data.success) {
  //       setUser(data.user);
  //       console.log('Profile updated successfully');
  //     } else {
  //       throw new Error(data.message || 'Profile update failed');
  //     }
  //   } catch (err) {
  //     console.error('Update profile error:', err);
  //   }
  // };

  // Logout
  // const logout = () => {
  //   localStorage.removeItem('authToken');
  //   setToken(null);
  //   setUser(null);
  // };

  return {
    token,
    user,
    register,
    login,
    fetchUserProfile,
    updateProfile,
    logout,
  };
}
