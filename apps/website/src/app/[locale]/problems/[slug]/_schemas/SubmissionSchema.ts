import { z } from "zod";
import { submissionStatuses } from "@/server/db/schema/submissions";

const StatusEnum = z.enum(submissionStatuses);

export type Status = z.infer<typeof StatusEnum>;

export const submissionResponseSchema = z.object({
  public_id: z.string(),
  status: StatusEnum,
});

export const futureJudgeResponseSchema = z.object({
  public_id: z.string(),
  stdout: z.string().nullable(),
  stderr: z.string().nullable(),
  result: z.string().nullable(),
  message: z.string().nullable(),
  status: StatusEnum,
  compile_output: z.string().nullable(),
  time: z.string().nullable(),
  memory: z.number().nullable(),
});

export type FutureJudgeResponseSchema = z.infer<
  typeof futureJudgeResponseSchema
>;
