import { ContractEditor } from "@/components/contracts/ContractEditor";
import { OwnerGuide } from "@/components/contracts/OwnerGuide";

export const dynamic = "force-dynamic";

export default function NewContractPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <OwnerGuide variant="compact" />
      </div>
      <ContractEditor />
    </>
  );
}
