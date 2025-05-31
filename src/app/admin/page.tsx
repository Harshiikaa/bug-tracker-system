'use client';

import ProtectedAuth from "@/components/ProtectedAuth";

export default function AdminDashboard() {
  return (
     <ProtectedAuth allowedRoles={["Admin"]}>
       <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-green-700">Welcome to Admin Dashboard 🧪</h1>
    </div>
    </ProtectedAuth>
   
  );
}
