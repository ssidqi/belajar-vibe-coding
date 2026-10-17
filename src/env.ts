/**
 * Validasi & export environment variables.
 *
 * Bun otomatis memuat file `.env` (tanpa perlu library dotenv),
 * jadi cukup baca dari `process.env` di sini.
 */

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL belum di-set. Salin `.env.example` menjadi `.env` lalu isi kredensial MySQL kamu.",
  );
}

const PORT = Number(process.env.PORT ?? 3000);

if (Number.isNaN(PORT)) {
  throw new Error(`PORT harus berupa angka, tapi menerima "${process.env.PORT}".`);
}

export const env = {
  DATABASE_URL,
  PORT,
} as const;
