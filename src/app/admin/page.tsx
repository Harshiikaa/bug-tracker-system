'use client';

import ProtectedAuth from "@/components/ProtectedAuth";
import { useBugs } from "@/hooks/useBugs";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const { getAllBugs } = useBugs(token);
     const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchBugs = async () => {
      setLoading(true); // Loading start
      try {
        const response = await getAllBugs("page=1&limit=10"); // API call
        console.log("🐞 Bugs response:", response); // Debug log
        if (response && response.bugs) {
          setBugs(response.bugs); // Bugs state update
        } else {
          setBugs([]); // Empty array if no bugs
        }
      } catch (error) {
        console.error("❌ Error fetching bugs:", error);
        setBugs([]); // Error pe empty array
      } finally {
        setLoading(false); // Loading end
      }
    };

    fetchBugs();
  }, [getAllBugs]); // Dependency mein getAllBugs daal diya

  //  useEffect(() => {
  //   getAllBugs("page=1&limit=10"); // Customize as needed
  // }, []);
  
  return (
     <ProtectedAuth allowedRoles={["Admin"]}>
       <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Welcome to Admin Dashboard 🧪
        </h1>

        {loading ? (
          <p>Loading bugs...</p>
        ) : bugs.length > 0 ? (
         <table className="w-full bg-white rounded-xl shadow-lg text-left border border-gray-100">
  <thead className="bg-gray-100 text-gray-700 font-semibold">
    <tr>
      <th className="p-4 rounded-tl-xl">Title</th>
      <th className="p-4">Status</th>
      <th className="p-4">Priority</th>
      <th className="p-4">Created By</th>
      <th className="p-4 rounded-tr-xl">Assigned To</th>
    </tr>
  </thead>
  <tbody>
    {bugs.map((bug: any) => (
      <tr
        key={bug._id}
        className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
      >
        <td className="p-4 font-medium text-gray-800">{bug.title}</td>
        <td className="p-4">
          <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              bug.status === 'Open'
                ? 'bg-blue-100 text-blue-700'
                : bug.status === 'In Progress'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {bug.status}
          </span>
        </td>
        <td className="p-4">
          <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              bug.priority === 'High'
                ? 'bg-red-100 text-red-700'
                : bug.priority === 'Medium'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {bug.priority}
          </span>
        </td>
        <td className="p-4 text-gray-600">{bug.createdBy?.name || 'Unknown'}</td>
        <td className="p-4 text-gray-600">{bug.assignedTo?.name || 'Unassigned'}</td>
      </tr>
    ))}
  </tbody>
</table>
        ) : (
          <p>No bugs found.</p>
        )}
      </div>
    </div>
    </ProtectedAuth>
   
  );
}
