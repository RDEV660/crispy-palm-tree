import { SignJWT, jwtVerify } from "jose";
import { getCloudflareContext } from "@opennextjs/cloudflare";

function sessionSecretFromEnv(): string | null {
  const s = process.env.CONTRACT_SESSION_SECRET?.trim();
  if (s && s.length >= 16) return s;
  return null;
}

function requireSecretString(): string {
  const s = sessionSecretFromEnv();
  if (!s) {
    throw new Error("CONTRACT_SESSION_SECRET must be set (minimum 16 characters).");
  }
  return s;
}

async function getSessionSecretBytes(): Promise<Uint8Array> {
  const direct = sessionSecretFromEnv();
  if (direct) {
    return new TextEncoder().encode(direct);
  }
  // Vercel / Node-only: never call Cloudflare Workers APIs (can throw or hang).
  if (process.env.VERCEL === "1" || process.env.VERCEL_ENV) {
    return new TextEncoder().encode(requireSecretString());
  }
  try {
    const { env } = await getCloudflareContext({ async: true });
    const s = (env.CONTRACT_SESSION_SECRET as string | undefined)?.trim();
    if (s && s.length >= 16) {
      return new TextEncoder().encode(s);
    }
  } catch {
    /* fall through */
  }
  return new TextEncoder().encode(requireSecretString());
}

/** For Edge middleware: secret must be available on process.env */
export function getSessionSecretBytesFromProcessEnv(): Uint8Array | null {
  const s = sessionSecretFromEnv();
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function signAdminSessionJwt(): Promise<string> {
  const secret = await getSessionSecretBytes();
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminSessionJwt(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const secret = await getSessionSecretBytes();
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function verifyAdminSessionJwtFromProcessEnv(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = getSessionSecretBytesFromProcessEnv();
  if (!secret) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}
