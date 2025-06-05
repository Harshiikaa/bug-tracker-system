// src/hooks/useBugs.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bug,
  createBug,
  getAllBugs,
  getBugs,
  updateBug,
  deleteBug,
  addComment,
  deleteComment,
} from "@/api/bugs";
import { useEffect, useState } from "react";

export function useBugs(queryParams = "", options: { role?: string } = {}) {
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) setToken(storedToken);
  }, []);

  // Queries



  const getBugsQuery = useQuery<Bug[]>({
    queryKey: ["my-bugs"],
    queryFn: () => getBugs(token!),
    enabled:  !!token ,
  });

//     console.log("🐛 Inside useBugs Hook");
// console.log("🔐 token:", token);
// console.log("🧪 role:", options.role);
// console.log("🟢 enabled condition:", !!token && options.role === "Tester");


  const getAllBugsQuery = useQuery<{ bugs: Bug[] }>({
    queryKey: ["/", queryParams], // cache by filters
    queryFn: () => getAllBugs(token!, queryParams),
        enabled: !!token && options.role === "Admin",
  });

  // Mutations
  const create = useMutation({
    mutationFn: (data: Partial<Bug> & { assignedTo?: string }) =>
      createBug(token!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-bugs"] }),
  });

  const update = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Bug> }) =>
      updateBug(token!, id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-bugs"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteBug(token!, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-bugs"] }),
  });

  const comment = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      addComment(token!, id, text),
  });

  const removeComment = useMutation({
    mutationFn: ({ bugId, commentId }: { bugId: string; commentId: string }) =>
      deleteComment(token!, bugId, commentId),
  });

  return {
    token,
    getBugsQuery,
    getAllBugsQuery,
    create,
    update,
    remove,
    comment,
    removeComment,
  };
}
