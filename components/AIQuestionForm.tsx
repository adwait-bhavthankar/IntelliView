"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";
import { saveInterview } from "../lib/saveInterview";

interface AIQuestionFormProps {
  interviewTitle: string;
}

export default function AIQuestionForm({ interviewTitle }: AIQuestionFormProps) {
  const [jobDesc, setJobDesc] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const generateQuestions = async () => {
    if (!jobDesc.trim()) return;

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  jobTitle: interviewTitle,
  jobDescription: jobDesc,
}),
      });

      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Error generating questions:", err);
      setMessage("Failed to generate questions.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!interviewTitle || questions.length === 0 || !user) {
      setMessage("Missing title, questions, or user not logged in.");
      return;
    }

    try {
      const code = await saveInterview({
        title: interviewTitle,
        questions,
        createdBy: user.uid,
        mode: "ai",
      });

      setMessage(`Interview saved successfully! Code: ${code}`);
    } catch (err) {
      console.error("Error saving interview:", err);
      setMessage("Failed to save interview.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      {/* Job Description Input */}
      <div>
        <label className="font-medium mb-1 block">Job Description</label>
        <textarea
          className="w-full p-3 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-800 resize-none"
          rows={4}
          placeholder="Paste the job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          required
        />
      </div>

      {/* Number of Questions */}
      <div>
        <label className="font-medium mb-1 block">Number of Questions</label>
        <input
          type="number"
          min={3}
          max={10}
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          className="w-24 p-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-800"
        />
      </div>

      {/* Generate Button */}
      <button
        type="button"
        onClick={generateQuestions}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
      >
        {loading ? "Generating..." : "Generate Questions with AI"}
      </button>

      {/* Generated Questions (Editable) */}
      {questions.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mt-4">Generated Questions</h3>
          {questions.map((q, i) => (
            <textarea
              key={i}
              rows={2}
              className="w-full p-3 mt-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-800 resize-none"
              value={q}
              onChange={(e) => {
                const updated = [...questions];
                updated[i] = e.target.value;
                setQuestions(updated);
              }}
            />
          ))}

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-lg font-semibold mt-6"
          >
            Save Interview
          </button>
        </>
      )}

      {message && <p className="text-sm text-teal-600 dark:text-teal-400">{message}</p>}
    </form>
  );
}