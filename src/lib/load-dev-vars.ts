import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** In dev, these always come from `.dev.vars` when set (overrides empty/stale env from tooling). */
const DEV_VARS_FORCE_KEYS = new Set(["CONTRACT_ADMIN_PASSWORD", "CONTRACT_SESSION_SECRET"]);

/**
 * Merge `.dev.vars` into `process.env` when keys are unset.
 * Ensures Edge middleware and API routes use the same secrets as Wrangler during `next dev`
 * (fixes JWT signed in Route Handler vs verified in middleware mismatch).
 */
export function loadDevVarsIntoProcessEnv(): void {
  if (process.env.NODE_ENV === "production") return;
  const file = join(process.cwd(), ".dev.vars");
  if (!existsSync(file)) return;
  const text = readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!key) continue;
    const force = DEV_VARS_FORCE_KEYS.has(key) && val.length > 0;
    if (force) {
      process.env[key] = val;
    } else if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}
