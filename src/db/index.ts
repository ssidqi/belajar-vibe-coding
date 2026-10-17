import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { env } from "../env";
import * as schema from "./schema";

// Connection pool ke MySQL, memakai DATABASE_URL dari environment.
const pool = mysql.createPool(env.DATABASE_URL);

export const db = drizzle(pool, { schema, mode: "default" });

export { pool };
