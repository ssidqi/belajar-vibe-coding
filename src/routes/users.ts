import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "../db";
import { users } from "../db/schema";

export const userRoutes = new Elysia({ prefix: "/users" })
  // GET /users -> semua user
  .get("/", () => db.select().from(users))
  // POST /users -> tambah user baru
  .post(
    "/",
    async ({ body, set }) => {
      // MySQL belum mendukung `RETURNING`, jadi ambil id dari `$returningId()`
      // lalu query ulang baris yang baru dibuat.
      const [inserted] = await db
        .insert(users)
        .values({ name: body.name })
        .$returningId();

      if (!inserted) {
        set.status = 500;
        return { error: "Gagal membuat user" };
      }

      const [created] = await db
        .select()
        .from(users)
        .where(eq(users.id, inserted.id));

      set.status = 201;
      return created ?? null;
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
      }),
    },
  );
