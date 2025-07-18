import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export const deleteInterview = async (id: string) => {
  const interviewRef = doc(db, "interviews", id);
  await deleteDoc(interviewRef);
};
