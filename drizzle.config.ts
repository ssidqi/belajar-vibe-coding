import { defineConfig } from "drizzle-kit";

// Drizzle Kit otomatis membaca file `.env`.
export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
