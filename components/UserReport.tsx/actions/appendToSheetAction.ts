"use server";

import { google } from "googleapis";

import { UserTaskDataType } from "@/components/UserReport.tsx";

import { calculateTotalPrice } from "../../../utils/calclulateSalary";
import { timeGapCalculator } from "../../../utils/calculateTimeGap";

type ArgType = {
  page: string;
  row: string;
  data: UserTaskDataType[];
};

const appendToSheetAction = async ({ data, page, row }: ArgType) => {
  console.log("page", page);
  console.log("row", row);

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });

  const sheets = google.sheets({
    auth,
    version: "v4",
  });

  const rows = data.map(taskData => {
    const { categoryName, taskName, date, startTime, endTime, price, isByHour, hourPrice, notes } = taskData;

    let duration;
    if (startTime && endTime) {
      duration = timeGapCalculator(startTime, endTime);
    }

    let totalPricePerHour;

    if (duration && hourPrice) {
      totalPricePerHour = calculateTotalPrice(duration.data, parseFloat(hourPrice)).toFixed(3);
    }

    console.log(totalPricePerHour);

    return [
      date || null,
      null,
      categoryName || null,
      taskName || null,
      null,
      // startTime || null,
      duration?.data || null,
      // endTime || "N/A",
      price || totalPricePerHour || null,
      null,
      null,
      // isByHour ? "true" : "false",
      // hourPrice || "0",
      notes || null,
    ];
  });

  console.log(rows);

  const response = await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${page}!${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: rows,
    },
  });

  console.log(response);
  if (response.status !== 200) {
    return { status: "error", message: "Failed to insert data into the sheet", data: null };
  }
  return { status: "success", message: "data inserted successfully", data: "" };
};

export { appendToSheetAction };
