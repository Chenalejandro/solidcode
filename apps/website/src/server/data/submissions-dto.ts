import "server-only";
import { type Status } from "@/app/[locale]/(main)/problems/[slug]/_schemas/SubmissionSchema";
import { db, dbWithTransaction } from "@/server/db";
import {
  submissionDatas,
  submissions,
  wrongSubmissionAnswerDatas,
} from "@/server/db/schema/submissions";
import { and, eq, sql, desc } from "drizzle-orm";
import { languages, languageVersions } from "../db/schema/languages";

export type FailedTestCaseInfo = {
  problemTestCaseId: number;
  output: string | undefined;
};

export async function saveSubmission(
  problemId: number,
  languageId: number,
  publicId: string,
  status: Status,
  userId: string,
  code: string,
) {
  await dbWithTransaction.transaction(async (transaction) => {
    const languageVersion = await transaction.query.languageVersions.findFirst({
      columns: { id: true },
      where: eq(languageVersions.languageId, languageId),
      orderBy: [desc(languageVersions.createdAt)],
    });
    if (!languageVersion) {
      throw new Error("this should never happen");
    }
    await transaction.insert(submissions).values({
      problemId: problemId,
      languageId,
      languageVersionId: languageVersion.id,
      publicId,
      status,
      userId,
      code,
    });
  });
}

export async function saveSubmissionResult(
  publicId: string,
  status: Status,
  compileOutput: string,
  message: string,
  stderr: string,
  stdout: string,
  result: string,
  time: string | null,
  memory: number | null,
  failedTestCases: FailedTestCaseInfo[],
) {
  await dbWithTransaction.transaction(async (transaction) => {
    const [submission] = await transaction
      .update(submissions)
      .set({
        status: status,
      })
      .where(eq(submissions.publicId, publicId))
      .returning();
    if (!submission) {
      throw new Error("This should never happend");
    }
    await transaction
      .insert(submissionDatas)
      .values({
        submissionId: submission.id,
        compileOutput: compileOutput,
        message: message,
        stderr: stderr,
        stdout: stdout,
        executionResult: result,
        executionTime: time,
        memoryUsage: memory,
      })
      .onConflictDoUpdate({
        target: submissionDatas.submissionId,
        set: {
          compileOutput: compileOutput,
          message: message,
          stderr: stderr,
          stdout: stdout,
          executionResult: result,
          executionTime: time,
          memoryUsage: memory,
        },
      });
    if (failedTestCases.length !== 0) {
      await transaction.insert(wrongSubmissionAnswerDatas).values(
        failedTestCases.map((failedTestCase) => ({
          ...failedTestCase,
          submissionId: submission.id,
        })),
      );
    }
  });
}

export async function getProblemIdFromPublicId(publicId: string) {
  const problemIdWrapper = await db.query.submissions.findFirst({
    columns: { problemId: true },
    where: eq(submissions.publicId, publicId),
  });
  if (!problemIdWrapper) {
    // This condition should never happen
    throw new Error("Cannot find the problemId of the submission");
  }
  return problemIdWrapper.problemId;
}

export async function getSubmissionBy(userId: string, publicId: string) {
  return db.query.submissions.findFirst({
    where: and(
      eq(submissions.userId, userId),
      eq(submissions.publicId, publicId),
    ),
    columns: {
      publicId: true,
      status: true,
      problemId: true,
    },
    with: {
      submissionData: {
        columns: {
          stdout: true,
          stderr: true,
          message: true,
          compileOutput: true,
          executionTime: true,
          memoryUsage: true,
        },
      },
      wrongAnswerDatas: {
        columns: {
          output: true,
        },
        with: {
          testCase: {
            columns: {
              orderNumber: true,
              expectedResult: true,
              input: true,
            },
          },
        },
      },
    },
  });
}

export async function getSubmissions(problemId: number, userId: string) {
  return db
    .select({
      publicId: submissions.publicId,
      status: submissions.status,
      updatedAt: submissions.updatedAt,
      languageId: submissions.languageId,
      languageName: languages.name,
      memoryUsage: submissionDatas.memoryUsage,
      executionTime: submissionDatas.executionTime,
    })
    .from(submissions)
    .innerJoin(
      submissionDatas,
      eq(submissions.id, submissionDatas.submissionId),
    )
    .innerJoin(languages, eq(submissions.languageId, languages.id))
    .where(
      and(eq(submissions.problemId, problemId), eq(submissions.userId, userId)),
    )
    .orderBy(desc(submissions.updatedAt));
}

export type UserSubmission = Awaited<ReturnType<typeof getSubmissions>>[number];
