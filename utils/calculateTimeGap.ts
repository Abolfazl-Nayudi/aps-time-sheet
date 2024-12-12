import { addDays, differenceInSeconds, format, parse } from "date-fns";

const timeGapCalculator = (start: string, end: string) => {
  console.log(start, end);
  console.log("hi");
  const startTimeParsed = parse(start, "HH:mm", new Date());
  const endTimeParsed = parse(end, "HH:mm", new Date());

  let secondsDifference;
  if (endTimeParsed < startTimeParsed) {
    secondsDifference = differenceInSeconds(addDays(endTimeParsed, 1), startTimeParsed);
  } else {
    secondsDifference = differenceInSeconds(endTimeParsed, startTimeParsed);
  }
  console.log(secondsDifference);

  if (secondsDifference < 0) {
    return { status: "error", data: "End time must be after start time" };
  }

  // Format the difference as HH:mm:ss
  const hours = Math.floor(secondsDifference / 3600);
  const minutes = Math.floor((secondsDifference % 3600) / 60);
  //   const seconds = secondsDifference % 60;
  // console.log(format(new Date(0, 0, 0, hours, minutes, 0), "HH:mm"));
  return { status: "success", data: format(new Date(0, 0, 0, hours, minutes, 0), "HH:mm") };
};

export { timeGapCalculator };
