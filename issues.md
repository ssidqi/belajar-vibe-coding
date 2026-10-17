# Planning: Setup Project Baru dengan Bun + ElysiaJS + Drizzle + MySQL

> **Catatan untuk implementor (junior dev / AI model):**
> Dokumen ini adalah panduan **high-level**. Ikuti setiap langkah secara berurutan.
> Jangan over-engineer. Buat sesederhana mungkin, tapi tetap runnable dan rapi.

**Status: ✅ Selesai diimplementasikan** (lihat bagian _Catatan Implementasi_ di bawah).

---

## 1. Tujuan

Membuat project **backend API baru** di folder ini menggunakan:

- **Runtime & Package Manager:** [Bun](https://bun.sh/)
- **Web Framework:** [ElysiaJS](https://elysiajs.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** MySQL

## 2. Prasyarat

- Bun sudah terinstall di komputer (cek dengan `bun --version`).
- MySQL server sudah berjalan (lokal atau via Docker).
- Ada database kosong yang siap dipakai (tabel boleh belum ada, nanti dibuat oleh Drizzle).

> Jika Bun belum terinstall, install dulu: `curl -fsSL https://bun.sh/install | bash`

## 3. Struktur Folder yang Diharapkan

```
./
├── src/
│   ├── index.ts          # Entry point: start server Elysia
│   ├── db/
│   │   ├── index.ts      # Inisialisasi koneksi Drizzle
│   │   └── schema.ts     # Definisi tabel/relasi Drizzle
│   ├── routes/
│   │   ├── health.ts     # Route health check
│   │   └── users.ts      # Route /users (list & create)
│   └── env.ts            # Validasi & export environment variables
├── drizzle/              # Folder migrasi (dihasilkan otomatis oleh Drizzle Kit)
├── .env                  # Kredensial database (JANGAN di-commit)
├── .env.example          # Contoh isi .env (di-commit, tanpa nilai asli)
├── .gitignore            # Pastikan .env, node_modules, dist di-ignore
├── drizzle.config.ts     # Config Drizzle Kit (arahkan ke schema & folder migrasi)
├── package.json
├── tsconfig.json
└── issues.md
```

## 4. Langkah Implementasi

### Langkah 1 — Inisialisasi Project ✅

- Project Bun dibuat manual (`package.json` + `tsconfig.json`).
- Dependency: `elysia`, `drizzle-orm`, `mysql2`.
- Dev dependency: `drizzle-kit`, `@types/bun`.

### Langkah 2 — Setup Environment ✅

- `.env.example` berisi `DATABASE_URL` (format `mysql://user:password@host:port/dbname`) dan `PORT` opsional.
- `.env` asli dibuat dari `.env.example` dan sudah masuk `.gitignore`.
- `src/env.ts` memvalidasi & mengekspos `DATABASE_URL` dan `PORT`.
- Bun memuat `.env` otomatis, jadi tidak perlu library `dotenv`.

### Langkah 3 — Setup Database Schema (Drizzle) ✅

- `src/db/schema.ts` berisi 1 tabel contoh `users`: `id` (PK auto increment), `name` (varchar 255), `createdAt` (timestamp default now).

### Langkah 4 — Setup Koneksi Database ✅

- `src/db/index.ts` membuat connection pool `mysql2` dan instance Drizzle memakai `DATABASE_URL`.

### Langkah 5 — Setup Drizzle Kit & Migrasi ✅

- `drizzle.config.ts` → dialect `mysql`, schema `./src/db/schema.ts`, output `./drizzle`.
- Script: `db:generate`, `db:migrate`, `dev` (`bun run --hot src/index.ts`).
- Migrasi dijalankan sampai sukses: tabel `users` + `__drizzle_migrations` terbentuk di MySQL.

### Langkah 6 — Buat Server (ElysiaJS) ✅

- `GET /health` → `{ ok: true }`
- `GET /users` → semua user dari database
- `POST /users` → tambah user baru (body `{ name }`), return user yang dibuat dengan status 201
- CORS aktif di level sederhana (lihat catatan).

### Langkah 7 — Verifikasi ✅

| Check | Hasil |
| --- | --- |
| `GET /health` | `200` + `{"ok":true}` |
| `POST /users` body `{"name":"Assidqi"}` | `201` + `{"id":1,"name":"Assidqi","createdAt":"..."}` |
| `GET /users` | array berisi user yang baru dibuat |
| `POST /users` body invalid (`{}`) | `422` (validasi Elysia) |
| `OPTIONS /users` (preflight CORS) | `204` + header CORS |
| Console server | jalan tanpa error |

## 5. Definition of Done

1. ✅ Semua langkah di atas selesai.
2. ✅ Perintah `bun run dev` menyalakan server tanpa error.
3. ✅ Semua checklist di **Langkah 7** tercentang.
4. ✅ `.env` tidak ter-commit ke git (ada di `.gitignore`).
5. ✅ TypeScript tanpa error (`bunx --bun tsc --noEmit` → exit 0).

## 6. Larangan (Jangan Dilakukan)

- ❌ Jangan menambah dependency lain di luar daftar di atas (tanpa alasan kuat & terdokumentasi).
- ❌ Jangan menambah auth, testing framework, Docker file, atau CI/CD — itu untuk fase berikutnya.
- ❌ Jangan buat lebih dari 1 tabel.
- ❌ Jangan ganti nama library/teknologi (misal MySQL → Postgres) tanpa persetujuan.

---

## Catatan Implementasi

1. **CORS tanpa dependency tambahan.** `@elysiajs/cors` tidak dipakai supaya tetap patuh pada aturan "jangan tambah dependency". CORS diimplementasikan manual (± 8 baris) via hook `onRequest` (balas preflight `OPTIONS`) dan `onAfterHandle` (tambah header CORS).
2. **MySQL tidak mendukung `RETURNING`.** `POST /users` memakai `$returningId()` lalu query ulang barisnya dengan `db.select()`.
3. **`routes/users.ts` ditambahkan** di samping `routes/health.ts` supaya route `/users` tidak menumpuk di `index.ts`.
4. **Type checking** dijalankan dengan `bunx --bun tsc --noEmit` (bukan menambah `typescript` ke `package.json`, karena di luar daftar dependency yang diizinkan).
5. **Known minor issue:** kolom `timestamp` dikembalikan sesuai timezone lokal server DB, sehingga `createdAt` bisa tampak bergeser dari UTC. Di luar scope issue ini.

## Cara Menjalankan

```bash
cp .env.example .env   # lalu isi kredensial MySQL
bun install
bun run db:generate    # generate file migrasi
bun run db:migrate     # buat tabel di MySQL
bun run dev            # server di http://localhost:3000
```
