'use client';

import ProtectedAuth from "@/components/ProtectedAuth";
import { useBugs } from "@/hooks/useBugs";
import { useUsers } from "@/hooks/useUsers";
import { useEffect, useState } from "react";

interface Bug {
  _id: string;
  title: string;
  status: string;
  priority: string;
  createdBy: { name: string } | null;
  assignedTo: string | { _id: string; name: string; email: string } | null;
}
interface Developer {
  _id: string;
  name: string;
  email: string;
}

const API_URL = "http://localhost:3001/api/bugs";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("authToken") : ""}`,
};

export default function AdminDashboard() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const { getAllBugs } = useBugs(token);
  const { getDevelopers } = useUsers(token);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDevelopers, setLoadingDevelopers] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  // Fetch bugs
  const fetchBugs = async () => {
    setLoading(true);
    try {
      const response = await getAllBugs("page=1&limit=10");
      console.log("🐞 Bugs response:", JSON.stringify(response, null, 2));
      const normalizedBugs = response?.bugs.map((bug: any) => ({
        ...bug,
        assignedTo: bug.assignedTo
          ? typeof bug.assignedTo === "string"
            ? bug.assignedTo
            : bug.assignedTo._id
          : null,
      })) || [];
      setBugs(normalizedBugs);
    } catch (error) {
      console.error("❌ Error fetching bugs:", error);
      setBugs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBugs();
    }
  }, [getAllBugs, token]);

  // Fetch developers
  useEffect(() => {
    const fetchDevelopers = async () => {
      setLoadingDevelopers(true);
      try {
        const developersData = await getDevelopers();
        console.log("👨‍💻 Developers data:", JSON.stringify(developersData, null, 2));
        setDevelopers(developersData || []);
      } catch (error) {
        console.error("❌ Error fetching developers:", error);
        setDevelopers([]);
      } finally {
        setLoadingDevelopers(false);
      }
    };

    if (token) {
      fetchDevelopers();
    }
  }, [getDevelopers, token]);

  // Function to find developer's name by ID
  const getDeveloperName = (assigned: string | { _id: string; name: string; email: string } | null) => {
    if (!assigned) {
      console.log("No assignedTo value for bug");
      return "Unassigned";
    }
    const assignedId = typeof assigned === "string" ? assigned : assigned._id;
    const developer = developers.find((dev: Developer) => {
      const match = dev._id === assignedId;
      if (!match) {
        console.log(`No developer found for assignedTo: ${assignedId}, developer IDs:`, developers.map(d => d._id));
      }
      return match;
    });
    return developer ? developer.name : "Unassigned";
  };

  // Function to get list of developer names
  const getDeveloperNames = (developers: Developer[]) => {
    const names = developers.map((dev) => dev.name);
    console.log("List of developers:", names);
    return names;
  };

  // Call getDeveloperNames when developers changes
  useEffect(() => {
    if (developers.length > 0) {
      getDeveloperNames(developers);
    }
  }, [developers]);

  // Update bug assignment
  const updateBug = async (id: string, updates: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      console.log("Update bug response:", JSON.stringify(data, null, 2));
      if (!res.ok) {
        throw new Error(data.message || "Failed to update bug");
      }
      return {
        ...data,
        assignedTo: data.assignedTo
          ? typeof data.assignedTo === "string"
            ? data.assignedTo
            : data.assignedTo._id
          : null,
      };
    } catch (err) {
      console.error("Update bug error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle assignment change
  const handleAssignChange = async (bugId: string, newAssignedTo: string) => {
    try {
      const updates = { assignedTo: newAssignedTo || null };
      const updatedBug = await updateBug(bugId, updates);
      if (updatedBug) {
        // Refetch bugs to ensure UI reflects backend state
        await fetchBugs();
        console.log(`Assigned bug ${bugId} to ${newAssignedTo || "Unassigned"}`);
      }
    } catch (error) {
      console.error("Error updating bug assignment:", error);
      alert("Failed to update bug assignment. Please try again.");
    }
    setShowDropdown(null);
  };

  // Toggle dropdown visibility
  const toggleDropdown = (bugId: string) => {
    setShowDropdown((prev) => (prev === bugId ? null : bugId));
  };

  return (
    <ProtectedAuth allowedRoles={["Admin"]}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="min-h-screen p-6 bg-gray-100">
          <h1 className="text-3xl font-bold text-green-700 mb-6">
            Welcome to Admin Dashboard 🧪
          </h1>

          {loading || loadingDevelopers ? (
            <p>Loading data...</p>
          ) : bugs.length > 0 ? (
            <table className="w-full bg-white rounded-xl shadow-lg text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="p-4 rounded-tl-xl">Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Created By</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4 rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bugs.map((bug: Bug) => (
                  <tr
                    key={bug._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="p-4 font-medium text-gray-800">{bug.title}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          bug.status === "Open"
                            ? "bg-blue-100 text-blue-700"
                            : bug.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {bug.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          bug.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : bug.priority === "Medium"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {bug.priority}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{bug.createdBy?.name || "Unknown"}</td>
                    <td className="p-4 text-gray-600 relative">
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => toggleDropdown(bug._id)}
                      >
                        {getDeveloperName(bug.assignedTo)}
                      </span>
                      {showDropdown === bug._id && (
                        <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                          <div className="py-1">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleAssignChange(bug._id, "")}
                            >
                              Unassigned
                            </button>
                            {developers.map((dev: Developer) => (
                              <button
                                key={dev._id}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleAssignChange(bug._id, dev._id)}
                              >
                                {dev.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => console.log("Edit bug:", bug._id)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
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
