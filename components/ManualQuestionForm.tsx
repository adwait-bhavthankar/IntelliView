"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";
 // or use Firebase auth directly
import { saveInterview } from "../lib/saveInterview";


interface ManualQuestionFormProps {
  interviewTitle: string;
}

export default function ManualQuestionForm({ interviewTitle }: ManualQuestionFormProps) {
  const [questions, setQuestions] = useState<string[]>([""]);
  const [message, setMessage] = useState("");

  const handleAddQuestion = () => {
    if (questions.length < 10) {
      setQuestions([...questions, ""]);
    }
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleChange = (value: string, index: number) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
  const user = auth.currentUser;
  
  console.log("User:", user); // 🔍 Step 1
  console.log("Title:", interviewTitle);
  console.log("Questions:", questions);
  
  if (!interviewTitle || questions.length === 0 || !user) {
    setMessage("Missing title, questions, or user not logged in.");
    return;
  }

    
if (!user) {
  setMessage("You must be logged in to save the interview.");
  return;
}
    

  if (!interviewTitle || questions.some((q) => !q.trim()) || !user) {
    setMessage("Fill all fields & make sure you're logged in.");
    return;
  }

  try {
    const code = await saveInterview({
      title: interviewTitle,
      questions,
      createdBy: user.uid,
      mode: "manual",
    });

    setMessage(`Interview saved! Code: ${code}`);
  } catch (err) {
    console.error("Error saving:", err);
    setMessage("Failed to save interview.");
  }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      {questions.map((q, i) => (
        <div key={i} className="flex items-start gap-2">
          <textarea
            className="w-full p-3 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-800 resize-none"
            rows={2}
            placeholder={`Question ${i + 1}`}
            value={q}
            onChange={(e) => handleChange(e.target.value, i)}
            required
          />
          {questions.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveQuestion(i)}
              className="text-red-500 hover:text-red-700 font-bold"
              title="Remove"
            >
              ✖
            </button>
          )}
        </div>
      ))}

      {questions.length < 10 && (
        <button
          type="button"
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg"
        >
          + Add Question
        </button>
      )}

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-semibold"
      >
        Save Interview
      </button>

      {message && <p className="text-sm mt-2 text-teal-600 dark:text-teal-400">{message}</p>}
    </form>
  );
}
