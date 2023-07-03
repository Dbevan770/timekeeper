import { sendEmailVerification, User as FirebaseUser } from "firebase/auth";

const verifyUser = async (user: FirebaseUser) => {
  if (user === null) return;

  const response = await sendEmailVerification(user);

  console.log(response);
};

export default verifyUser;
