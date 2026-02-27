import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in .env.dev");
}

export const dbPool = new Pool({
  connectionString: databaseUrl
});

