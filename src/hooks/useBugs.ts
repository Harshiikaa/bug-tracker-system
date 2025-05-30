'use client';

import { useState } from 'react';

const API_URL = 'http://localhost:3001/api/bugs';

export function useBugs(token: string | null) {
  const [bugs, setBugs] = useState<any[]>([]);
  const [bug, setBug] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  // Create bug
  const createBug = async (bugData: {
    title: string;
    description: string;
    priority?: string;
    status?: string;
    assignedTo?: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(bugData)
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Create bug error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get all bugs
  const getAllBugs = async (queryParams = '') => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?${queryParams}`, { headers });
      const data = await res.json();
      if (data.bugs) setBugs(data.bugs);
      return data;
    } catch (err) {
      console.error('Get all bugs error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get bug by ID
  const getBugById = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { headers });
      const data = await res.json();
      if (data._id) setBug(data);
      return data;
    } catch (err) {
      console.error('Get bug by ID error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update bug
  const updateBug = async (id: string, updates: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Update bug error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete bug
  const deleteBug = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Delete bug error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add comment
  const addComment = async (bugId: string, text: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${bugId}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Add comment error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete comment
  const deleteComment = async (bugId: string, commentId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${bugId}/comments/${commentId}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Delete comment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    bugs,
    bug,
    loading,
    createBug,
    getAllBugs,
    getBugById,
    updateBug,
    deleteBug,
    addComment,
    deleteComment
  };
}
