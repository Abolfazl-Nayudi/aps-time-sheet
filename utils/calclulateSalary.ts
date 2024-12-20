import { UserTaskDataType } from "@/components/UserReport.tsx";

import { timeGapCalculator } from "./calculateTimeGap";

function calculateTotalPrice(duration: string, pricePerHour: number) {
  // Split the duration into hours and minutes
  const [hours, minutes] = duration.split(":").map(Number);

  // Convert duration to total hours
  const totalHours = hours + minutes / 60;

  // Calculate the total price
  const totalPrice = totalHours * pricePerHour;

  return totalPrice;
}

const calculateSalary = (tasks: UserTaskDataType[]) => {
  const price = tasks.reduce((acc, curr) => {
    if (curr.isByHour) {
      const { data, status } = timeGapCalculator(curr.startTime, curr.endTime);

      if (data) {
        const totalPricePerHour = calculateTotalPrice(data, parseFloat(curr.hourPrice!));
        return acc + totalPricePerHour;
      } else {
        return acc;
      }
    } else {
      return acc + parseFloat(curr.price!);
    }
  }, 0);

  const formatPrice = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    price,
  );
  console.log(formatPrice);
  return formatPrice;
};

export { calculateSalary, calculateTotalPrice };
