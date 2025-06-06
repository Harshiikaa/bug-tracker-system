"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedAuth from "@/components/ProtectedAuth";
import { useAuth } from "@/hooks/useAuth";
import { useBugs } from "@/hooks/useBugs";
import { Bug } from "@/types/Bug";
import Badge from "@/components/Badge";
import Select from "@/components/Select";

export default function DeveloperDashboard() {
  const { user } = useAuth();
  const { token, getBugsQuery, update } = useBugs();
  const router = useRouter();
  const params = useParams();

  const bugId = params.id as string;
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);

  const bugs = getBugsQuery.data || [];
  const loading = getBugsQuery.isLoading;

  useEffect(() => {
    if (bugId && bugs.length > 0) {
      const found = bugs.find((b) => b._id === bugId);
      if (found) setSelectedBug(found);
      else {
        setError("Bug not found.");
        setSelectedBug(null);
      }
    } else {
      setSelectedBug(null);
      setError(null);
    }
  }, [bugId, bugs]);

  const handleStatusChange = async (
    bugId: string,
    newStatus: Bug["status"]
  ) => {
    try {
      await update.mutateAsync({ id: bugId, updates: { status: newStatus } });
      setStatusDropdown(null);
    } catch (err: any) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const renderBugTable = (bugsToRender: Bug[]) => (
    <table className="w-full max-w-4xl bg-white rounded-xl shadow-lg text-left border border-gray-100">
      <thead className="bg-gray-100 text-gray-700 font-semibold">
        <tr>
          <th className="p-4 rounded-tl-xl">Title</th>
          <th className="p-4">Description</th>
          <th className="p-4">Status</th>
          <th className="p-4">Priority</th>
          <th className="p-4">Created By</th>
        </tr>
      </thead>
      <tbody>
        {bugsToRender.map((b) => (
          <tr
            key={b._id}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
          >
            <td
              className="p-4 font-medium text-gray-800 cursor-pointer"
              onClick={() => router.push(`/developer-dashboard/${b._id}`)}
            >
              {b.title}
            </td>
            <td className="p-4 text-gray-600">{b.description}</td>
            <td className="p-4 relative">
              {/* <td className="p-4"> */}
                <Select
                  name="status"
                  value={b.status}
                  onChange={(val) => handleStatusChange(b._id, val)}
                />
              {/* </td> */}

              {/* <span
                onClick={() =>
                  setStatusDropdown((prev) => (prev === b._id ? null : b._id))
                }
                className="cursor-pointer w-fit"
              >
                <Badge value={b.status} type="status" />
              </span>
              {statusDropdown === b._id && (
                <div className="absolute z-10 mt-2 bg-white border rounded shadow-md">
                  {["Open", "In Progress", "Closed"].map((status) => (
                    <button
                      key={status}
                      className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                      onClick={() =>
                        handleStatusChange(b._id, status as Bug["status"])
                      }
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )} */}
            </td>
            <td className="p-4">
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  {
                    High: "bg-red-100 text-red-700",
                    Medium: "bg-orange-100 text-orange-700",
                    Low: "bg-gray-100 text-gray-700",
                  }[b.priority]
                }`}
              >
                {b.priority}
              </span>
            </td>
            <td className="p-4 text-gray-600">
              {b.createdBy?.name || "Unknown"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <ProtectedAuth allowedRoles={["User"]}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Welcome to Developer Dashboard 💪
        </h1>
        <h2 className="text-2xl font-semibold text-green-700 mt-12 mb-6">
          Assigned Bugs 🐞
        </h2>

        {bugId && (
          <button
            onClick={() => router.push("/developer-dashboard")}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to All Bugs
          </button>
        )}

        {loading && <div className="text-gray-600">Loading bugs...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        {!loading && !bugId && bugs.length === 0 && !error && (
          <div className="text-gray-600">No bugs assigned.</div>
        )}

        {!loading && bugId && selectedBug && renderBugTable([selectedBug])}
        {!loading && !bugId && bugs.length > 0 && renderBugTable(bugs)}
      </div>
    </ProtectedAuth>
  );
}
