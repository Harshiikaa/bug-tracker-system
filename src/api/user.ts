import { handleAxiosResponse } from '@/utils/handleAxiosResponse';
import { api } from './axiosInstance';

export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Tester' | 'Developer';
};

// 🔐 Auth header helper
const authHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ✅ Get all users
export const getAllUsers = (token: string) =>
  handleAxiosResponse<User[]>(
    api.get('/users', authHeader(token))
  );

// ✅ Get only developers
export const getDevelopers = (token: string) =>
  handleAxiosResponse<User[]>(
    api.get('/users/developers', authHeader(token))
  );

// ⛏️ Add more endpoints like updateUser, deleteUser etc. as needed
