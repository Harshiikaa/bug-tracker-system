'use client';

import { useAuth } from "@/hooks/useAuth";
import { useBugs } from "@/hooks/useBugs";
import Link from "next/link";

export default function Home() {
  const { token } = useAuth();
  // const { bugs } = useBugs(token);
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Bug Tracker 🐞</h1>
      <p className="mb-6">Track and manage bugs like a pro!</p>
      <div className="flex gap-4">
        <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded">
          Register
        </Link>
        <Link href="/login" className="bg-gray-800 text-white px-4 py-2 rounded">
          Login
        </Link>
        {/* <ul className="space-y-2">
          {bugs.map((bug: any) => (
            <li key={bug._id} className="p-4 bg-white rounded-lg shadow">
              {bug.title}: {bug.status}
            </li>
          ))}
        </ul> */}
      </div>
    </main>
  );
}
