import { FIREBASE_DB } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  Timestamp as FirebaseTimestamp,
  query,
  where,
  Query,
  DocumentData,
  FirestoreError,
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

export interface CreateWageProps {
  totalHours: number;
  shiftDate: Date;
  startTime: Date;
  endTime: Date;
  numBreaks: number;
  breaks: { hours: string; minutes: string }[];
  breakTime: number;
  rate: number;
  totalEarned: number;
  currency: string;
}

export interface WageObjectProps {
  docId: string;
  totalHours: number;
  shiftDate: FirebaseTimestamp;
  startTime: FirebaseTimestamp;
  endTime: FirebaseTimestamp;
  numBreaks: number;
  breaks: { hours: string; minutes: string }[];
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

interface QueryResult {
  success: boolean;
  data?: WageObjectProps[];
  error?: string;
  msg?: string;
}

export const CreateWage = async (
  user: FirebaseUser | null,
  wage: CreateWageProps
): Promise<QueryResult> => {
  console.log("Create wage called.");
  if (user === null) {
    console.log("You are not authenticated");
    return { success: false, error: "You are not authenticated." };
  }

  let result: WageObjectProps[] = [];

  try {
    console.log("Adding doc to Firebase");
    const docRef = await addDoc(collection(FIREBASE_DB, user.uid), {
      totalHours: wage.totalHours,
      shiftDate: wage.shiftDate,
      startTime: wage.startTime,
      endTime: wage.endTime,
      numBreaks: wage.numBreaks,
      breaks: wage.breaks,
      breakTime: wage.breakTime,
      rate: wage.rate,
      totalEarned: wage.totalEarned,
      currency: wage.currency,
    });
    console.log(docRef);

    const newShift: WageObjectProps = {
      docId: docRef.id,
      totalHours: wage.totalHours,
      shiftDate: FirebaseTimestamp.fromDate(wage.shiftDate),
      startTime: FirebaseTimestamp.fromDate(wage.startTime),
      endTime: FirebaseTimestamp.fromDate(wage.endTime),
      numBreaks: wage.numBreaks,
      breaks: wage.breaks,
      breakTime: wage.breakTime,
      rate: wage.rate,
      totalEarned: wage.totalEarned,
      currency: wage.currency,
    };
    console.log(newShift);

    result.push(newShift);
    console.log(result);

    return { success: true, data: result };
  } catch (err) {
    console.log(err);
    if (err instanceof FirestoreError) {
      return { success: false, error: err.message };
    }
    throw err;
  }
};

export const UpdateWage = async (
  user: FirebaseUser,
  wage: WageObjectProps
): Promise<QueryResult> => {
  try {
    await setDoc(doc(FIREBASE_DB, user.uid, wage.docId), {
      totalHours: wage.totalHours,
      shiftDate: wage.shiftDate,
      startTime: wage.startTime,
      endTime: wage.endTime,
      numBreaks: wage.numBreaks,
      breaks: wage.breaks,
      breakTime: wage.breakTime,
      rate: wage.rate,
      totalEarned: wage.totalEarned,
      currency: wage.currency,
    });
    return { success: true, msg: "Successfully updated the document." };
  } catch (err: unknown) {
    if (err instanceof FirestoreError) {
      return { success: false, error: err.message };
    } else {
      return { success: false, error: "Unknown error has occured." };
    }
  }
};

export const GetFilteredWages = async (
  user: FirebaseUser,
  dateRangeQuery: DateRangeQuery
): Promise<QueryResult> => {
  if (user === null)
    return { success: false, error: "You are not authenticated." };
  let wages: WageObjectProps[] = [];

  try {
    const userWagesRef = collection(FIREBASE_DB, user.uid);
    let q: Query<DocumentData>;

    let current: Date;
    let firstDate: Date;
    let lastDate: Date;

    switch (dateRangeQuery.queryType) {
      case "currentWeek":
        current = new Date();
        let first = current.getDate() - current.getDay();
        let last = first + 7;
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
        numBreaks: data.numBreaks,
        breaks: data.breaks,
        breakTime: data.breakTime,
        rate: data.rate,
        totalEarned: data.totalEarned,
        currency: data.currency,
      });
    });
    return { success: true, data: wages };
  } catch (err) {
    if (err instanceof FirestoreError) {
      return { success: false, error: err.message };
    }
    throw err;
  }
};

export const GetWages = async (user: FirebaseUser): Promise<QueryResult> => {
  let wages: WageObjectProps[] = [];

  if (user) {
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, user.uid));

      querySnapshot.forEach(async (doc) => {
        const data = doc.data();

        // Check if startTime is a string and convert to Firebase Timestamp
        let startTime = data.startTime;
        if (typeof startTime === "string") {
          startTime = FirebaseTimestamp.fromDate(parseTimeString(startTime));
        }

        // Check if endTime is a string and convert to Firebase Timestamp
        let endTime = data.endTime;
        if (typeof endTime === "string") {
          endTime = FirebaseTimestamp.fromDate(parseTimeString(endTime));
        }

        wages.push({
          docId: doc.id,
          totalHours: data.totalHours,
          shiftDate: data.shiftDate,
          startTime: data.startTime,
          endTime: data.endTime,
          numBreaks: data.numBreaks,
          breaks: data.breaks,
          breakTime: data.breakTime,
          rate: data.rate,
          totalEarned: data.totalEarned,
          currency: data.currency,
        });
      });
      console.log(wages);
      return { success: true, data: wages };
    } catch (err) {
      if (err instanceof FirestoreError) {
        return { success: false, error: err.message };
      }
      throw err;
    }
  }
  return {
    success: false,
    error: "You are not authenticated.",
  };
};

// A utility function to parse a string time (like "10:00AM") into a Date object
const parseTimeString = (timeString: string): Date => {
  const time = new Date(`1970-01-01 ${timeString}`);
  return time;
};

export const DeleteWage = async (user: FirebaseUser, docId: string) => {
  try {
    await deleteDoc(doc(FIREBASE_DB, user.uid, docId));
    return {
      success: true,
      msg: "Successfully deleted document from collection.",
    };
  } catch (err) {
    if (err instanceof FirestoreError) {
      return { success: false, msg: err.message };
    } else {
      return { success: false, msg: "Unknown error has occured." };
    }
  }
};
