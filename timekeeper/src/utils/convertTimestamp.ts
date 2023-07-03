import { Timestamp } from "firebase/firestore";

export const convertTimestamp = async (timestamp: Timestamp | null) => {
  if (!timestamp) {
    return "No date";
  }

  const date = timestamp.toDate();
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};
