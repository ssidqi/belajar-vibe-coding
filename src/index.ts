import { Elysia } from "elysia";

import { env } from "./env";
import { healthRoutes } from "./routes/health";
import { userRoutes } from "./routes/users";

/**
 * CORS sederhana tanpa dependency tambahan.
 * Untuk request preflight (OPTIONS) langsung kita balas 204,
 * untuk response lainnya kita tambahkan header CORS lewat `onAfterHandle`.
 */
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const app = new Elysia()
  .onRequest(({ request }) => {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
  })
  .onAfterHandle(({ set }) => {
    Object.assign(set.headers, corsHeaders);
  })
  .use(healthRoutes)
  .use(userRoutes)
  .listen(env.PORT);

console.log(`🦊 Elysia jalan di http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
