import type { ContractRow } from "./repo";
import { rowPayload } from "./repo";

export type PublicContractResponse = {
  publicId: string;
  status: ContractRow["status"];
  locale: ContractRow["locale"];
  legalVersion: number;
  payload: ReturnType<typeof rowPayload>;
  clientSignatureDataUrl: string | null;
  ownerSignatureDataUrl: string | null;
  clientSignedAt: number | null;
  ownerSignedAt: number | null;
};

export function toPublicContractJson(row: ContractRow): PublicContractResponse | null {
  if (row.status === "draft") return null;

  const payload = rowPayload(row);

  if (row.status === "sent") {
    return {
      publicId: row.public_id,
      status: row.status,
      locale: row.locale,
      legalVersion: row.legal_version,
      payload,
      clientSignatureDataUrl: null,
      ownerSignatureDataUrl: null,
      clientSignedAt: null,
      ownerSignedAt: null,
    };
  }

  if (row.status === "client_signed") {
    return {
      publicId: row.public_id,
      status: row.status,
      locale: row.locale,
      legalVersion: row.legal_version,
      payload,
      clientSignatureDataUrl: row.client_signature_data_url,
      ownerSignatureDataUrl: null,
      clientSignedAt: row.client_signed_at,
      ownerSignedAt: null,
    };
  }

  if (row.status === "completed") {
    return {
      publicId: row.public_id,
      status: row.status,
      locale: row.locale,
      legalVersion: row.legal_version,
      payload,
      clientSignatureDataUrl: row.client_signature_data_url,
      ownerSignatureDataUrl: row.owner_signature_data_url,
      clientSignedAt: row.client_signed_at,
      ownerSignedAt: row.owner_signed_at,
    };
  }

  if (row.status === "void") {
    return null;
  }

  return null;
}
