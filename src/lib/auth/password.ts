import { timingSafeEqual } from "node:crypto";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function verifyAdminPassword(plain: string): Promise<boolean> {
  const input = plain.trim();
  let expected = (process.env.CONTRACT_ADMIN_PASSWORD ?? "").trim();
  if (!expected) {
    try {
      const { env } = await getCloudflareContext({ async: true });
      expected = (env.CONTRACT_ADMIN_PASSWORD ?? "").trim();
    } catch {
      expected = "";
    }
  }
  if (!expected || !input) return false;
  const a = Buffer.from(input, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
