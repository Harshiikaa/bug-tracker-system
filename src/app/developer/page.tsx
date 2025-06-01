'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProtectedAuth from '@/components/ProtectedAuth';
// Assuming useAuth provides token; adjust based on your auth setup
import { useAuth } from '@/hooks/useAuth'; // Adjust path if needed
import { Bug } from '@/types/Bug';



export default function DeveloperDashboard() {

  const [bug, setBug] = useState<Bug | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const bugId = params.id as string; // Assume URL like /dashboard/[id]
  const { token } = useAuth(); // Replace with your auth hook
  const API_URL = '/api/bugs'; // Adjust to your API endpoint
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const getBugById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/${id}`, { headers });
        const data = await res.json();
        console.log('🐞 Get bug by ID response:', data);
        if (data._id) {
          setBug(data);
        } else {
          setBug(null);
          setError('Bug not found.');
        }
        return data;
      } catch (err) {
        console.error('Get bug by ID error:', err);
        setBug(null);
        setError('Failed to fetch bug. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (bugId) {
      getBugById(bugId);
    } else {
      setError('No bug ID provided.');
      setLoading(false);
    }
  }, [bugId, getBugById]);

  return (
    <ProtectedAuth allowedRoles={['User']}>
      <div className="min Nil-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Welcome to Developer Dashboard 🧪
        </h1>
        <h2 className="text-2xl font-semibold text-green-700 mb-6">Bug Details</h2>

        {loading && (
          <div className="text-gray-600">Loading bug...</div>
        )}
        {error && (
          <div className="text-red-600 mb-4">{error}</div>
        )}
        {!loading && !bug && !error && (
          <div className="text-gray-600">No bug data available.</div>
        )}
        {!loading && bug && (
          <table className="w-full max-w-4xl bg-white rounded-xl shadow-lg text-left border border-gray-100">
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
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
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
            </tbody>
          </table>
        )}
      </div>
    </ProtectedAuth>
  );
}