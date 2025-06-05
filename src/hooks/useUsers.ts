'use client';

import { getAllUsers, getDevelopers, User } from '@/api/user';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function useUsers() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const getUsersQuery = useQuery({
    queryKey: ['users'],
     queryFn: async () => {
  const response = await getAllUsers(token!);
  return response; 
},
    enabled: !!token,
  });

  const getDevelopersQuery = useQuery({
    queryKey: ['developers'],
    queryFn: async () => {
  const response = await getDevelopers(token!);
  return response; 
},
    enabled: !!token,
  });

  return {
    token,
    getUsersQuery,
    getDevelopersQuery,
  };
}



// 'use client';

// import { getAllUsers, getDevelopers, User } from '@/api/user';
// import { useQuery } from '@tanstack/react-query';
// import { useEffect, useState } from 'react';

// export function useUsers() {
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('authToken');
//     if (storedToken) setToken(storedToken);
//   }, []);

//   const getUsersQuery = useQuery<User[]>({
//     queryKey: ['users'],
//     queryFn: () => getAllUsers(token!),
//     enabled: !!token,
//   });

//   const getDevelopersQuery = useQuery<User[]>({
//     queryKey: ['developers'],
//     queryFn: () => getDevelopers(token!),
//     enabled: !!token,
//   });

//   return {
//     token,
//     getUsersQuery,
//     getDevelopersQuery,
//   };
// }
