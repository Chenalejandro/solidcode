import { notFound } from "next/navigation";
import {
  getAllProblems,
  getCodeTemplates,
  getProblem,
} from "@/server/data/problems-dto";
import { cookies, headers } from "next/headers";
import { getLanguages } from "@/server/data/languages-dto";
import { userAgent } from "next/server";
import GeneralInformation from "./_components/GeneralInformation";
import { stackServerApp } from "@/stack";
import { ResizeablePanel } from "./_components/resizeable-panel";

async function getClientUser() {
  const user = await stackServerApp.getUser();
  return user?.toClientJson();
}

export const dynamicParams = false;

export async function generateStaticParams({ params: { locale } }: { params: { locale: string } }) {
  const problems = await getAllProblems();
  return problems.map((problem) => ({ slug: problem.slug }));
}

export type ClientUser = Awaited<ReturnType<typeof getClientUser>>;

export default async function ProblemPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const problem = await validateAndGetProblem(params.slug);
  const codeTemplatesData = getCodeTemplates(problem.id);
  const languagesData = getLanguages();
  const clientUserData = getClientUser();
  const cookieStoreData = cookies();
  const headerStoreData = headers();
  const [codeTemplates, languages, clientUser, cookieStore, headerStore] =
    await Promise.all([
      codeTemplatesData,
      languagesData,
      clientUserData,
      cookieStoreData,
      headerStoreData,
    ]);
  const { device } = userAgent({ headers: headerStore });
  const horizontalLayout = cookieStore.get("horizontalLayout");
  const verticalSubLayout = cookieStore.get("verticalSubLayout");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const defaultHorizontalLayout: number[] = horizontalLayout
    ? JSON.parse(horizontalLayout.value)
    : [33, 67];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const defaultVerticalSubLayout: number[] = verticalSubLayout
    ? JSON.parse(verticalSubLayout.value)
    : [67, 33];
  if (device.type === "mobile") {
    return (
      <main className="flex min-h-0 flex-grow flex-col">
        <GeneralInformation problemSlug={problem.slug} problemId={problem.id} />
      </main>
    );
  }
  return (
    <main className="flex min-h-0 flex-grow flex-col">
      <ResizeablePanel
        user={clientUser}
        defaultHorizontalLayout={defaultHorizontalLayout}
        defaultVerticalSubLayout={defaultVerticalSubLayout}
        problem={problem}
        codeTemplates={codeTemplates}
        languages={languages}
        generalInformation={
          <GeneralInformation
            problemSlug={problem.slug}
            problemId={problem.id}
          />
        }
      />
    </main>
  );
}

async function validateAndGetProblem(slug: string) {
  const problem = await getProblem(slug);
  if (!problem) {
    notFound();
  }
  return problem;
}
