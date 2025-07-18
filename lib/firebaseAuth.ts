import { getAuth, signOut } from "firebase/auth";

export const logout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
