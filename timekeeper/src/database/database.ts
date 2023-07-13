import { FIREBASE_DB } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  Timestamp as FirebaseTimestamp,
  query,
  where,
  Query,
  DocumentData,
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

export interface DateRangeQuery {
  queryType:
    | "currentWeek"
    | "pastMonth"
    | "pastSixMonths"
    | "pastYear"
    | "custom";
  startDate?: Date;
  endDate?: Date;
}

export const GetFilteredWages = async (
  user: FirebaseUser,
  dateRangeQuery: DateRangeQuery
): Promise<WageObjectProps[]> => {
  if (user === null) return [];
  let wages: WageObjectProps[] = [];

  const userWagesRef = collection(FIREBASE_DB, user.uid);
  let q: Query<DocumentData>;

  let current: Date;
  let firstDate: Date;
  let lastDate: Date;

  switch (dateRangeQuery.queryType) {
    case "currentWeek":
      current = new Date();
      let first = current.getDate() - current.getDay();
      let last = first + 6;
      firstDate = new Date(current.getFullYear(), current.getMonth(), first);
      lastDate = new Date(current.getFullYear(), current.getMonth(), last);

      q = query(
        userWagesRef,
        where("shiftDate", ">=", firstDate),
        where("shiftDate", "<=", lastDate)
      );
      break;
    case "pastMonth":
      current = new Date();
      firstDate = new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        current.getDate()
      );
      lastDate = current;

      q = query(
        userWagesRef,
        where("shiftDate", ">=", firstDate),
        where("shiftDate", "<=", lastDate)
      );
      break;
    case "pastSixMonths":
      current = new Date();
      firstDate = new Date(
        current.getFullYear(),
        current.getMonth() - 6,
        current.getDate()
      );
      lastDate = current;

      q = query(
        userWagesRef,
        where("shiftDate", ">=", firstDate),
        where("shiftDate", "<=", lastDate)
      );
      break;
    case "pastYear":
      current = new Date();
      firstDate = new Date(
        current.getFullYear() - 1,
        current.getMonth(),
        current.getDate()
      );
      lastDate = current;

      q = query(
        userWagesRef,
        where("shiftDate", ">=", firstDate),
        where("shiftDate", "<=", lastDate)
      );
      break;
    case "custom":
      if (!dateRangeQuery.startDate || !dateRangeQuery.endDate) {
        throw new Error(
          "Custom date range requires both a start and end date."
        );
      }

      q = query(
        userWagesRef,
        where("shiftDate", ">=", dateRangeQuery.startDate),
        where("shiftDate", "<=", dateRangeQuery.endDate)
      );
      break;
    default:
      throw new Error(
        `Invalid queryType passed to database: ${dateRangeQuery.queryType}`
      );
  }

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
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

  return wages;
};

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
    return true;
  } catch (err) {
    return false;
  }
};
