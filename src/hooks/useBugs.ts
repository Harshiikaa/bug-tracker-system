"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBug,
  getAllBugs,
  getBugs,
  updateBug,
  deleteBug,
  addComment,
  deleteComment,
} from "@/api/bugs";
import { useEffect, useState } from "react";
import { Bug } from "@/types/Bug";

// 🔐 Define exact types for create and update payloads
type BugCreatePayload = Pick<Bug, "title" | "description" | "priority"> & {
  assignedTo?: string;
};

type BugUpdatePayload = Partial<
  Pick<Bug, "title" | "description" | "status" | "priority" | "assignedTo">
>;

export function useBugs(queryParams = "", options: { role?: string } = {}) {
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) setToken(storedToken);
  }, []);

  // 🔍 Query: Get bugs created by the logged-in user
  const getBugsQuery = useQuery<Bug[]>({
    queryKey: ["my-bugs"],
    queryFn: () => getBugs(token!),
    enabled: !!token,
  });

  // 🔍 Query: Admin fetches all bugs with filters
  const getAllBugsQuery = useQuery<{ bugs: Bug[] }>({
    queryKey: ["/", queryParams],
    queryFn: () => getAllBugs(token!, queryParams),
    enabled: !!token && options.role === "Admin",
  });

  // ➕ Mutation: Create a new bug
  const create = useMutation({
    mutationFn: (data: BugCreatePayload) => createBug(token!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-bugs"] }),
  });

  // ✏️ Mutation: Update a bug (strict fields)
  const update = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: BugUpdatePayload }) =>
      updateBug(token!, id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-bugs"] }),
  });

  // ❌ Mutation: Delete a bug
  const remove = useMutation({
    mutationFn: (id: string) => deleteBug(token!, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-bugs"] }),
  });

  // 💬 Mutation: Add comment
  const comment = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      addComment(token!, id, text),
  });

  // ❌ Mutation: Delete comment
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



// // src/hooks/useBugs.ts
// "use client";

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
 
//   createBug,
//   getAllBugs,
//   getBugs,
//   updateBug,
//   deleteBug,
//   addComment,
//   deleteComment,
// } from "@/api/bugs";
// import { useEffect, useState } from "react";
// import { Bug } from "@/types/Bug";

// export function useBugs(queryParams = "", options: { role?: string } = {}) {
//   const [token, setToken] = useState<string | null>(null);
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const storedToken = localStorage.getItem("authToken");
//     if (storedToken) setToken(storedToken);
//   }, []);

//   // Queries



//   const getBugsQuery = useQuery<Bug[]>({
//     queryKey: ["my-bugs"],
//     queryFn: () => getBugs(token!),
//     enabled:  !!token ,
//   });


//   const getAllBugsQuery = useQuery<{ bugs: Bug[] }>({
//     queryKey: ["/", queryParams], // cache by filters
//     queryFn: () => getAllBugs(token!, queryParams),
//         enabled: !!token && options.role === "Admin",
//   });

//   // Mutations
//   const create = useMutation({
//     mutationFn: (data: Partial<Bug> & { assignedTo?: string }) =>
//       createBug(token!, data),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-bugs"] }),
//   });

//   const update = useMutation({
//     mutationFn: ({ id, updates }: { id: string; updates: Partial<Bug> }) =>
//       updateBug(token!, id, updates),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-bugs"] }),
//   });

//   const remove = useMutation({
//     mutationFn: (id: string) => deleteBug(token!, id),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-bugs"] }),
//   });

//   const comment = useMutation({
//     mutationFn: ({ id, text }: { id: string; text: string }) =>
//       addComment(token!, id, text),
//   });

//   const removeComment = useMutation({
//     mutationFn: ({ bugId, commentId }: { bugId: string; commentId: string }) =>
//       deleteComment(token!, bugId, commentId),
//   });

//   return {
//     token,
//     getBugsQuery,
//     getAllBugsQuery,
//     create,
//     update,
//     remove,
//     comment,
//     removeComment,
//   };
// }
