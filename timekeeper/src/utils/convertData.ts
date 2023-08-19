import { WageObjectProps, CreateWageProps } from "../database/database";

export const convertToCreateWageProps = (
  wage: WageObjectProps
): CreateWageProps => {
  return {
    totalHours: wage.totalHours,
    shiftDate: wage.shiftDate.toDate(), // convert FirebaseTimestamp to Date
    startTime: wage.startTime.toDate(),
    endTime: wage.endTime.toDate(),
    numBreaks: wage.numBreaks,
    breaks: wage.breaks,
    breakTime: wage.breakTime,
    rate: wage.rate,
    totalEarned: wage.totalEarned,
    currency: wage.currency,
  };
};
