import { z } from "zod";
import { DEPOSIT_CENTS } from "./constants";

export const paymentMethodSchema = z.enum(["", "cash", "cashapp", "zelle"]);

export const lineItemSchema = z.object({
  description: z.string().max(500),
  lineTotalCents: z.number().int().min(0).max(99_999_999),
});

export const contractPayloadSchema = z.object({
  clientName: z.string().max(200).default(""),
  eventDate: z.string().max(100).default(""),
  phone: z.string().max(50).default(""),
  timeRange: z.string().max(100).default(""),
  address: z.string().max(500).default(""),
  lineItems: z.array(lineItemSchema).max(50).default([]),
  depositCents: z.literal(DEPOSIT_CENTS),
  paymentMethod: paymentMethodSchema.default(""),
  notes: z.string().max(2000).optional(),
});

export type ContractPayload = z.infer<typeof contractPayloadSchema>;
export type LineItem = z.infer<typeof lineItemSchema>;

export function defaultPayload(): ContractPayload {
  return contractPayloadSchema.parse({
    clientName: "",
    eventDate: "",
    phone: "",
    timeRange: "",
    address: "",
    lineItems: [],
    depositCents: DEPOSIT_CENTS,
    paymentMethod: "",
    notes: "",
  });
}

export function parsePayloadJson(raw: string): ContractPayload {
  const data = JSON.parse(raw) as unknown;
  return contractPayloadSchema.parse(data);
}

export const clientSignBodySchema = z.object({
  paymentMethod: z.enum(["cash", "cashapp", "zelle"]),
  agreeNonRefundableDeposit: z.literal(true),
  signatureDataUrl: z.string().min(100).max(600_000),
});

export const ownerSignBodySchema = z.object({
  signatureDataUrl: z.string().min(100).max(600_000),
});
