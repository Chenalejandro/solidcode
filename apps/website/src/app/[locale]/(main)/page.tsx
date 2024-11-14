import { getAllProblems } from "@/server/data/problems-dto";
import { ProblemDataTable } from "@/app/_components/ProblemDataTable";
import { problemColumns } from "@/app/_components/ProblemColumns";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { type ResolvingMetadata, type Metadata } from "next";

export const dynamic = "force-static";

export async function generateMetadata(
  props: { params: Promise<{ locale: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "App" });
  return {
    title: t("title"),
    description: t("description"),
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  "use memo";
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  const problems = await getAllProblems();
  return (
    <main className="p-10">
      <ProblemDataTable columns={problemColumns} data={problems} />
    </main>
  );
}
