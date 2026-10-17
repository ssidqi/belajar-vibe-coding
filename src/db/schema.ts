import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Tabel contoh: users
 * Sengaja hanya 1 tabel sesuai scope issue #2.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
