import {
  checkDatabaseConnection
} from "./client.js";

export async function checkDatabaseHealth(): Promise<{
  status: "ok" | "error";
}> {
  try {
    await checkDatabaseConnection();

    return {
      status: "ok"
    };
  } catch {
    return {
      status: "error"
    };
  }
}
