import { WageObjectProps, CreateWageProps } from "../database/database";

export const convertToCreateWageProps = (
  wage: WageObjectProps
): CreateWageProps => {
  return {
    totalHours: wage.totalHours,
    shiftDate: wage.shiftDate.toDate(), // convert FirebaseTimestamp to Date
    startHour: wage.startHour,
    startMinute: wage.startMinute,
    startMeridian: wage.startMeridian,
    startTime: wage.startTime,
    endHour: wage.endHour,
    endMinute: wage.endMinute,
    endMeridian: wage.endMeridian,
    endTime: wage.endTime,
    numBreaks: wage.numBreaks,
    breaks: wage.breaks,
    breakTime: wage.breakTime,
    rate: wage.rate,
    totalEarned: wage.totalEarned,
    currency: wage.currency,
  };
};
