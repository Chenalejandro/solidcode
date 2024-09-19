import {
  timestamp,
  text,
  integer,
  varchar,
  pgEnum,
  decimal,
} from "drizzle-orm/pg-core";
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

export const submissions = createTable("submissions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull(),
  problemId: integer("problem_id").notNull(),
  publicId: varchar("public_id", { length: 12 }).notNull().unique(),
  languageId: integer("language_id").notNull(),
  languageVersionId: integer("language_version_id").notNull(),
  code: text("code").notNull(),
  status: submissionStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
});

export const wrongSubmissionAnswerDatas = createTable(
  "wrong_submission_answer_datas",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    submissionId: integer("submission_id"),
    output: text("output"),
    problemTestCaseId: integer("problem_testCase_id").notNull(),
  },
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

export const submissionDatas = createTable("submission_datas", {
  submissionId: integer("submission_id").primaryKey(),
  executionResult: text("execution_result"),
  stdout: text("stdout"),
  stderr: text("stderr"),
  message: text("message"),
  compileOutput: text("compile_output"),
  executionTime: decimal("execution_time"),
  memoryUsage: integer("memory_usage"),
});

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
