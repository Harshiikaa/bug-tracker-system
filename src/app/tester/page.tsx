'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedAuth from '@/components/ProtectedAuth';
import { useAuth } from '@/hooks/useAuth';
import { useBugs } from '@/hooks/useBugs';

export default function TesterDashboard() {
  const { user, token } = useAuth();
  const {
    userBugsQuery,
    create,
    update,
    dashboardBugsQuery,
  } = useBugs();
  const router = useRouter();
  const params = useParams();

  const bugId = params.id as string;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [bug, setBug] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError(null);
    try {
      await create.mutateAsync({ ...formData });
      setMessage('Bug created successfully!');
      setFormData({ title: '', description: '', priority: 'Medium' });
    } catch (err: any) {
      setError(err.message || 'Bug creation failed');
    }
  };

  useEffect(() => {
    if (bugId && userBugsQuery.data) {
      const found = userBugsQuery.data.find((b) => b._id === bugId);
      setBug(found || null);
    }
  }, [bugId, userBugsQuery.data]);

  const renderBugTable = (bugsToRender: any[]) => (
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
        {bugsToRender.map((b) => (
          <tr
            key={b._id}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            onClick={() => router.push(`/tester-dashboard/${b._id}`)}
          >
            <td className="p-4 font-medium text-gray-800">{b.title}</td>
            <td className="p-4 text-gray-600">{b.description}</td>
            <td className="p-4">
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                b.status === 'Open'
                  ? 'bg-blue-100 text-blue-700'
                  : b.status === 'In Progress'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {b.status || 'N/A'}
              </span>
            </td>
            <td className="p-4">
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                b.priority === 'High'
                  ? 'bg-red-100 text-red-700'
                  : b.priority === 'Medium'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {b.priority || 'N/A'}
              </span>
            </td>
            <td className="p-4 text-gray-600">{user?.name || 'Unknown'}</td>
            <td className="p-4 text-gray-600">{b.assignedTo?.name || 'Unassigned'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <ProtectedAuth allowedRoles={['Tester']}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Welcome to Tester Dashboard 🧪</h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-lg shadow"
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Bug
          </button>
          {message && <p className="text-green-600 text-center">{message}</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}
        </form>

        <h2 className="text-2xl font-semibold text-green-700 mt-12 mb-6">Bug Details</h2>
        {bugId && (
          <button
            onClick={() => router.push('/tester-dashboard')}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to All Bugs
          </button>
        )}

        {userBugsQuery.isLoading && <p>Loading...</p>}
        {userBugsQuery.error && <p>Error loading bugs.</p>}

        {!bugId && userBugsQuery.data && renderBugTable(userBugsQuery.data)}
        {bugId && bug && renderBugTable([bug])}
      </div>
    </ProtectedAuth>
  );
}



// 'use client';

// import { useCallback, useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import ProtectedAuth from '@/components/ProtectedAuth';
// import { useAuth } from '@/hooks/useAuth';
// import { useBugs } from '@/hooks/useBugs';
// import { Bug } from '@/types/Bug';

// export default function TesterDashboard() {
//   const { token, user } = useAuth(); // Added user from useAuth
//   const { getBugs, getBugById, createBug, bugs, loading } = useBugs(token);
//   const params = useParams();
//   const router = useRouter();

//   const bugId = params.id as string;
//   const [bug, setBug] = useState<Bug | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     priority: 'Medium',
//   });
//   const [message, setMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const fetchBug = useCallback(
//     async (id: string) => {
//       setError(null);
//       try {
//         const response = await getBugById(id);
//         console.log('🐞 Get bug by ID response:', JSON.stringify(response, null, 2));
//         if (response.success && response.data) {
//           setBug(response.data);
//         } else {
//           setBug(null);
//           setError(response.message || 'Bug not found.');
//         }
//       } catch (err) {
//         console.error('Get bug by ID error:', err);
//         setBug(null);
//         setError(err instanceof Error ? err.message : 'Failed to fetch bug.');
//       }
//     },
//     [getBugById]
//   );

//   const fetchBugs = useCallback(async () => {
//     setError(null);
//     try {
//       await getBugs();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to fetch bugs.');
//     }
//   }, [getBugs]);

//   useEffect(() => {
//     if (token) {
//       if (bugId) {
//         fetchBug(bugId);
//       } else {
//         fetchBugs();
//       }
//     } else {
//       setError('Not authenticated.');
//     }
//   }, [token, bugId, fetchBug, fetchBugs]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage('');
//     setError(null);
//     setIsSubmitting(true);

//     try {
//       const response = await createBug({
//         title: formData.title,
//         description: formData.description,
//         priority: formData.priority,
//       });

//       if (response.success) {
//         setMessage('Bug created successfully!');
//         setFormData({
//           title: '',
//           description: '',
//           priority: 'Medium',
//         });
//         if (!bugId) {
//           await fetchBugs();
//         }
//       } else {
//         setError(response.message || 'Bug creation failed.');
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Bug creation failed.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderBugTable = (bugsToRender: Bug[]) => (
//     <table className="w-full max-w-4xl bg-white rounded-xl shadow-lg text-left border border-gray-100">
//       <thead className="bg-gray-100 text-gray-700 font-semibold">
//         <tr>
//           <th className="p-4 rounded-tl-xl">Title</th>
//           <th className="p-4">Description</th>
//           <th className="p-4">Status</th>
//           <th className="p-4">Priority</th>
//           <th className="p-4">Created By</th>
//           <th className="p-4 rounded-tr-xl">Assigned To</th>
//         </tr>
//       </thead>
//       <tbody>
//         {bugsToRender.map((b) => (
//           <tr
//             key={b._id}
//             className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
//             onClick={() => router.push(`/tester-dashboard/${b._id}`)}
//           >
//             <td className="p-4 font-medium text-gray-800">{b.title}</td>
//             <td className="p-4 text-gray-600">{b.description}</td>
//             <td className="p-4">
//               <span
//                 className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
//                   b.status === 'Open'
//                     ? 'bg-blue-100 text-blue-700'
//                     : b.status === 'In Progress'
//                     ? 'bg-yellow-100 text-yellow-700'
//                     : 'bg-green-100 text-green-700'
//                 }`}
//               >
//                 {b.status || 'N/A'}
//               </span>
//             </td>
//             <td className="p-4">
//               <span
//                 className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
//                   b.priority === 'High'
//                     ? 'bg-red-100 text-red-700'
//                     : b.priority === 'Medium'
//                     ? 'bg-orange-100 text-orange-700'
//                     : 'bg-gray-100 text-gray-700'
//                 }`}
//               >
//                 {b.priority || 'N/A'}
//               </span>
//             </td>
//             <td className="p-4 text-gray-600">{user?.name || 'Unknown'}</td> {/* Use user.name */}
//             <td className="p-4 text-gray-600">{b.assignedTo?.name || 'Unassigned'}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );

//   return (
//     <ProtectedAuth allowedRoles={['Tester']}>
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
//         <h1 className="text-3xl font-bold text-green-700 mb-4">
//           Welcome to Tester Dashboard 🧪
//         </h1>
//         <h2 className="text-2xl font-semibold text-green-700 mb-6">
//           Create New Bug 🐞
//         </h2>
//         <form
//           onSubmit={handleSubmit}
//           className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-lg shadow"
//         >
//           <div>
//             <label htmlFor="title" className="block font-medium">
//               Title
//             </label>
//             <input
//               type="text"
//               name="title"
//               id="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//               maxLength={100}
//               className="w-full p-2 border rounded mt-1"
//             />
//           </div>
//           <div>
//             <label htmlFor="description" className="block font-medium">
//               Description
//             </label>
//             <textarea
//               name="description"
//               id="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               maxLength={1000}
//               className="w-full p-2 border rounded mt-1"
//             />
//           </div>
//           <div>
//             <label htmlFor="priority" className="block font-medium">
//               Priority
//             </label>
//             <select
//               name="priority"
//               id="priority"
//               value={formData.priority}
//               onChange={handleChange}
//               className="w-full p-2 border rounded mt-1"
//             >
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//             </select>
//           </div>
//           <div>
//             <label className="block font-medium">Status</label>
//             <input
//               type="text"
//               value="Open"
//               readOnly
//               disabled
//               className="w-full p-2 border bg-gray-200 rounded mt-1 text-gray-600"
//             />
//           </div>
//           <div>
//             <label className="block font-medium">Assigned To</label>
//             <input
//               type="text"
//               value="None"
//               readOnly
//               disabled
//               className="w-full p-2 border bg-gray-200 rounded mt-1 text-gray-600"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 ${
//               isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             {isSubmitting ? 'Creating Bug...' : 'Create Bug'}
//           </button>
//           {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
//           {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
//         </form>

//         <h2 className="text-2xl font-semibold text-green-700 mt-12 mb-6">
//           Bug Details
//         </h2>
//         {bugId && (
//           <button
//             onClick={() => router.push('/tester-dashboard')}
//             className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//           >
//             Back to All Bugs
//           </button>
//         )}
//         {loading && <div className="text-gray-600">Loading bugs...</div>}
//         {error && <div className="text-red-600 mb-4">{error}</div>}
//         {!loading && !bugId && bugs.length === 0 && !error && (
//           <div className="text-gray-600">No bugs found.</div>
//         )}
//         {!loading && bugId && bug && renderBugTable([bug])}
//         {!loading && !bugId && bugs.length > 0 && renderBugTable(bugs)}
//       </div>
//     </ProtectedAuth>
//   );
// }