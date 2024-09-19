"use server";
import { notAuthenticatedError } from "@/app/[locale]/problems/[slug]/_errors";
import { getSubmissionBy } from "@/server/data/submissions-dto";
import { getNumberOfTestCases } from "@/server/data/problems-dto";
import { stackServerApp } from "@/stack";
import { z } from "zod";

export type SubmissionData = Awaited<
  ReturnType<typeof getSubmission>
>["submission"]["submissionData"];
export type WrongAnswerDatas = Awaited<
  ReturnType<typeof getSubmission>
>["submission"]["wrongAnswerDatas"];

const publicIdSchema = z.string();

export async function getSubmission(publicIdNotParsed: unknown) {
  const user = await stackServerApp.getUser();
  if (!user) {
    console.error("User is not authenticated");
    throw new Error(notAuthenticatedError.message);
  }
  const publicId = publicIdSchema.parse(publicIdNotParsed);
  const submission = await getSubmissionBy(user.id, publicId);
  if (!submission) {
    console.error(
      `Couldn't find the submission with id ${publicId} and userId ${user.id}`,
    );
    throw new Error("Cannot find the submission");
  }
  if (submission.status === "queued" || submission.status === "processing") {
    return { submission };
  }
  const problemId = submission.problemId;
  const testCasesCount = await getNumberOfTestCases(problemId);
  submission.wrongAnswerDatas.sort((wrongAnswerData1, wrongAnswerData2) => {
    if (
      wrongAnswerData1.testCase.orderNumber <
      wrongAnswerData2.testCase.orderNumber
    ) {
      return -1;
    } else if (
      wrongAnswerData1.testCase.orderNumber >
      wrongAnswerData2.testCase.orderNumber
    ) {
      return 1;
    } else {
      return 0;
    }
  });
  return { submission, testCasesCount };
}
