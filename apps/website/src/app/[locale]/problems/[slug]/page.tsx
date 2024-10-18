import { notFound } from "next/navigation";
import { getCodeTemplates, getProblem } from "@/server/data/problems-dto";
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

export type ClientUser = Awaited<ReturnType<typeof getClientUser>>;

export default async function ProblemPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { selectedTab: string };
}) {
  const { selectedTab } = searchParams;
  const { device } = userAgent({ headers: headers() });
  const problem = await validateAndGetProblem(params.slug);
  const codeTemplates = await getCodeTemplates(problem.id);
  const languages = await getLanguages();
  const clientUser = await getClientUser();
  const horizontalLayout = cookies().get("horizontalLayout");
  const verticalSubLayout = cookies().get("verticalSubLayout");
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
        <GeneralInformation
          problemSlug={problem.slug}
          problemId={problem.id}
        />
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
