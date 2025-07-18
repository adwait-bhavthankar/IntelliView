"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import ManualQuestionForm from "../../components/ManualQuestionForm";
import AIQuestionForm from "../../components/AIQuestionForm";



export default function CreateInterview() {
  const router = useRouter();

  const [interviewTitle, setInterviewTitle] = useState("");
  const [mode, setMode] = useState<"manual" | "ai">("manual");

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Interview</h1>

      {/* Interview Title */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-1">Interview Title</label>
        <input
          type="text"
          className="w-full p-3 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-800"
          placeholder="e.g. Frontend Developer Interview"
          value={interviewTitle}
          onChange={(e) => setInterviewTitle(e.target.value)}
          required
        />
      </div>

      {/* Mode Selector */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Choose Mode</label>
        <div className="flex gap-4">
          <button
            onClick={() => setMode("manual")}
            className={`px-4 py-2 rounded-lg ${
              mode === "manual"
                ? "bg-indigo-600 text-white"
                : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            Provide My Own Questions
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`px-4 py-2 rounded-lg ${
              mode === "ai"
                ? "bg-indigo-600 text-white"
                : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            Generate with AI
          </button>
        </div>
      </div>

      {/* Conditional Input Form */}
      {mode === "manual" ? (
        <ManualQuestionForm interviewTitle={interviewTitle} />
      ) : (
        <AIQuestionForm interviewTitle={interviewTitle} />
      )}
    </div>
  );
}
