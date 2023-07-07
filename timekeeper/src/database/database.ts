import { FIREBASE_DB } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  Timestamp as FirebaseTimestamp,
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

export interface CreateWageProps {
  totalHours: number;
  shiftDate: Date;
  startTime: string;
  endTime: string;
  breaks: number;
  breakTime: number;
  rate: number;
  totalEarned: number;
  currency: string;
}

export const CreateWage = async (
  user: FirebaseUser | null,
  wage: CreateWageProps
) => {
  if (user === null) return;

  const docRef = await addDoc(collection(FIREBASE_DB, user.uid), {
    totalHours: wage.totalHours,
    shiftDate: wage.shiftDate,
    startTime: wage.startTime,
    endTime: wage.endTime,
    breaks: wage.breaks,
    breakTime: wage.breakTime,
    rate: wage.rate,
    totalEarned: wage.totalEarned,
    currency: wage.currency,
  });

  const newShift: WageObjectProps = {
    docId: docRef.id,
    totalHours: wage.totalHours,
    shiftDate: FirebaseTimestamp.fromDate(wage.shiftDate),
    startTime: wage.startTime,
    endTime: wage.endTime,
    breaks: wage.breaks,
    breakTime: wage.breakTime,
    rate: wage.rate,
    totalEarned: wage.totalEarned,
    currency: wage.currency,
  };

  return newShift;
};

export interface WageObjectProps {
  docId: string;
  totalHours: number;
  shiftDate: FirebaseTimestamp;
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
      wages.push({
        docId: doc.id,
        totalHours: data.totalHours,
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

export const DeleteWage = async (user: FirebaseUser, docId: string) => {
  try {
    await deleteDoc(doc(FIREBASE_DB, user.uid, docId));
  } catch (err) {
    console.log(err);
  }
};
