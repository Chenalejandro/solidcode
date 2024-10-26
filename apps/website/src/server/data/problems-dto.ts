import "server-only";
import { db } from "@/server/db";
import {
  codeTemplates,
  problemExamples,
  problemTestCases,
  problems,
} from "@/server/db/schema/problems";
import { and, asc, count, eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";

export async function getAllProblems() {
  const allProblems = await db.query.problems.findMany({
    columns: {
      id: true,
      slug: true,
    },
    orderBy: [asc(problems.id)],
  });
  const titles = await getTranslations({
    locale: "es",
    namespace: "Titles",
  });
  return allProblems.map((problem) => ({
    title: titles(problem.slug),
    ...problem,
  }));
}

export type Problem = Awaited<ReturnType<typeof getAllProblems>>[number];

export async function getProblem(slug: string) {
  const problem = await db.query.problems.findFirst({
    columns: {
      id: true,
      slug: true,
    },
    where: eq(problems.slug, slug),
  });
  if (!problem) {
    return undefined;
  }
  const titles = await getTranslations({
    locale: "es",
    namespace: "Titles",
  });
  return { title: titles(problem.slug), ...problem };
}

export async function getProblemSlug(problemId: number) {
  const problem = await db.query.problems.findFirst({
    columns: {
      slug: true,
    },
    where: eq(problems.id, problemId),
  });
  if (!problem) {
    throw new Error("This error should never happend");
  }
  return problem.slug;
}

export async function getProblemExamples(problemId: number) {
  return db
    .select({
      description: problemExamples.description,
      input: problemTestCases.input,
      expectedResult: problemTestCases.expectedResult,
      orderNumber: problemTestCases.orderNumber,
    })
    .from(problemExamples)
    .innerJoin(
      problemTestCases,
      eq(problemExamples.problemTestCaseId, problemTestCases.id),
    )
    .where(eq(problemTestCases.problemId, problemId))
    .orderBy(problemTestCases.orderNumber);
}

export type ProblemExamples = Awaited<ReturnType<typeof getProblemExamples>>;

export async function getCodeTemplates(problemId: number) {
  return db.query.codeTemplates.findMany({
    columns: {
      problemId: true,
      languageId: true,
      submissionCode: true,
    },
    where: eq(codeTemplates.problemId, problemId),
  });
}

export type CodeTemplates = Awaited<ReturnType<typeof getCodeTemplates>>;

export async function getProblemTestCaseResults(problemId: number) {
  return db.query.problemTestCases.findMany({
    columns: { expectedResult: true, id: true },
    where: and(
      eq(problemTestCases.problemId, problemId),
      eq(problemTestCases.longRunningTest, false),
    ),
    orderBy: [asc(problemTestCases.id)],
  });
}

export async function getInputs(problemId: number) {
  const inputs = await db.query.problemTestCases.findMany({
    where: and(
      eq(problemTestCases.problemId, problemId),
      eq(problemTestCases.longRunningTest, false),
    ),
    columns: {
      input: true,
    },
    orderBy: [problemTestCases.id],
  });
  const numberOfInputs = inputs.length;
  const plainInputs = inputs.map((item) => item.input);
  return `${numberOfInputs}\n${plainInputs.join("\n")}`;
}

export async function getNumberOfTestCases(problemId: number) {
  const testCasesCountWrapper = await db
    .select({ value: count(problemTestCases.id) })
    .from(problemTestCases)
    .where(
      and(
        eq(problemTestCases.problemId, problemId),
        eq(problemTestCases.longRunningTest, false),
      ),
    );
  if (!testCasesCountWrapper[0]) {
    throw new Error("This error should never happend");
  }
  return testCasesCountWrapper[0].value;
}

export async function getFooterCode(problemId: number, languageId: number) {
  const codeTemplate = await db.query.codeTemplates.findFirst({
    columns: {
      footerCode: true,
    },
    where: and(
      eq(codeTemplates.problemId, problemId),
      eq(codeTemplates.languageId, languageId),
    ),
  });
  if (!codeTemplate) {
    throw new Error("This error should never happend");
  }
  return codeTemplate.footerCode;
}
