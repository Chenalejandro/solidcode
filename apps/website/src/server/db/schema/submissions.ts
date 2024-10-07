import { pgEnum, decimal } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { problems, problemTestCases } from "./problems";
import { createTable } from "../utils";
import { languages } from "./languages";

export const submissionStatuses = [
  "queued",
  "processing",
  "accepted",
  "wrong_answer",
  "time_limit_exceeded",
  "compilation_error",
  "sig_segv",
  "sig_xfsz",
  "sig_fpe",
  "sig_abrt",
  "non_zero_exit_code",
  "runtime_error",
  "boxerr",
  "exeerr",
] as const;

export const submissionStatusEnum = pgEnum(
  "submission_status",
  submissionStatuses,
);

export const submissions = createTable("submissions", (t) => ({
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: t.text().notNull(),
  problemId: t.integer().notNull(),
  publicId: t.varchar("public_id", { length: 12 }).notNull().unique(),
  languageId: t.integer().notNull(),
  languageVersionId: t.integer().notNull(),
  code: t.text().notNull(),
  status: submissionStatusEnum().notNull(),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
}));

export const wrongSubmissionAnswerDatas = createTable(
  "wrong_submission_answer_datas",
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    submissionId: t.integer(),
    output: t.text(),
    problemTestCaseId: t.integer().notNull(),
  }),
);

export const wrongSubmissionAnswerDatasRelations = relations(
  wrongSubmissionAnswerDatas,
  ({ one }) => ({
    submission: one(submissions, {
      fields: [wrongSubmissionAnswerDatas.submissionId],
      references: [submissions.id],
    }),
    testCase: one(problemTestCases, {
      fields: [wrongSubmissionAnswerDatas.problemTestCaseId],
      references: [problemTestCases.id],
    }),
  }),
);

export const submissionDatas = createTable("submission_datas", (t) => ({
  submissionId: t.integer().primaryKey(),
  executionResult: t.text(),
  stdout: t.text(),
  stderr: t.text(),
  message: t.text(),
  compileOutput: t.text(),
  executionTime: decimal(),
  memoryUsage: t.integer(),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  language: one(languages, {
    fields: [submissions.languageId],
    references: [languages.id],
  }),
  problem: one(problems, {
    fields: [submissions.problemId],
    references: [problems.id],
  }),
  submissionData: one(submissionDatas, {
    fields: [submissions.id],
    references: [submissionDatas.submissionId],
  }),
  wrongAnswerDatas: many(wrongSubmissionAnswerDatas),
}));

export const submissionDatasRelations = relations(
  submissionDatas,
  ({ one }) => ({
    submission: one(submissions, {
      fields: [submissionDatas.submissionId],
      references: [submissions.id],
    }),
  }),
);
