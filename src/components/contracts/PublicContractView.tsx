"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PublicContractResponse } from "@/lib/contracts/public-view";
import { DEPOSIT_CENTS } from "@/lib/contracts/constants";
import { SignaturePadField } from "./SignaturePadField";
import { SocialLinks } from "@/components/SocialLinks";

type Props = {
  publicId: string;
  initial: PublicContractResponse;
};

function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function PublicContractView({ publicId, initial }: Props) {
  const t = useTranslations("Contract");
  const router = useRouter();
  const [view, setView] = useState(initial);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "cashapp" | "zelle" | "">("");
  const [agree, setAgree] = useState(false);
  const [sig, setSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const subtotal = view.payload.lineItems.reduce((s, it) => s + it.lineTotalCents, 0);

  const submitClient = async () => {
    setError(null);
    if (!paymentMethod) {
      setError(t("pickPayment"));
      return;
    }
    if (!agree) {
      setError(t("mustAgreeDeposit"));
      return;
    }
    if (!sig) {
      setError(t("signatureRequired"));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/contracts/${publicId}/sign-client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          agreeNonRefundableDeposit: true as const,
          signatureDataUrl: sig,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      router.refresh();
      setView((v) => ({
        ...v,
        status: "client_signed",
        payload: { ...v.payload, paymentMethod },
        clientSignatureDataUrl: sig,
        clientSignedAt: Date.now(),
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const pdfHref = `/api/contracts/${publicId}/pdf`;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="text-lg font-bold tracking-tight text-pink-600">Ohana Events</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">(956) 703-2804</div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-extrabold tracking-tight">{t("publicTitle")}</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t("publicSubtitle")}</p>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-950 dark:ring-white/10">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {t("eventDetails")}
          </h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-zinc-600 dark:text-zinc-400">{t("clientName")}</dt>
              <dd>{view.payload.clientName || "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-600 dark:text-zinc-400">{t("eventDate")}</dt>
              <dd>{view.payload.eventDate || "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-600 dark:text-zinc-400">{t("phone")}</dt>
              <dd>{view.payload.phone || "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-600 dark:text-zinc-400">{t("timeRange")}</dt>
              <dd>{view.payload.timeRange || "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-semibold text-zinc-600 dark:text-zinc-400">{t("address")}</dt>
              <dd>{view.payload.address || "—"}</dd>
            </div>
            {view.payload.notes && (
              <div className="sm:col-span-2">
                <dt className="font-semibold text-zinc-600 dark:text-zinc-400">{t("notes")}</dt>
                <dd>{view.payload.notes}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-950 dark:ring-white/10">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {t("lineItems")}
          </h2>
          <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
            {view.payload.lineItems.length === 0 && <li className="py-2 text-sm text-zinc-500">—</li>}
            {view.payload.lineItems.map((line, i) => (
              <li key={i} className="flex justify-between gap-4 py-3 text-sm">
                <span>{line.description || "—"}</span>
                <span className="shrink-0 font-medium">${centsToDollars(line.lineTotalCents)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
            <div className="flex justify-between font-medium">
              <span>{t("subtotal")}</span>
              <span>${centsToDollars(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between font-semibold">
              <span>{t("depositLabel")}</span>
              <span>${centsToDollars(DEPOSIT_CENTS)}</span>
            </div>
          </div>
        </section>

        {view.status === "sent" && (
          <section className="mt-6 rounded-3xl bg-amber-50 p-6 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-900/40">
            <h2 className="text-lg font-bold text-amber-950 dark:text-amber-100">{t("depositClauseTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-amber-900/90 dark:text-amber-100/90">
              {t("depositClauseBody")}
            </p>
            <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm font-medium text-amber-950 dark:text-amber-50">
              <input
                type="checkbox"
                className="mt-1 size-4 rounded border-amber-400"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>{t("depositAckCheckbox")}</span>
            </label>
          </section>
        )}

        {view.status === "sent" && (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-950 dark:ring-white/10">
            <h2 className="text-lg font-bold">{t("paymentMethodTitle")}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t("paymentMethodHint")}</p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              {(["cash", "cashapp", "zelle"] as const).map((m) => (
                <label key={m} className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
                  <input
                    type="radio"
                    name="pay"
                    value={m}
                    checked={paymentMethod === m}
                    onChange={() => setPaymentMethod(m)}
                  />
                  <span>
                    {m === "cash" && t("paymentCash")}
                    {m === "cashapp" && t("paymentCashApp")}
                    {m === "zelle" && t("paymentZelle")}
                  </span>
                </label>
              ))}
            </div>
          </section>
        )}

        {view.status === "sent" && (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-950 dark:ring-white/10">
            <SignaturePadField label={t("yourSignature")} clearLabel={t("clearSignature")} onChange={setSig} />
            {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="button"
              disabled={busy}
              onClick={() => submitClient()}
              className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 sm:w-auto sm:px-8"
            >
              {busy ? t("submitting") : t("signAndSubmit")}
            </button>
          </section>
        )}

        {view.status === "client_signed" && (
          <div className="mt-8 rounded-3xl bg-zinc-900 px-6 py-6 text-white dark:bg-white dark:text-zinc-950">
            <p className="font-semibold">{t("waitingOwner")}</p>
            <p className="mt-2 text-sm opacity-90">{t("waitingOwnerHint")}</p>
          </div>
        )}

        {view.status === "completed" && (
          <div className="mt-8 space-y-4 rounded-3xl bg-emerald-50 p-6 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:ring-emerald-900/50">
            <p className="font-semibold text-emerald-900 dark:text-emerald-100">{t("completedThanks")}</p>
            <a
              href={pdfHref}
              className="inline-flex rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              {t("downloadPdf")}
            </a>
          </div>
        )}

        <footer className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm font-semibold text-zinc-600 dark:text-zinc-400">{t("followSocials")}</p>
          <div className="mt-3 flex justify-center">
            <SocialLinks />
          </div>
        </footer>
      </main>
    </div>
  );
}
