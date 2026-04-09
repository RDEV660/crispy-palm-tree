import type { D1Database } from "@cloudflare/workers-types";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getD1(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  const db = env.DB;
  if (!db) {
    throw new Error("D1 binding DB is not configured. Add it to wrangler.jsonc and run migrations.");
  }
  return db;
}
