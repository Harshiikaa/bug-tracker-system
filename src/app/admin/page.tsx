
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
  assignedTo: string | null;
}
interface Developer {
  _id: string;
  name: string;
  email: string;
}

export default function AdminDashboard() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const { getAllBugs } = useBugs(token);
  const { getDevelopers } = useUsers(token);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDevelopers, setLoadingDevelopers] = useState(false);

  // Fetch bugs
  useEffect(() => {
    const fetchBugs = async () => {
      setLoading(true);
      try {
        const response = await getAllBugs("page=1&limit=10");
        console.log("🐞 Bugs response:", response);
        setBugs(response?.bugs || []);
      } catch (error) {
        console.error("❌ Error fetching bugs:", error);
        setBugs([]);
      } finally {
        setLoading(false);
      }
    };

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
        console.log("👨‍💻 Developers data:", developersData);
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
  const getDeveloperName = (assigned: string | null) => {
    if (!assigned) return "Unassigned";
    const developer = developers.find((dev: Developer) => dev._id === assigned);
    return developer ? developer.name : "Unassigned";
  };

  // Function to get list of developer names
  const getDeveloperNames = (developers: Developer[]) => {
    const names = developers.map((dev) => dev.name);
    console.log("This is list of developers:", names);
    return names;
  };

  // Call getDeveloperNames when developers changes
  useEffect(() => {
    if (developers.length > 0) {
      getDeveloperNames(developers);
    }
  }, [developers]);

  // Handle assignment change
  const handleAssignChange = (bugId: string, newAssignedTo: string) => {
    setBugs((prevBugs) =>
      prevBugs.map((bug) =>
        bug._id === bugId ? { ...bug, assignedTo: newAssignedTo || null } : bug
      )
    );
    console.log(`Assigned bug ${bugId} to ${newAssignedTo || "Unassigned"}`);
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
            <table className="w-full bg-white rounded-xl shadow-lg text-left border border-gray-100">
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
                {bugs.map((bug: Bug) => {
                  console.log("Bug assignedTo:", bug.assignedTo);
                  return (
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
                      <td className="p-4 text-gray-600">
                        <select
                          value={bug.assignedTo || ""}
                          onChange={(e) => handleAssignChange(bug._id, e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Unassigned</option>
                          {developers.map((dev: Developer) => (
                            <option key={dev._id} value={dev._id}>
                              {dev.name}
                            </option>
                          ))}
                        </select>
                        {/* <span className="ml-2">
                          {getDeveloperName(bug.assignedTo)}
                        </span> */}
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
                  );
                })}
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
