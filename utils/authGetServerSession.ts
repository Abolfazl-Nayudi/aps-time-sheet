import { getServerSession as serverSession } from "next-auth";

import { authOption } from "./authOptions";

export async function getServerSession() {
  return await serverSession(authOption);
}
