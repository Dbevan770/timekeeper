export const calculateTimeDifference = (
  startHour: string,
  startMin: string,
  startMeridian: string,
  endHour: string,
  endMin: string,
  endMeridian: string
) => {
  let startHour24 =
    startMeridian === "PM" && parseInt(startHour) < 12
      ? parseInt(startHour) + 12
      : parseInt(startHour);
  let endHour24 =
    endMeridian === "PM" && parseInt(endHour) < 12
      ? parseInt(endHour) + 12
      : parseInt(endHour);

  if (startMeridian === "AM" && startHour === "12") startHour24 = 0;
  if (endMeridian === "AM" && endHour === "12") endHour24 = 0;

  // Convert the hours and minutes to minutes
  const startMinutes = startHour24 * 60 + parseInt(startMin);
  const endMinutes = endHour24 * 60 + parseInt(endMin);

  // Calculate the difference in minutes
  let diffMinutes = endMinutes - startMinutes;

  // If the end time is less than the start time, add 24 hours (in minutes)
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60;
  }

  // Convert the difference to hours
  const diffHours = diffMinutes / 60;

  return diffHours;
};

interface Break {
  hours: string;
  minutes: string;
}

export const calculateTotalBreaks = (breaks: Break[]) => {
  return breaks.reduce((total: number, breakObj: any) => {
    const breakHours = parseInt(breakObj.hours) || 0;
    const breakMinutes = parseInt(breakObj.minutes) || 0;
    const breakInHours = breakHours + breakMinutes / 60;
    return total + breakInHours;
  }, 0);
};

export const calculateEarned = (actualHoursWorked: number, rate: string) => {
  return (actualHoursWorked * parseFloat(rate)).toFixed(2);
};
