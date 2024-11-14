"use server";
import { codeSubmissionSchema } from "@/app/[locale]/(main)/problems/[slug]/_schemas/CodeSchema";
import { env } from "@/env";
import { textEncoder } from "@/lib/utils";
import { submissionResponseSchema } from "@/app/[locale]/(main)/problems/[slug]/_schemas/SubmissionSchema";
import { saveSubmission } from "@/server/data/submissions-dto";
import { getFooterCode, getInputs } from "@/server/data/problems-dto";
import { getExternalLanguageId } from "@/server/data/languages-dto";
import { stackServerApp } from "@/stack";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(env.RATE_LIMIT_COUNT, "3600 s"),
});

export async function codeSubmissionAction(data: unknown) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return {
      status: "error",
      problem: {
        title: "You are not authenticated",
        detail: "You need to sign in to submit a code.",
      },
    } as const;
  }

  const identifier = `${user.id}-codeSubmission`;
  const { success, pending, limit, reset, remaining } =
    await ratelimit.limit(identifier);
  if (!success) {
    return {
      status: "error",
      problem: {
        title: "Rate limited",
        description: "Rate limit exceeded. Try again after an hour.",
      },
    } as const;
  }
  const parsedResult = codeSubmissionSchema.safeParse(data);
  if (!parsedResult.success) {
    console.error(parsedResult.data);
    console.error(parsedResult.error);
    return {
      status: "error",
      problem: {
        title: "Invalid data",
        detail: "The data you submitted is invalid.",
      },
    } as const;
  }
  const { code, languageId, problemId } = parsedResult.data;
  const externalLanguageId = await getExternalLanguageId(languageId);
  const stdIn = await getInputs(problemId);
  const footerCode = await getFooterCode(problemId, languageId);
  const response = await fetch(`${env.FUTURE_JUDGE_API_URL}/submissions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.FUTUREJUDGE_TOKEN}`,
    },
    method: "POST",
    body: JSON.stringify({
      language_id: externalLanguageId,
      source_code: textEncoder(`${code}\n${footerCode}`),
      stdin: textEncoder(stdIn),
    }),
  });
  if (!response.ok) {
    console.error(response);
    return {
      status: "error",
      problem: {
        title: "Response from the api server was not ok",
        detail:
          "The response from the api server was not ok. Maybe the api server is down.",
      },
    } as const;
  }
  const json: unknown = await response.json();
  const submissionResponse = submissionResponseSchema.safeParse(json);
  if (!submissionResponse.success) {
    console.error(submissionResponse.error.issues);
    return {
      status: "error",
      problem: {
        title: "Invalid api response",
        detail: "The api response schema is invalid.",
      },
    } as const;
  }
  await saveSubmission(
    problemId,
    languageId,
    submissionResponse.data.public_id,
    submissionResponse.data.status,
    user.id,
    code,
  );

  return {
    status: "success",
    public_id: submissionResponse.data.public_id,
  } as const;
}
