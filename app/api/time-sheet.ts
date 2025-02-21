import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

import { UserTaskDataType } from "@/components/UserReport.tsx";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  // if(req.method !== 'POST'){
  //     return res.status(405).send({message: 'only post request are allowed'})
  // }

  const body = req.body as UserTaskDataType[];

  try {
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

    const rows = body.map(taskData => {
      const { categoryName, taskName, date, startTime, endTime, price, isByHour, hourPrice, notes } = taskData;

      return { category: categoryName, task: taskName, date, startTime, endTime, price, isByHour, hourPrice, notes };
    });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "A1:J1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rows],
      },
    });

    return res.status(200).json({ data: response.data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    }
  }
}
