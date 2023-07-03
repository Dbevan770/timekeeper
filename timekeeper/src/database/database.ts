import { FIREBASE_DB } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

export const CreateWage = async (
  user: FirebaseUser | null,
  shiftDate: Date | null,
  startTime: string,
  endTime: string,
  breaks: number,
  breakTime: number,
  rate: number,
  totalEarned: number,
  currency: string
) => {
  if (user === null) return;

  const docRef = await addDoc(collection(FIREBASE_DB, user.uid), {
    shiftDate: shiftDate,
    startTime: startTime,
    endTime: endTime,
    breaks: breaks,
    breakTime: breakTime,
    rate: rate,
    totalEarned: totalEarned,
    currency: currency,
  });

  console.log(docRef.id);
};
