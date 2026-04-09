import type { D1Database } from "@cloudflare/workers-types";
import type { Sql } from "postgres";

export type ContractDb =
  | { driver: "d1"; d1: D1Database }
  | { driver: "postgres"; sql: Sql };

let pgSql: Sql | null = null;
let pgInit: Promise<Sql> | null = null;

async function getPostgresSql(): Promise<Sql> {
  const url = (process.env.DATABASE_URL ?? process.env.POSTGRES_URL)?.trim();
  if (!url) {
    throw new Error(
      "Set DATABASE_URL (or POSTGRES_URL) for Vercel, or use Cloudflare with D1 configured."
    );
  }
  if (pgSql) return pgSql;
  if (!pgInit) {
    pgInit = (async () => {
      const postgres = (await import("postgres")).default;
      const local = url.includes("localhost") || url.includes("127.0.0.1");
      return postgres(url, {
        max: 3,
        idle_timeout: 20,
        connect_timeout: 15,
        ssl: local ? false : "require",
      });
    })();
  }
  pgSql = await pgInit;
  return pgSql;
}

/**
 * Prefer Postgres when DATABASE_URL / POSTGRES_URL is set (Vercel, Docker, etc.).
 * Otherwise use Cloudflare D1 when the binding exists.
 */
export async function getContractDb(): Promise<ContractDb> {
  if (process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim()) {
    return { driver: "postgres", sql: await getPostgresSql() };
  }
  try {
    const { getD1 } = await import("./db");
    const d1 = await getD1();
    return { driver: "d1", d1 };
  } catch {
    throw new Error(
      "Database not configured. Vercel: connect Postgres and set DATABASE_URL (run migrations/postgres/0001_contracts.sql). Cloudflare: bind D1 and run npm run db:migrate:local."
    );
  }
}
