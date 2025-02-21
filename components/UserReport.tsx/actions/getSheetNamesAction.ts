"use server";

import { google } from "googleapis";

const getSheetNames = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ auth, version: "v4" });

  const response = await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID, // Replace with your spreadsheet ID
  });

  // Extract and filter sheet names
  const sheetNames = response.data.sheets
    ?.map(sheet => sheet.properties?.title)
    .filter((name): name is string => !!name); // Filters out null and undefined

  if (!sheetNames || sheetNames.length === 0) {
    return { status: "error", message: "Failed to get sheet names", data: null };
  }

  console.log(sheetNames);

  return { status: "success", message: "", data: sheetNames };
};

export { getSheetNames };
