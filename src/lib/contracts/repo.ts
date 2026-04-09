import type { AppLocale } from "../../../i18n/locales";
import { getContractDb } from "@/lib/contract-db";
import type { ContractPayload } from "./schema";
import { defaultPayload, parsePayloadJson } from "./schema";
import type { ContractStatus } from "./constants";

export type ContractRow = {
  id: number;
  public_id: string;
  status: ContractStatus;
  locale: AppLocale;
  legal_version: number;
  payload_json: string;
  client_signature_data_url: string | null;
  owner_signature_data_url: string | null;
  client_signed_at: number | null;
  owner_signed_at: number | null;
  client_ip: string | null;
  created_at: number;
  updated_at: number;
};

function nowMs() {
  return Date.now();
}

function mapRow(r: Record<string, unknown>): ContractRow {
  return {
    id: Number(r.id),
    public_id: String(r.public_id),
    status: r.status as ContractStatus,
    locale: r.locale as AppLocale,
    legal_version: Number(r.legal_version),
    payload_json: String(r.payload_json),
    client_signature_data_url: r.client_signature_data_url != null ? String(r.client_signature_data_url) : null,
    owner_signature_data_url: r.owner_signature_data_url != null ? String(r.owner_signature_data_url) : null,
    client_signed_at: r.client_signed_at != null ? Number(r.client_signed_at) : null,
    owner_signed_at: r.owner_signed_at != null ? Number(r.owner_signed_at) : null,
    client_ip: r.client_ip != null ? String(r.client_ip) : null,
    created_at: Number(r.created_at),
    updated_at: Number(r.updated_at),
  };
}

export async function insertContract(input: {
  locale: AppLocale;
  legalVersion: number;
  payload: ContractPayload;
}): Promise<{ id: number; public_id: string }> {
  const publicId = crypto.randomUUID();
  const t = nowMs();
  const payloadJson = JSON.stringify(input.payload);
  const ctx = await getContractDb();

  if (ctx.driver === "postgres") {
    const { sql } = ctx;
    const rows = await sql`
      INSERT INTO contracts (
        public_id, status, locale, legal_version, payload_json, created_at, updated_at
      ) VALUES (${publicId}, 'draft', ${input.locale}, ${input.legalVersion}, ${payloadJson}, ${t}, ${t})
      RETURNING id
    `;
    const id = (rows[0] as { id: number } | undefined)?.id;
    if (id == null) throw new Error("Failed to read new contract id");
    return { id, public_id: publicId };
  }

  const db = ctx.d1;
  await db
    .prepare(
      `INSERT INTO contracts (
        public_id, status, locale, legal_version, payload_json,
        created_at, updated_at
      ) VALUES (?, 'draft', ?, ?, ?, ?, ?)`
    )
    .bind(publicId, input.locale, input.legalVersion, payloadJson, t, t)
    .run();
  const row = await db.prepare("SELECT id FROM contracts WHERE public_id = ?").bind(publicId).first<{ id: number }>();
  if (!row?.id) throw new Error("Failed to read new contract id");
  return { id: row.id, public_id: publicId };
}

export async function getContractById(id: number): Promise<ContractRow | null> {
  const ctx = await getContractDb();
  if (ctx.driver === "postgres") {
    const rows = await ctx.sql`
      SELECT id, public_id, status, locale, legal_version, payload_json,
             client_signature_data_url, owner_signature_data_url,
             client_signed_at, owner_signed_at, client_ip, created_at, updated_at
      FROM contracts WHERE id = ${id}
    `;
    const r = rows[0] as Record<string, unknown> | undefined;
    return r ? mapRow(r) : null;
  }
  const db = ctx.d1;
  const row = await db
    .prepare(
      `SELECT id, public_id, status, locale, legal_version, payload_json,
              client_signature_data_url, owner_signature_data_url,
              client_signed_at, owner_signed_at, client_ip, created_at, updated_at
       FROM contracts WHERE id = ?`
    )
    .bind(id)
    .first<ContractRow>();
  return row ?? null;
}

export async function getContractByPublicId(publicId: string): Promise<ContractRow | null> {
  const ctx = await getContractDb();
  if (ctx.driver === "postgres") {
    const rows = await ctx.sql`
      SELECT id, public_id, status, locale, legal_version, payload_json,
             client_signature_data_url, owner_signature_data_url,
             client_signed_at, owner_signed_at, client_ip, created_at, updated_at
      FROM contracts WHERE public_id = ${publicId}
    `;
    const r = rows[0] as Record<string, unknown> | undefined;
    return r ? mapRow(r) : null;
  }
  const db = ctx.d1;
  const row = await db
    .prepare(
      `SELECT id, public_id, status, locale, legal_version, payload_json,
              client_signature_data_url, owner_signature_data_url,
              client_signed_at, owner_signed_at, client_ip, created_at, updated_at
       FROM contracts WHERE public_id = ?`
    )
    .bind(publicId)
    .first<ContractRow>();
  return row ?? null;
}

export async function listContracts(limit = 200): Promise<ContractRow[]> {
  const ctx = await getContractDb();
  if (ctx.driver === "postgres") {
    const rows = await ctx.sql`
      SELECT id, public_id, status, locale, legal_version, payload_json,
             client_signature_data_url, owner_signature_data_url,
             client_signed_at, owner_signed_at, client_ip, created_at, updated_at
      FROM contracts ORDER BY created_at DESC LIMIT ${limit}
    `;
    return (rows as Record<string, unknown>[]).map(mapRow);
  }
  const db = ctx.d1;
  const res = await db
    .prepare(
      `SELECT id, public_id, status, locale, legal_version, payload_json,
              client_signature_data_url, owner_signature_data_url,
              client_signed_at, owner_signed_at, client_ip, created_at, updated_at
       FROM contracts ORDER BY created_at DESC LIMIT ?`
    )
    .bind(limit)
    .all<ContractRow>();
  return res.results ?? [];
}

export async function updateContractPayload(
  id: number,
  payload: ContractPayload,
  allowedStatuses: ContractStatus[]
): Promise<boolean> {
  const t = nowMs();
  const ctx = await getContractDb();
  if (ctx.driver === "postgres") {
    const { sql } = ctx;
    const result = await sql`
      UPDATE contracts SET payload_json = ${JSON.stringify(payload)}, updated_at = ${t}
      WHERE id = ${id} AND status IN ${sql(allowedStatuses)}
    `;
    return result.count > 0;
  }
  const db = ctx.d1;
  const statusList = allowedStatuses.map(() => "?").join(", ");
  const res = await db
    .prepare(
      `UPDATE contracts SET payload_json = ?, updated_at = ?
       WHERE id = ? AND status IN (${statusList})`
    )
    .bind(JSON.stringify(payload), t, id, ...allowedStatuses)
    .run();
  return (res.meta.changes ?? 0) > 0;
}

export async function setStatus(id: number, status: ContractStatus, fromStatuses: ContractStatus[]) {
  const t = nowMs();
  const ctx = await getContractDb();
  if (ctx.driver === "postgres") {
    const { sql } = ctx;
    const result = await sql`
      UPDATE contracts SET status = ${status}, updated_at = ${t}
      WHERE id = ${id} AND status IN ${sql(fromStatuses)}
    `;
    return result.count > 0;
  }
  const db = ctx.d1;
  const placeholders = fromStatuses.map(() => "?").join(", ");
  const res = await db
    .prepare(
      `UPDATE contracts SET status = ?, updated_at = ? WHERE id = ? AND status IN (${placeholders})`
    )
    .bind(status, t, id, ...fromStatuses)
    .run();
  return (res.meta.changes ?? 0) > 0;
}

export async function applyClientSignature(
  publicId: string,
  input: {
    payload: ContractPayload;
    signatureDataUrl: string;
    clientIp: string | null;
  }
): Promise<boolean> {
  const t = nowMs();
  const ctx = await getContractDb();
  if (ctx.driver === "postgres") {
    const { sql } = ctx;
    const result = await sql`
      UPDATE contracts SET
        payload_json = ${JSON.stringify(input.payload)},
        client_signature_data_url = ${input.signatureDataUrl},
        client_signed_at = ${t},
        client_ip = ${input.clientIp},
        status = 'client_signed',
        updated_at = ${t}
      WHERE public_id = ${publicId} AND status = 'sent'
    `;
    return result.count > 0;
  }
  const db = ctx.d1;
  const res = await db
    .prepare(
      `UPDATE contracts SET
        payload_json = ?,
        client_signature_data_url = ?,
        client_signed_at = ?,
        client_ip = ?,
        status = 'client_signed',
        updated_at = ?
       WHERE public_id = ? AND status = 'sent'`
    )
    .bind(
      JSON.stringify(input.payload),
      input.signatureDataUrl,
      t,
      input.clientIp,
      t,
      publicId
    )
    .run();
  return (res.meta.changes ?? 0) > 0;
}

export async function applyOwnerSignature(id: number, signatureDataUrl: string): Promise<boolean> {
  const t = nowMs();
  const ctx = await getContractDb();
  if (ctx.driver === "postgres") {
    const { sql } = ctx;
    const result = await sql`
      UPDATE contracts SET
        owner_signature_data_url = ${signatureDataUrl},
        owner_signed_at = ${t},
        status = 'completed',
        updated_at = ${t}
      WHERE id = ${id} AND status = 'client_signed'
    `;
    return result.count > 0;
  }
  const db = ctx.d1;
  const res = await db
    .prepare(
      `UPDATE contracts SET
        owner_signature_data_url = ?,
        owner_signed_at = ?,
        status = 'completed',
        updated_at = ?
       WHERE id = ? AND status = 'client_signed'`
    )
    .bind(signatureDataUrl, t, t, id)
    .run();
  return (res.meta.changes ?? 0) > 0;
}

export function rowPayload(row: ContractRow): ContractPayload {
  try {
    return parsePayloadJson(row.payload_json);
  } catch {
    return defaultPayload();
  }
}
