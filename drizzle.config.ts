import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, 'Belajar_Web_Lanjut/.env') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL wajib diatur dalam file .env atau environment');
}

export default defineConfig({
  out: './drizzle',
  schema: './Belajar_Web_Lanjut/src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
