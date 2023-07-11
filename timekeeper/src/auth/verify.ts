import { sendEmailVerification, User as FirebaseUser } from "firebase/auth";

export const verifyUser = async (user: FirebaseUser) => {
  if (user === null) return;

  try {
    await sendEmailVerification(user);
    return { msg: "Successfully sent verification e-mail", success: true };
  } catch (err) {
    console.log(err);
    return { msg: "Failed to send verification e-mail", success: false };
  }
};
