"use client";

import ProtectedAuth from "@/components/ProtectedAuth";
import { useBugs } from "@/hooks/useBugs";
import { useUsers } from "@/hooks/useUsers";
import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bug } from "@/types/Bug";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Select from "@/components/Select";
import SelectDynamic from "@/components/SelectDynamic";

type BugUpdatePayload = Partial<
  Pick<Bug, "title" | "description" | "status" | "priority" | "assignedTo">
>;

interface Developer {
  _id: string;
  name: string;
  email: string;
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { getAllBugsQuery, update } = useBugs("", { role: "Admin" });
  const { getDevelopersQuery } = useUsers();
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const bugs: Bug[] = getAllBugsQuery.data?.bugs || [];
  const developers: Developer[] = getDevelopersQuery.data || [];

  const [formData, setFormData] = useState<BugUpdatePayload>({
    title: "",
    description: "",
    priority: "Medium",
    status: "Open",
    assignedTo: "",
  });

  const [editingBugId, setEditingBugId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (bug: Bug) => {
    const assignedDevId =
      typeof bug.assignedTo === "object" && bug.assignedTo !== null
        ? bug.assignedTo._id
        : typeof bug.assignedTo === "string"
        ? bug.assignedTo
        : "";

    setFormData({
      title: bug.title,
      description: bug.description,
      priority: bug.priority,
      status: bug.status,
      assignedTo: assignedDevId,
    });

    setEditingBugId(bug._id);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError(null);

    if (!editingBugId) return;

    try {
      await update.mutateAsync({
        id: editingBugId,
        updates: {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: formData.status,
          assignedTo: formData.assignedTo || undefined,
        },
      });

      await queryClient.invalidateQueries({ queryKey: ["/", ""] });

      setMessage("Bug updated successfully!");
      setEditingBugId(null);
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        status: "Open",
        assignedTo: "",
      });
    } catch (err: any) {
      setError(err.message || "Bug update failed");
    }
  };

  const getDeveloperName = (assigned: Bug["assignedTo"]) => {
    return typeof assigned === "object" && assigned !== null
      ? assigned.name
      : "Unassigned";
  };

  const handleAssignChange = async (bugId: string, newAssignedTo: string) => {
    try {
      await update.mutateAsync({
        id: bugId,
        updates: { assignedTo: newAssignedTo || undefined },
      });
      await queryClient.invalidateQueries({ queryKey: ["/", ""] });
    } catch (error) {
      console.error("❌ Failed to assign developer:", error);
      alert("Something went wrong while assigning.");
    }
    setShowDropdown(null);
  };

  const toggleDropdown = (bugId: string) => {
    setShowDropdown((prev) => (prev === bugId ? null : bugId));
  };

  
  return (
    <ProtectedAuth allowedRoles={["Admin"]}>
      <div className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Welcome to Admin Dashboard 🧪
        </h1>

        {/* Bug Edit Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-lg shadow mb-10"
        >
          {editingBugId && (
            <h2 className="text-xl font-bold text-gray-700">
              Editing Bug: {formData.title}
            </h2>
          )}
          <Input
  name="title"
  value={formData.title || ""}
  onChange={handleChange}
  placeholder="Enter Bug Title"
  required
/>
          {/* <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          /> */}

          <TextArea
  name="description"
  value={formData.description || ""}
  onChange={handleChange}
  placeholder="Description"
  required
/>
          {/* <textarea
            name="description"
            placeholder="Description"
            value={formData.description || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          /> */}
<Select
  name="priority"
  value={formData.priority || "Medium"}
  onChange={(val) =>
    setFormData((prev) => ({ ...prev, priority: val }))
  }
/>

          {/* <select
            name="priority"
            value={formData.priority || "Medium"}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select> */}
          <Select
  name="status"
  value={formData.status || "Open"}
  onChange={(val) =>
    setFormData((prev) => ({ ...prev, status: val }))
  }
/>

          {/* <select
            name="status"
            value={formData.status || "Open"}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select> */}
<SelectDynamic
  name="assignedTo"
  value={
    typeof formData.assignedTo === "object"
      ? formData.assignedTo._id
      : formData.assignedTo || ""
  }
  onChange={handleChange}
  options={developers.map((dev) => ({
    value: dev._id,
    label: dev.name,
  }))}
  includeEmptyOption
/>

          {/* <select
            name="assignedTo"
            value={
              typeof formData.assignedTo === "object"
                ? formData.assignedTo._id
                : formData.assignedTo || ""
            }
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Unassigned</option>
            {developers.map((dev) => (
              <option key={dev._id} value={dev._id}>
                {dev.name}
              </option>
            ))}
          </select> */}

          <div className="flex gap-4">
            <Button
              label={editingBugId ? "Update Bug" : "Update"}
              type="submit"
              color="blue"
            />
            {/* <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingBugId ? "Update Bug" : "Update"}
            </button> */}
            {editingBugId && (
              <button
                type="button"
                onClick={() => {
                  setEditingBugId(null);
                  setFormData({
                    title: "",
                    description: "",
                    priority: "Medium",
                    status: "Open",
                    assignedTo: "",
                  });
                }}
                className="flex-1 py-2 px-4 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
          {message && <p className="text-green-600 text-center">{message}</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}
        </form>

        {/* Bugs Table */}
        {getAllBugsQuery.isLoading || getDevelopersQuery.isLoading ? (
          <p>Loading...</p>
        ) : (
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
              {bugs.map((bug) => (
                <tr
                  key={bug._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-800">{bug.title}</td>
                  <td className="p-4">
                    <Badge value={bug.status} type="status" />

                    {/* <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        bug.status === "Open"
                          ? "bg-blue-100 text-blue-700"
                          : bug.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {bug.status}
                    </span> */}
                  </td>
                  <td className="p-4">
                    <Badge value={bug.priority} type="priority" />


                    {/* <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        bug.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : bug.priority === "Medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {bug.priority}
                    </span> */}
                  </td>
                  <td className="p-4 text-gray-600">
                    {bug.createdBy?.name || "Unknown"}
                  </td>
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
                          {developers.map((dev) => (
                            <button
                              key={dev._id}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                handleAssignChange(bug._id, dev._id)
                              }
                            >
                              {dev.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <Button
                      label="Edit"
                      onClick={() => handleEdit(bug)}
                      color="green"
                    />

                    {/* <button
                      onClick={() => handleEdit(bug)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ProtectedAuth>
  );
}
