'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedAuthProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedAuth = ({ allowedRoles, children }: ProtectedAuthProps) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    console.log('🔒 token:', token);
    console.log('👤 user:', storedUser);

    if (!token || !storedUser) {
      router.replace('/login');
      return;
    }

    if (!allowedRoles.includes(storedUser.role)) {
      router.replace('/unauthorized');
      return;
    }

    setAuthorized(true);
    setLoading(false);
  }, [allowedRoles, router]);

  if (loading) return <div>Loading...</div>;

  return authorized ? <>{children}</> : null;
};

export default ProtectedAuth;
