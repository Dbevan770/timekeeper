import { FIREBASE_AUTH } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

export const GoogleSignIn = async () => {
  const auth = FIREBASE_AUTH;
  const provider = new GoogleAuthProvider();
  let error = null;

  auth.useDeviceLanguage();
  provider.setCustomParameters({
    login_hint: "user@example.com",
  });

  try {
    await signInWithRedirect(auth, provider);
  } catch (err) {
    error = err;
    return error;
  }
};
