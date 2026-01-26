import { drizzle } from "drizzle-orm/mysql2";
import { profiles } from "./drizzle/schema.js";
import * as dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function listProfiles() {
  try {
    const result = await db.select().from(profiles);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Erro:", error);
  }
}

listProfiles();
