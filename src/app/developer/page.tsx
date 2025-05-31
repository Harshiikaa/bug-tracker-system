'use client';

import ProtectedAuth from "@/components/ProtectedAuth";

export default function DeveloperDashboard() {
  return (
  <ProtectedAuth allowedRoles={["User"]}>
         <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-green-700">Welcome to Developer Dashboard 🧪</h1>
    </div>
        </ProtectedAuth>

  );
}




// 'use client';

// import { useState } from 'react';
// import { useBugs } from '@/hooks/useBugs';
// import { useAuth } from '@/hooks/useAuth';

// export default function DeveloperDashboard() {
//   const { token } = useAuth();
//   const { createBug } = useBugs(token);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     priority: 'Medium',
//     // status and assignedTo are fixed internally
//   });

//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');
//     setIsSubmitting(true);

//     try {
//       const response = await createBug({
//         ...formData,
//         status: 'Open',       // force status
//         assignedTo: ''        // or null if backend prefers
//       });

//       if (response.success) {
//         setMessage('Bug created successfully!');
//         setFormData({
//           title: '',
//           description: '',
//           priority: 'Medium'
//         });
//       } else {
//         setError(response.message || 'Bug creation failed');
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Bug creation failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8 text-black">
//       <h2 className="text-3xl font-bold text-center mb-6 text-amber-600">Create New Bug 🐞</h2>
//       <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-lg shadow">
//         <div>
//           <label htmlFor="title" className="block font-medium">Title</label>
//           <input
//             type="text"
//             name="title"
//             id="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//             maxLength={100}
//             className="w-full p-2 border rounded mt-1"
//           />
//         </div>
//         <div>
//           <label htmlFor="description" className="block font-medium">Description</label>
//           <textarea
//             name="description"
//             id="description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//             maxLength={1000}
//             className="w-full p-2 border rounded mt-1"
//           />
//         </div>
//         <div>
//           <label htmlFor="priority" className="block font-medium">Priority</label>
//           <select
//             name="priority"
//             id="priority"
//             value={formData.priority}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mt-1"
//           >
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//           </select>
//         </div>
//         {/* Status (Fixed - Display only) */}
//         <div>
//           <label className="block font-medium">Status</label>
//           <input
//             type="text"
//             value="Open"
//             readOnly
//             disabled
//             className="w-full p-2 border bg-gray-200 rounded mt-1 text-gray-600"
//           />
//         </div>
//         {/* AssignedTo (Fixed - Display only) */}
//         <div>
//           <label className="block font-medium">Assigned To</label>
//           <input
//             type="text"
//             value="None"
//             readOnly
//             disabled
//             className="w-full p-2 border bg-gray-200 rounded mt-1 text-gray-600"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//         >
//           {isSubmitting ? 'Creating Bug...' : 'Create Bug'}
//         </button>
//         {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
//         {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
//       </form>
//     </div>
//   );
// }


