'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProtectedAuth from '@/components/ProtectedAuth';
import { useAuth } from '@/hooks/useAuth';
import { useBugs } from '@/hooks/useBugs';
import { Bug } from '@/types/Bug';

export default function TesterDashboard() {
  const { token } = useAuth();
  const { createBug, getBugById } = useBugs(token);
 const params = useParams();

  useEffect(() => {
    console.log('Params:', params);
  }, [params]);
  const bugId = params.id as string;
  const [bug, setBug] = useState<Bug | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBug = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getBugById(id);
        console.log('🐞 Get bug by ID response:', response);
        if (response.success && response.data) {
          setBug(response.data);
        } else {
          setBug(null);
          setError(response.message || 'Bug not found.');
        }
      } catch (err) {
        console.error('Get bug by ID error:', err);
        setBug(null);
        setError(err instanceof Error ? err.message : 'Failed to fetch bug.');
      } finally {
        setLoading(false);
      }
    },
    [getBugById]
  );

  useEffect(() => {
    if (bugId) {
      fetchBug(bugId);
    } else {
      setError('No bug ID provided.');
      setLoading(false);
    }
  }, [bugId, fetchBug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage('');
  setError(null);
  setIsSubmitting(true);

  try {
    const response = await createBug({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
    });

    if (response.success) {
      setMessage('Bug created successfully!');
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
      });
      // If the created bug's ID is returned, fetch it
      if (response.data?._id) {
        fetchBug(response.data._id);
      }
    } else {
      setError(response.message || 'Bug creation failed');
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Bug creation failed');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <ProtectedAuth allowedRoles={['Tester']}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Welcome to Tester Dashboard 🧪
        </h1>
        <h2 className="text-2xl font-semibold text-green-700 mb-6">
          Create New Bug 🐞
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-lg shadow"
        >
          <div>
            <label htmlFor="title" className="block font-medium">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div>
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={1000}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div>
            <label htmlFor="priority" className="block font-medium">
              Priority
            </label>
            <select
              name="priority"
              id="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Status</label>
            <input
              type="text"
              value="Open"
              readOnly
              disabled
              className="w-full p-2 border bg-gray-200 rounded mt-1 text-gray-600"
            />
          </div>
          <div>
            <label className="block font-medium">Assigned To</label>
            <input
              type="text"
              value="None"
              readOnly
              disabled
              className="w-full p-2 border bg-gray-200 rounded mt-1 text-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating Bug...' : 'Create Bug'}
          </button>
          {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
          {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        </form>

        <h2 className="text-2xl font-semibold text-green-700 mt-12 mb-6">
          Bug Details
        </h2>
        {loading && <div className="text-gray-600">Loading bug...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {!loading && !bug && !error && (
          <div className="text-gray-600">No bug data available.</div>
        )}
        {!loading && bug && (
          <table className="w-full max-w-4xl bg-white rounded-xl shadow-lg text-left border border-gray-100">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-4 rounded-tl-xl">Title</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Created By</th>
                <th className="p-4 rounded-tr-xl">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                <td className="p-4 font-medium text-gray-800">{bug.title}</td>
                <td className="p-4 text-gray-600">{bug.description}</td>
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
            </tbody>
          </table>
        )}
      </div>
    </ProtectedAuth>
  );
}