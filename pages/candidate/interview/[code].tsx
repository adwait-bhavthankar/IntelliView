"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { uploadToCloudinary } from "../../../lib/uploadToCloudinary";

interface Interview {
  title: string;
  questions: string[];
  interviewCode: string;
}

export default function CandidateInterviewPage() {
  const router = useRouter();
  const { code } = router.query;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // 🎥 Access camera & mic
  useEffect(() => {
    const setupStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        console.error("Camera/Mic access denied:", err);
        setError("Please allow access to camera and microphone.");
      }
    };

    setupStream();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // 📥 Load interview data
  useEffect(() => {
    if (!code || typeof code !== "string") return;

    const fetchInterview = async () => {
      try {
        const q = query(
          collection(db, "interviews"),
          where("interviewCode", "==", code)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError("Interview not found.");
        } else {
          const data = snapshot.docs[0].data() as Interview;
          setInterview(data);
        }
      } catch (err) {
        console.error("Error fetching interview:", err);
        setError("Failed to load interview.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [code]);

  // 🎬 Start Recording
  const startRecording = () => {
    if (!streamRef.current) return;

    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordings((prev) => [...prev, blob]);
    };

    recorder.start();
    setIsRecording(true);
  };

  // ⏹ Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // ➡️ Next Question
  const handleNext = () => {
    stopRecording();
    setCurrentIndex((prev) => prev + 1);
  };

  // ✅ Submit Interview
  const handleSubmit = async () => {
  stopRecording();

  if (!interview || !code) return;

  try {
    const uploadedAnswers = await Promise.all(
      recordings.map((blob, index) => uploadToCloudinary(blob, index))
    );

    const interviewCode = typeof code === "string" ? code : code?.[0] ?? "unknown";

    await setDoc(doc(db, "submissions", interviewCode), {
      submittedAt: Timestamp.now(),
      interviewCode,
      totalAnswers: uploadedAnswers.length,
      answers: uploadedAnswers.map(ans => ans.url), // ✅ save only the URLs
    });

    alert("Interview submitted successfully!");
    router.push("/thankyou");
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    alert("Failed to submit interview.");
  }
};

  // UI States
  if (!code || typeof code !== "string") return <div>Invalid code.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 p-6">{error}</div>;
  if (!interview) return null;

  const isLast = currentIndex === interview.questions.length - 1;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-black dark:text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">{interview.title}</h1>
      <p className="text-sm text-slate-500 mb-4">Interview Code: {code}</p>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full max-w-md rounded-xl shadow mb-6"
      />

      <div className="w-full max-w-xl border border-slate-300 dark:border-slate-700 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          Question {currentIndex + 1} of {interview.questions.length}
        </h2>
        <p className="mb-4">{interview.questions[currentIndex]}</p>

        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            🎥 Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            ⏹ Stop Recording
          </button>
        )}

        <div className="mt-6">
          {!isLast ? (
            <button
              onClick={handleNext}
              disabled={isRecording}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Next Question →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isRecording}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg"
            >
              Submit Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
