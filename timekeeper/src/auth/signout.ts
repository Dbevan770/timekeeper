import { FIREBASE_AUTH } from "../firebaseConfig";
import { signOut } from "firebase/auth";

const SignOut = async () => {
  const auth = FIREBASE_AUTH;
  let result = null;
  let error = null;

  try {
    result = await signOut(auth);
  } catch (error) {
    error = error;
  }

  return { result, error };
};

export default SignOut;
