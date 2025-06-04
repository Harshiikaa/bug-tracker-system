import { api } from "./axiosInstance";

// Register
export const registerUser = async (user: { name: string, email: string, password: string }) => {
  const res = await api.post('/auth/register', user);
  return res.data;
};

// Login
export const loginUser = async (credentials: { email: string, password: string }) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

// Get Profile
export const fetchUserProfile = async (token: string) => {
  const res = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update Profile
export const updateUserProfile = async (token: string, updates: any) => {
  const res = await api.put('/auth/profile', updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};