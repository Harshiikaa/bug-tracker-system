import { handleAxiosResponse } from "@/utils/handleAxiosResponse";
import { api } from "./axiosInstance";


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Admin' | 'Tester';
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const authHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Register
export const registerUser =  (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return handleAxiosResponse<void>(api.post('/auth/register', data));
};


// Login
export const loginUser =  (data: {
  email: string;
  password: string;
}) => {
  return handleAxiosResponse<AuthResponse>(api.post('/auth/login', data));
};


// Get Profile
// api/auth.ts
export const fetchUserProfile =  (token: string): Promise<User> => {
  return handleAxiosResponse<User>(
    api.get('/auth/profile', authHeader(token))
  );
};

// Update Profile
export const updateUserProfile =  (
  id: string,
  token: string,
  updates: Partial<Pick<User, 'name' | 'email'>> & { password?: string }
) => {
  return handleAxiosResponse<User>(
    api.put(`/auth/profile/${id}`, updates, authHeader(token))
  );
};