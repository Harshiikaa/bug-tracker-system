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
          <table className="w-full bg-white rounded shadow text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Created By</th>
                <th className="p-3">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {bugs.map((bug: any) => (
                <tr key={bug._id} className="border-b">
                  <td className="p-3">{bug.title}</td>
                  <td className="p-3">{bug.status}</td>
                  <td className="p-3">{bug.priority}</td>
                  <td className="p-3">{bug.createdBy?.name || "Unknown"}</td>
                  <td className="p-3">{bug.assignedTo?.name || "Unassigned"}</td>
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
