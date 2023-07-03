import { FIREBASE_AUTH } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const resetPasword = async (email: string) => {
  const auth = FIREBASE_AUTH;
  if (email === "") return;

  const response = await sendPasswordResetEmail(auth, email);

  console.log(response);
};

export default resetPasword;
