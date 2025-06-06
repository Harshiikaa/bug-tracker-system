"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedAuth from "@/components/ProtectedAuth";
import { useAuth } from "@/hooks/useAuth";
import { useBugs } from "@/hooks/useBugs";
import { Bug } from "@/types/Bug";
import Title from "@/components/Title";
import TextArea from "@/components/TextArea";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Badge from "@/components/Badge";

// Strict types for create and update payloads
type BugCreatePayload = Pick<Bug, "title" | "description" | "priority"> & {
  assignedTo?: string;
};

type BugUpdatePayload = Partial<
  Pick<Bug, "title" | "description" | "status" | "priority" | "assignedTo">
>;

export default function TesterDashboard() {
  const { user } = useAuth();
  const { getBugsQuery, create, update } = useBugs();
  const router = useRouter();
  const params = useParams();

  const bugId = params.id as string;

  const [formData, setFormData] = useState<BugCreatePayload>({
    title: "",
    description: "",
    priority: "Medium",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [bug, setBug] = useState<Bug | null>(null);
  const [editingBugId, setEditingBugId] = useState<string | null>(null);

  useEffect(() => {
    if (bugId && getBugsQuery.data) {
      const found = getBugsQuery.data.find((bug) => bug._id === bugId);
      setBug(found || null);
    }
  }, [bugId, getBugsQuery.data]);

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

    try {
      if (editingBugId) {
        const updatePayload: BugUpdatePayload = { ...formData };
        await update.mutateAsync({ id: editingBugId, updates: updatePayload });
        setMessage("Bug updated successfully!");
        setEditingBugId(null);
      } else {
        await create.mutateAsync({ ...formData });
        setMessage("Bug created successfully!");
      }
      setFormData({ title: "", description: "", priority: "Medium" });
    } catch (err: any) {
      setError(err.message || "Action failed");
    }
  };

  const handleEdit = (bug: Bug) => {
    setFormData({
      title: bug.title,
      description: bug.description,
      priority: bug.priority || "Medium",
    });
    setEditingBugId(bug._id);
  };

  const renderBugTable = (bugs: Bug[]) => (
    <table className="w-full max-w-4xl bg-white rounded-xl shadow-lg text-left border border-gray-100">
      <thead className="bg-gray-100 text-gray-700 font-semibold">
        <tr>
          <th className="p-4 rounded-tl-xl">Title</th>
          <th className="p-4">Description</th>
          <th className="p-4">Status</th>
          <th className="p-4">Priority</th>
          {/* <th className="p-4">Created By</th> */}
          <th className="p-4">Assigned To</th>
          <th className="p-4 rounded-tr-xl">Edit</th>
        </tr>
      </thead>
      <tbody>
        {bugs.map((bug) => (
          <tr
            key={bug._id}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            onClick={() => router.push(`/tester-dashboard/${bug._id}`)}
          >
            <td className="p-4 font-medium text-gray-800">{bug.title}</td>
            <td className="p-4 text-gray-600">{bug.description}</td>
            <td className="p-4">
              <Badge value={bug.status || "N/A"} type="status" />
              {/* <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  bug.status === 'Open'
                    ? 'bg-blue-100 text-blue-700'
                    : bug.status === 'In Progress'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {bug.status || 'N/A'}
              </span> */}
            </td>
            <td className="p-4">
              <Badge value={bug.priority || "N/A"} type="priority" />
              {/* <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  bug.priority === 'High'
                    ? 'bg-red-100 text-red-700'
                    : bug.priority === 'Medium'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {bug.priority || 'N/A'}
              </span> */}
            </td>
            {/* <td className="p-4 text-gray-600">{bug.createdBy?.name || 'Unknown'}</td> */}
            <td className="p-4 text-gray-600">
              {typeof bug.assignedTo === "object" && bug.assignedTo !== null
                ? bug.assignedTo.name
                : "Unassigned"}
            </td>
            <td className="p-4">
              <Button
                label="Edit"
                color="green"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(bug);
                }}
              />

              {/* <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent row click
                  handleEdit(bug);
                }}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button> */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <ProtectedAuth allowedRoles={["Tester"]}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Welcome to Tester Dashboard 🧪
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-lg shadow"
        >
          <Title text="Title" />
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
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          /> */}
          <Title text="Description" />
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
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          /> */}
          <Title text="Priority" />
          <Select
            name="priority"
            value={formData.priority || "Medium"}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, priority: val }))
            }
          />

          {/* <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select> */}
          <Button
            type="submit"
            color="blue"
            label={editingBugId ? "Update Bug" : "Create Bug"}
            isSubmitting={create.isPending || update.isPending}
          />
          {/* <button
            type="submit"
            disabled={create.isPending || update.isPending}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {editingBugId ? 'Update Bug' : 'Create Bug'}
          </button> */}
          {message && <p className="text-green-600 text-center">{message}</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}
        </form>

        <h2 className="text-2xl font-semibold text-green-700 mt-12 mb-6">
          Bug Details
        </h2>
        {/* 
        {bugId && (
          <button
            onClick={() => router.push('/tester-dashboard')}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to All Bugs
          </button>
        )} */}

        {getBugsQuery.isLoading && <p>Loading...</p>}
        {getBugsQuery.error && <p>Error loading bugs.</p>}

        {!bugId && getBugsQuery.data && renderBugTable(getBugsQuery.data)}
        {bugId && bug && renderBugTable([bug])}
      </div>
    </ProtectedAuth>
  );
}
