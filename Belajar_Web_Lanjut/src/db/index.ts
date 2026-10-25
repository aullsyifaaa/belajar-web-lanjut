import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(currentDirectory, "../../.env") });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL wajib diatur dalam file .env atau environment");
}

const client = postgres(databaseUrl);

export const db = drizzle({ client });
