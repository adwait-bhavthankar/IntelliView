"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";

export default function ThankYouPage() {
  const router = useRouter();
  const [downloaded, setDownloaded] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Interview Submission Summary", 20, 20);

    doc.setFontSize(12);
    doc.text("Thank you for submitting your interview.", 20, 40);
    doc.text("We'll review your responses and get back to you shortly.", 20, 50);

    doc.text("Interview Summary", 20, 70);
    doc.text("- Date: " + new Date().toLocaleString(), 20, 80);
    doc.text("- Interview Code: " + (router.query.code || "N/A"), 20, 90);
    doc.text("- Total Questions: " + (router.query.qs || "N/A"), 20, 100);

    doc.save("interview-summary.pdf");
    setDownloaded(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-black dark:text-white flex flex-col justify-center items-center p-8">
      <h1 className="text-3xl font-bold mb-4">✅ Interview Submitted</h1>
      <p className="text-lg mb-6 text-center max-w-lg">
        Thank you for completing the interview. We’ve received your responses.
      </p>

      <button
        onClick={generatePDF}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mb-4"
      >
        📄 Download PDF Summary
      </button>

      {downloaded && <p className="text-green-600">📥 PDF downloaded successfully.</p>}

      <button
        onClick={() => router.push("/")}
        className="mt-6 text-sm text-blue-500 underline"
      >
        ← Back to Home
      </button>
    </div>
  );
}
