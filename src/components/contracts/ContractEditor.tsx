"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { ContractPayload, LineItem } from "@/lib/contracts/schema";
import { defaultPayload } from "@/lib/contracts/schema";
import type { ContractStatus } from "@/lib/contracts/constants";
import { DEPOSIT_CENTS } from "@/lib/contracts/constants";
import type { AppLocale } from "../../../i18n/locales";
import { SignaturePadField } from "./SignaturePadField";

type Initial = {
  id: number;
  publicId: string;
  status: string;
  locale: AppLocale;
  payload: ContractPayload;
};

function dollarsToCents(value: string): number {
  const n = Number.parseFloat(value);
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

const STATUS_LABEL_KEYS: Record<ContractStatus, string> = {
  draft: "statusDraft",
  sent: "statusSent",
  client_signed: "statusClientSigned",
  completed: "statusCompleted",
  void: "statusVoid",
};

type Props = {
  initial?: Initial | null;
};

export function ContractEditor({ initial }: Props) {
  const t = useTranslations("Contract");
  const router = useRouter();
  const [id, setId] = useState<number | null>(initial?.id ?? null);
  const [publicId, setPublicId] = useState<string | null>(initial?.publicId ?? null);
  const [status, setStatus] = useState<string>(initial?.status ?? "draft");
  const [locale, setLocale] = useState<AppLocale>(initial?.locale ?? "en");
  const [payload, setPayload] = useState<ContractPayload>(initial?.payload ?? defaultPayload());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ownerSig, setOwnerSig] = useState<string | null>(null);

  const subtotalCents = useMemo(
    () => payload.lineItems.reduce((s, it) => s + it.lineTotalCents, 0),
    [payload.lineItems]
  );

  const setField = useCallback(<K extends keyof ContractPayload>(key: K, value: ContractPayload[K]) => {
    setPayload((p) => ({ ...p, [key]: value, depositCents: DEPOSIT_CENTS }));
  }, []);

  const updateLine = useCallback((index: number, patch: Partial<LineItem>) => {
    setPayload((p) => {
      const lineItems = [...p.lineItems];
      const cur = lineItems[index] ?? { description: "", lineTotalCents: 0 };
      lineItems[index] = { ...cur, ...patch };
      return { ...p, lineItems, depositCents: DEPOSIT_CENTS };
    });
  }, []);

  const addLine = useCallback(() => {
    setPayload((p) => ({
      ...p,
      lineItems: [...p.lineItems, { description: "", lineTotalCents: 0 }],
      depositCents: DEPOSIT_CENTS,
    }));
  }, []);

  const removeLine = useCallback((index: number) => {
    setPayload((p) => ({
      ...p,
      lineItems: p.lineItems.filter((_, i) => i !== index),
      depositCents: DEPOSIT_CENTS,
    }));
  }, []);

  const saveDraft = async (): Promise<number | null> => {
    setError(null);
    setBusy(true);
    try {
      if (id == null) {
        const res = await fetch("/api/admin/contracts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale, payload }),
        });
        const data = (await res.json()) as { id?: number; public_id?: string; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Save failed");
        setId(data.id!);
        setPublicId(data.public_id!);
        setStatus("draft");
        router.replace(`/admin/contracts/${data.id}/edit`);
        router.refresh();
        return data.id!;
      }
      const res = await fetch(`/api/admin/contracts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      return id;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      return null;
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    setError(null);
    setBusy(true);
    try {
      let contractId = id;
      if (contractId == null) {
        const res = await fetch("/api/admin/contracts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale, payload }),
        });
        const data = (await res.json()) as { id?: number; public_id?: string; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Save failed");
        contractId = data.id!;
        setId(contractId);
        setPublicId(data.public_id!);
        setStatus("draft");
        router.replace(`/admin/contracts/${contractId}/edit`);
      } else {
        const res = await fetch(`/api/admin/contracts/${contractId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload }),
        });
        const patchData = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(patchData.error ?? "Save failed");
      }

      const pubRes = await fetch(`/api/admin/contracts/${contractId}/publish`, { method: "POST" });
      const pubData = (await pubRes.json()) as { error?: string; publicId?: string; public_id?: string };
      if (!pubRes.ok) throw new Error(pubData.error ?? "Publish failed");
      setStatus("sent");
      const pid = pubData.publicId ?? pubData.public_id;
      if (pid) setPublicId(pid);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    if (!publicId) return;
    const origin = window.location.origin;
    const url = `${origin}/c/${publicId}`;
    await navigator.clipboard.writeText(url);
  };

  const submitOwnerSign = async () => {
    if (id == null || !ownerSig) {
      setError(t("ownerSignRequired"));
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/contracts/${id}/owner-sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatureDataUrl: ownerSig }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Sign failed");
      setStatus("completed");
      setOwnerSig(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const pdfHref = publicId ? `/api/contracts/${publicId}/pdf` : null;

  const readOnly = status !== "draft";

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("editorTitle")}</h1>
        <div className="flex flex-wrap gap-2">
          {status === "draft" && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => saveDraft()}
                className="rounded-full bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-300 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                {t("saveDraft")}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => publish()}
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              >
                {t("publishSendLink")}
              </button>
            </>
          )}
          {(status === "sent" || status === "client_signed" || status === "completed") && publicId && (
            <button
              type="button"
              onClick={() => copyLink()}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              {t("copyClientLink")}
            </button>
          )}
          {status === "completed" && pdfHref && (
            <a
              href={pdfHref}
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              {t("downloadPdf")}
            </a>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-950 dark:ring-white/10">
        <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          {t("statusLabel")}:{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {t(STATUS_LABEL_KEYS[status as ContractStatus] ?? "statusDraft")}
          </span>
        </div>

        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t("contractLanguage")}</label>
        <select
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          value={locale}
          disabled={readOnly}
          onChange={(e) => setLocale(e.target.value as AppLocale)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field
            label={t("clientName")}
            value={payload.clientName}
            disabled={readOnly}
            onChange={(v) => setField("clientName", v)}
          />
          <Field
            label={t("eventDate")}
            value={payload.eventDate}
            disabled={readOnly}
            onChange={(v) => setField("eventDate", v)}
          />
          <Field
            label={t("phone")}
            value={payload.phone}
            disabled={readOnly}
            onChange={(v) => setField("phone", v)}
          />
          <Field
            label={t("timeRange")}
            value={payload.timeRange}
            disabled={readOnly}
            onChange={(v) => setField("timeRange", v)}
          />
        </div>
        <Field
          className="mt-4"
          label={t("address")}
          value={payload.address}
          disabled={readOnly}
          onChange={(v) => setField("address", v)}
        />
        <Field
          className="mt-4"
          label={t("notes")}
          value={payload.notes ?? ""}
          disabled={readOnly}
          onChange={(v) => setField("notes", v)}
        />

        <div className="mt-8">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold">{t("lineItems")}</h2>
            {!readOnly && (
              <button
                type="button"
                onClick={addLine}
                className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
              >
                {t("addLine")}
              </button>
            )}
          </div>
          <div className="mt-3 space-y-3">
            {payload.lineItems.length === 0 && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("noLineItems")}</p>
            )}
            {payload.lineItems.map((line, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200 dark:bg-black/30 dark:ring-zinc-800 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{t("description")}</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    value={line.description}
                    disabled={readOnly}
                    onChange={(e) => updateLine(i, { description: e.target.value })}
                  />
                </div>
                <div className="w-full sm:w-32">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{t("lineTotal")}</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    value={centsToDollars(line.lineTotalCents)}
                    disabled={readOnly}
                    onChange={(e) => updateLine(i, { lineTotalCents: dollarsToCents(e.target.value) })}
                  />
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => removeLine(i)}
                    className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                  >
                    {t("removeLine")}
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-1 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
            <div className="flex justify-between font-medium">
              <span>{t("subtotal")}</span>
              <span>{centsToDollars(subtotalCents)}</span>
            </div>
            <div className="flex justify-between font-semibold text-zinc-900 dark:text-zinc-100">
              <span>{t("depositLabel")}</span>
              <span>{centsToDollars(DEPOSIT_CENTS)}</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{t("depositNonRefundableShort")}</p>
          </div>
        </div>
      </div>

      {status === "client_signed" && (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-950 dark:ring-white/10">
          <h2 className="text-lg font-bold">{t("ownerSignTitle")}</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t("ownerSignHint")}</p>
          <SignaturePadField
            className="mt-4"
            label={t("ownerSignature")}
            clearLabel={t("clearSignature")}
            onChange={setOwnerSig}
          />
          <button
            type="button"
            disabled={busy || !ownerSig}
            onClick={() => submitOwnerSign()}
            className="mt-6 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
          >
            {t("completeContract")}
          </button>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{label}</label>
      <input
        className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
