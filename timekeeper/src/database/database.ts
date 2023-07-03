import { FIREBASE_DB } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { convertTimestamp } from "../utils/convertTimestamp";

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

export interface WageObjectProps {
  docId: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  breaks: number;
  breakTime: number;
  rate: number;
  totalEarned: number;
  currency: string;
}

export const GetWages = async (
  user: FirebaseUser
): Promise<WageObjectProps[]> => {
  let wages: WageObjectProps[] = [];

  if (user) {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, user.uid));

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      data.shiftDate = await convertTimestamp(data.shiftDate);
      wages.push({
        docId: doc.id,
        shiftDate: data.shiftDate,
        startTime: data.startTime,
        endTime: data.endTime,
        breaks: data.breaks,
        breakTime: data.breakTime,
        rate: data.rate,
        totalEarned: data.totalEarned,
        currency: data.currency,
      });
    });
  }

  return wages;
};
