// src/hooks/useBugs.ts
"use client"
import { useState, useEffect } from 'react';

export function useBugs(token: string | null) {
  const [bugs, setBugs] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetch('/api/bugs', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setBugs(data.bugs || []))
        .catch(err => console.error('Fetch bugs error:', err));
    }
  }, [token]);

  return { bugs };
}