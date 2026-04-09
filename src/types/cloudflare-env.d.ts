import type { D1Database } from "@cloudflare/workers-types";

declare global {
  // Augment OpenNext's CloudflareEnv with app bindings and secrets
  interface CloudflareEnv {
    DB: D1Database;
    CONTRACT_ADMIN_PASSWORD?: string;
    CONTRACT_SESSION_SECRET?: string;
  }
}

export {};
