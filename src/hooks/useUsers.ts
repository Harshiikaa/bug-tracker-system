import { useCallback } from "react";

const API_URL = 'http://localhost:3001/api/users';

export const useUsers = (token: string | null) => {
 
  const getDevelopers = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL.replace(/\/$/, '')}/developers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('❌ Error fetching developers:', error);
      return [];
    }
  }, [token]);

  return { getDevelopers };
};
