import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const generateInterviewCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const generateUniqueCode = async (): Promise<string> => {
  let code = generateInterviewCode();
  let exists = true;

  while (exists) {
    const q = query(
      collection(db, "interviews"),
      where("interviewCode", "==", code)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      exists = false;
    } else {
      code = generateInterviewCode(); // regenerate if already exists
    }
  }

  return code;
};

interface SaveInterviewOptions {
  title: string;
  questions: string[];
  createdBy: string;
  mode: "manual" | "ai";
}

export async function saveInterview({
  title,
  questions,
  createdBy,
  mode,
}: SaveInterviewOptions): Promise<string> {
  const interviewCode = await generateUniqueCode();

  await addDoc(collection(db, "interviews"), {
    title,
    questions,
    createdBy,
    mode,
    createdAt: serverTimestamp(),
    interviewCode,
  });

  return interviewCode;
}
