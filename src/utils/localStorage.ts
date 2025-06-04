// src/utils/localStorage.ts
export const saveAuth = (token: string, user: any) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const getAuthToken = () => localStorage.getItem('authToken');
