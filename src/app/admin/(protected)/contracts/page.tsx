import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { OwnerGuide } from "@/components/contracts/OwnerGuide";
import type { ContractStatus } from "@/lib/contracts/constants";
import { listContracts, rowPayload } from "@/lib/contracts/repo";

export const dynamic = "force-dynamic";

const STATUS_LABEL_KEYS: Record<ContractStatus, string> = {
  draft: "statusDraft",
  sent: "statusSent",
  client_signed: "statusClientSigned",
  completed: "statusCompleted",
  void: "statusVoid",
};

function statusLabelKey(status: string): string {
  return STATUS_LABEL_KEYS[status as ContractStatus] ?? "statusDraft";
}

export default async function AdminContractsListPage() {
  const t = await getTranslations("Contract");
  const rows = await listContracts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <OwnerGuide variant="card" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("listTitle")}</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t("listSubtitle")}</p>
        </div>
        <Link
          href="/admin/contracts/new"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
        >
          {t("newContract")}
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-950 dark:ring-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">{t("clientName")}</th>
              <th className="px-4 py-3">{t("eventDate")}</th>
              <th className="px-4 py-3">{t("statusLabel")}</th>
              <th className="px-4 py-3">{t("updated")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  {t("emptyList")}
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const p = rowPayload(r);
              return (
                <tr key={r.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
                  <td className="px-4 py-3 font-medium">{p.clientName || "—"}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{p.eventDate || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold dark:bg-zinc-800">
                      {t(statusLabelKey(r.status))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {new Date(r.updated_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/contracts/${r.id}/edit`}
                      className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      {t("open")}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
