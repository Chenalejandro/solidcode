import { futureJudgeResponseSchema } from "@/app/[locale]/problems/[slug]/_schemas/SubmissionSchema";
import { textDecoder } from "@/lib/utils";
import { Webhook } from "svix";
import {
  type FailedTestCaseInfo,
  saveSubmissionResult,
  getProblemIdFromPublicId,
} from "@/server/data/submissions-dto";
import { getProblemTestCaseResults } from "@/server/data/problems-dto";
import { env } from "@/env";

export async function POST(request: Request) {
  const text = await request.text();
  const webhook = new Webhook(env.SVIX_WEBHOOK_SECRET);
  const svixHeaders = {
    "svix-id": request.headers.get("svix-id") ?? "",
    "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    "svix-signature": request.headers.get("svix-signature") ?? "",
  };
  let json: unknown;
  try {
    json = webhook.verify(text, svixHeaders);
  } catch (error) {
    return new Response("Bad request", { status: 401 });
  }
  const submissionResponseJson = futureJudgeResponseSchema.safeParse(json);
  if (!submissionResponseJson.success) {
    console.error(submissionResponseJson.error.issues);
    return new Response("The schema validation failed");
  }
  const {
    public_id,
    compile_output: encodedCompileOutput,
    message: encodedMessage,
    stderr: encodedStderr,
    stdout: encodedStdout,
    result: encodedResult,
    time,
    memory,
  } = submissionResponseJson.data;
  // FIXME: we need to mutate the status since we can have a submission that
  // has been "accepted" (which means it dit not encounter any error)
  // but the result does not match the expected result.
  let { status } = submissionResponseJson.data;

  const compileOutput = encodedCompileOutput
    ? textDecoder(encodedCompileOutput)
    : "";
  const message = encodedMessage ? textDecoder(encodedMessage) : "";
  const stderr = encodedStderr ? textDecoder(encodedStderr) : "";
  const stdout = encodedStdout ? textDecoder(encodedStdout) : "";
  const result = encodedResult ? textDecoder(encodedResult) : "";

  try {
    const failedTestCases: FailedTestCaseInfo[] = [];
    if (status === "accepted") {
      const problemId = await getProblemIdFromPublicId(public_id);
      const testCaseResults = await getProblemTestCaseResults(problemId);

      // Compare the expected result with the actual result
      const results = result.split("\n");
      for (const [index, testCaseResult] of testCaseResults.entries()) {
        const output = results[index];
        if (testCaseResult.expectedResult !== output) {
          status = "wrong_answer";
          failedTestCases.push({
            problemTestCaseId: testCaseResult.id,
            output,
          });
        }
      }
    }
    await saveSubmissionResult(
      public_id,
      status,
      compileOutput,
      message,
      stderr,
      stdout,
      result,
      time,
      memory,
      failedTestCases,
    );
  } catch (error) {
    console.error(error);
    return new Response("The submission could not be updated");
  }

  return new Response("success");
}
