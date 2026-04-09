/** Non-refundable deposit amount in USD cents */
export const DEPOSIT_CENTS = 2500;

/** Bump when contract legal copy changes (stored on row + echoed in PDF) */
export const LEGAL_VERSION = 1;

export const SESSION_COOKIE_NAME = "ohana_admin_session";

/** Max signature payload (~450KB base64) */
export const MAX_SIGNATURE_CHARS = 600_000;

export type ContractStatus = "draft" | "sent" | "client_signed" | "completed" | "void";

export const CONTRACT_STATUSES: ContractStatus[] = [
  "draft",
  "sent",
  "client_signed",
  "completed",
  "void",
];
