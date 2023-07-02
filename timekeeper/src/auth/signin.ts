import { FIREBASE_AUTH } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export const SignIn = async (email: string, password: string) => {
  const auth = FIREBASE_AUTH;
  let result = null;
  let error = null;

  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    error = err;
  }

  return { result, error };
};
