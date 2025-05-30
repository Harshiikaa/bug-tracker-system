// // src/components/LoginForm.tsx
// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { useRouter } from 'next/navigation';

// const router = useRouter();

// interface LoginFormData {
//     email: string;
//     password: string;
// }

// const LoginForm = () => {
//     const [formData, setFormData] = useState<LoginFormData>({
//         email: '',
//         password: '',
//     });
//     const [message, setMessage] = useState<string>('');
//     const [error, setError] = useState<string>('');
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // New state
//     const { login } = useAuth();

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setMessage('');
//         setError('');
//         setIsSubmitting(true); // Disable button

//         try {
//             await login(formData.email, formData.password);
//             setMessage('Logged In Successfully');
//             setFormData({ email: '', password: '' });
//             router.push('/dashboard');
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Login failed');
//         } finally {
//             setIsSubmitting(false); // Re-enable button
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>

//                 </div>
//                 <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                         Email
//                     </label>
//                     <input
//                         type="email"
//                         id="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                         className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                         Password
//                     </label>
//                     <input
//                         type="password"
//                         id="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                         className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     disabled={isSubmitting} // Disable if submitting
//                     className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                     {isSubmitting ? 'Logging In...' : 'Login'}
//                 </button>
//             </form>
//             {/* {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
//             {error && <p className="mt-4 text-red-600 text-center">{error}</p>} */}
//         </div>
//     );
// };

// export default LoginForm;