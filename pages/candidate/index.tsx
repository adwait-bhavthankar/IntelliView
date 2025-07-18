"use client";

import { useState } from "react";
import { useRouter } from "next/router";

export default function CandidateEntry() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    router.push(`/candidate/interview/${code}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <form
        onSubmit={handleJoin}
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600 dark:text-indigo-300">
          Join Your Interview
        </h1>

        <input
          type="text"
          placeholder="Enter Interview Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 dark:bg-slate-700 dark:text-white"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-500"
        >
          Join Interview
        </button>
      </form>
    </div>
  );
}
