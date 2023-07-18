import { calculateTimeDifference } from "../utils/calcHelper";

test("calculateTimeDifference correctly calculates the difference in hours between 2 given times", () => {
  // Define inputs and expected outputs
  const startHour = "8";
  const startMin = "30";
  const startMeridian = "AM";
  const endHour = "5";
  const endMin = "45";
  const endMeridian = "PM";

  const expectedOutput = 9.25;

  const output = calculateTimeDifference(
    startHour,
    startMin,
    startMeridian,
    endHour,
    endMin,
    endMeridian
  );

  expect(output).toBe(expectedOutput);
});
