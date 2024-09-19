import { getAllProblems } from "@/server/data/problems-dto";
import { ProblemDataTable } from "../_components/ProblemDataTable";
import { problemColumns } from "../_components/ProblemColumns";
import { unstable_setRequestLocale } from "next-intl/server";

export const dynamic = "force-static";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const problems = await getAllProblems();
  return (
    <main className="p-10">
      <ProblemDataTable columns={problemColumns} data={problems} />
    </main>
  );
}
