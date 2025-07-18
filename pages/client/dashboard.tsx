"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { logout } from "../../lib/firebaseAuth";
import { deleteInterview } from "../../lib/firebaseUtils";
import Link from "next/link";

interface Interview {
  id: string;
  title: string;
  mode: "manual" | "ai";
  interviewCode: string;
  createdAt?: {
    toDate: () => Date;
  };
}

export default function ClientDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Track user auth state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.push("/client/login"); // redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ✅ Fetch interviews only when user is available
  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user) return;

      const q = query(
        collection(db, "interviews"),
        where("createdBy", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const data: Interview[] = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          title: docData.title,
          mode: docData.mode,
          interviewCode: docData.interviewCode,
          createdAt: docData.createdAt,
        };
      });

      setInterviews(data);
      setLoading(false);
    };

    fetchInterviews();
  }, [user]);

  if (!user) return null; // 🔒 Don’t render anything until auth is confirmed

  return (
    <div className="min-h-screen p-6 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
        <button
          onClick={async () => {
            await logout();
            router.push("/client/login");
          }}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      
<div className="flex justify-end mb-4">
  <Link
    href="/client/create"
    className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition"
  >
    ➕ Schedule an Interview
  </Link>
</div>

      {loading ? (
        <p>Loading interviews...</p>
      ) : interviews.length === 0 ? (
        <p>No interviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-slate-400">
            <thead className="bg-slate-300 dark:bg-slate-700">
              <tr>
                <th className="border p-3">Title</th>
                <th className="border p-3">Mode</th>
                <th className="border p-3">Code</th>
                <th className="border p-3">Created At</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
  {interviews.map((interview) => (
    <tr key={interview.id} className="hover:bg-slate-200 dark:hover:bg-slate-800">
      <td className="border p-3">{interview.title}</td>
      <td className="border p-3 capitalize">{interview.mode}</td>
      <td className="border p-3 font-mono">{interview.interviewCode}</td>
      <td className="border p-3 text-sm">
        {interview.createdAt?.toDate
          ? interview.createdAt.toDate().toLocaleString()
          : "N/A"}
      </td>
      <td className="border p-3">
        <button
          onClick={async () => {
            const confirmDelete = confirm("Are you sure you want to delete this interview?");
            if (!confirmDelete) return;

            await deleteInterview(interview.id);
            setInterviews((prev) => prev.filter((i) => i.id !== interview.id));
          }}
          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
