// src/api/bugs.ts
import { handleAxiosResponse } from '@/utils/handleAxiosResponse';
import { api } from './axiosInstance';
import { Bug } from '@/types/Bug';

// export type Bug = {
//   _id: string;
//   title: string;
//   description: string;
//   status?: string;
//   priority?: string;
//   createdBy?: { name: string };
//  assignedTo?: string | { _id: string; name: string };};

const authHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createBug = (token: string, bugData: Partial<Bug> & { assignedTo?: string }) =>
  handleAxiosResponse<Bug>(
    api.post('/bugs', bugData, authHeader(token))
  );

export const getAllBugs = (token: string, queryParams = '') =>
  handleAxiosResponse<{ bugs: Bug[] }>(
    api.get(`/bugs?${queryParams}`, authHeader(token))
  );

export const getBugById = (token: string, id: string) =>
  handleAxiosResponse<Bug>(
    api.get(`/bugs/${id}`, authHeader(token))
  );

  export const getBugs = (token: string) =>
  handleAxiosResponse<Bug[]>(
    api.get('/bugs/my-bugs', authHeader(token))
  );

export const updateBug = (token: string, id: string, updates: Partial<Bug>) =>
  handleAxiosResponse<Bug>(
    api.put(`/bugs/${id}`, updates, authHeader(token))
  );

export const deleteBug = (token: string, id: string) =>
  handleAxiosResponse<{ message: string }>(
    api.delete(`/bugs/${id}`, authHeader(token))
  );

export const addComment = (token: string, bugId: string, text: string) =>
  handleAxiosResponse<Bug>(
    api.post(`/bugs/${bugId}/comments`, { text }, authHeader(token))
  );

export const deleteComment = (token: string, bugId: string, commentId: string) =>
  handleAxiosResponse<Bug>(
    api.delete(`/bugs/${bugId}/comments/${commentId}`,authHeader(token))
  );
