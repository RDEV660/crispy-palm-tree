import { notFound } from "next/navigation";
import { ContractEditor } from "@/components/contracts/ContractEditor";
import { OwnerGuide } from "@/components/contracts/OwnerGuide";
import { getContractById, rowPayload } from "@/lib/contracts/repo";
import { isAppLocale } from "../../../../../../../i18n/locales";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditContractPage({ params }: PageProps) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id) || id < 1) notFound();

  const row = await getContractById(id);
  if (!row) notFound();

  const loc = isAppLocale(row.locale) ? row.locale : "en";

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <OwnerGuide variant="compact" />
      </div>
      <ContractEditor
        key={`${row.id}-${row.status}-${row.updated_at}`}
        initial={{
          id: row.id,
          publicId: row.public_id,
          status: row.status,
          locale: loc,
          payload: rowPayload(row),
        }}
      />
    </>
  );
}
