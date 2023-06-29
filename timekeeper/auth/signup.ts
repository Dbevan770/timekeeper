import { FIREBASE_AUTH } from "../src/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const SignUp = async (email: string, password: string) => {
  const auth = FIREBASE_AUTH;
  let result = null;
  let error = null;

  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    error = err;
  }

  return { result, error };
};
