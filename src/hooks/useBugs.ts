'use client';

import { useCallback, useState } from 'react';
type Bug = {
  _id: string;
  title: string;
  description: string;
  status?: string;
  priority?: string;
  createdBy?: { name: string };
  assignedTo?: { name: string };
};

type BugResponse = {
  bugs: Bug[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};
const API_URL = 'http://localhost:3001/api/bugs';

export function useBugs(token: string | null) {
    // const finalToken = token || (typeof window !== "undefined" ? localStorage.getItem("authToken") : null);
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
  const getAllBugs = useCallback(
    async (queryParams = '') => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}?${queryParams}`, { headers });
        const data = await res.json();
        console.log('🐞 Get all bugs response:', data); // Debug log
        if (data.bugs) {
          setBugs(data.bugs); // Update bugs state
        } else {
          setBugs([]); // Empty array if no bugs
        }
        return data; // Return data for external use (e.g., pagination)
      } catch (err) {
        console.error('Get all bugs error:', err);
        setBugs([]); // Set empty on error
      } finally {
        setLoading(false);
      }
    },
    [token] // Depend on token directly instead of headers
  );

  const getBugById = useCallback(
  async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { headers });
      const data = await res.json();
      console.log('🐞 Get bug by ID response:', data); // Debug log
      if (data._id) {
        setBug(data); // Update bug state
      } else {
        setBug(null); // Set null if no valid bug
      }
      return data; // Return data for external use
    } catch (err) {
      console.error('Get bug by ID error:', err);
      setBug(null); // Set null on error
    } finally {
      setLoading(false);
    }
  },
  [token] // Depend on token directly instead of headers
);
  // const getBugById = async (id: string) => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`${API_URL}/${id}`, { headers });
  //     const data = await res.json();
  //     if (data._id) setBug(data);
  //     return data;
  //   } catch (err) {
  //     console.error('Get bug by ID error:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
