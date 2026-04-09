import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { PublicContractView } from "@/components/contracts/PublicContractView";
import { getContractByPublicId } from "@/lib/contracts/repo";
import { toPublicContractJson } from "@/lib/contracts/public-view";
import { isAppLocale } from "../../../../i18n/locales";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ publicId: string }> };

export default async function PublicContractPage({ params }: PageProps) {
  const { publicId } = await params;
  if (!publicId || publicId.length > 64) notFound();

  const row = await getContractByPublicId(publicId);
  const view = row ? toPublicContractJson(row) : null;
  if (!view) notFound();

  const locale = isAppLocale(view.locale) ? view.locale : "en";
  const messages = (await import(`../../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PublicContractView publicId={publicId} initial={view} />
    </NextIntlClientProvider>
  );
}
