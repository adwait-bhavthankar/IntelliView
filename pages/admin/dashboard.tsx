"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface Submission {
  interviewCode: string;
  submittedAt: {
    seconds: number;
    nanoseconds: number;
  };
  answers: string[];
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "submissions"));
        const data = snapshot.docs.map((doc) => doc.data() as Submission);
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📊 Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <table className="min-w-full text-sm table-auto">
            <thead>
              <tr className="bg-slate-200 dark:bg-slate-700 text-left">
                <th className="p-2">#</th>
                <th className="p-2">Interview Code</th>
                <th className="p-2">Submitted At</th>
                <th className="p-2">Total Answers</th>
                <th className="p-2">Answer Links</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, index) => (
                <tr key={index} className="border-t border-slate-300 dark:border-slate-600">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 font-mono">{sub.interviewCode}</td>
                  <td className="p-2">
                    {format(
                      new Date(sub.submittedAt.seconds * 1000),
                      "dd MMM yyyy, hh:mm a"
                    )}
                  </td>
                  <td className="p-2">{sub.answers.length}</td>
                  <td className="p-2 space-y-1">
                    {sub.answers.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline"
                      >
                        Answer {i + 1}
                      </a>
                    ))}
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
