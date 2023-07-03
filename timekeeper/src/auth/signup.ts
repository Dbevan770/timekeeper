import { FIREBASE_AUTH } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export const SignUp = async (
  email: string,
  password: string,
  displayName: string
) => {
  const auth = FIREBASE_AUTH;
  let result = null;
  let error = null;

  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = response.user;
    const update = await updateProfile(user, {
      displayName: displayName,
    });

    console.log(update);

    result = {
      msg: "Successfully created new user!",
      displayName: displayName,
    };
  } catch (err) {
    error = err;
  }

  return { result, error };
};
