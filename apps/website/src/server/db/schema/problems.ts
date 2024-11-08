import { primaryKey, unique } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createTable } from "../utils";
import { submissions, wrongSubmissionAnswerDatas } from "./submissions";

export const problems = createTable("problems", (t) => ({
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: t.text().notNull().unique(),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
}));

export const problemTestCases = createTable(
  "problem_test_cases",
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    problemId: t.integer().notNull(),
    orderNumber: t.smallint().notNull(),
    longRunningTest: t.boolean().notNull().default(false),
    input: t.text().notNull(),
    expectedResult: t.text().notNull(),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
      .timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => sql`now()`)
      .notNull(),
  }),
  (testCasesTable) => [
    unique("unique_ordering").on(
      testCasesTable.problemId,
      testCasesTable.orderNumber,
    ),
  ],
);

export const problemExamples = createTable("problem_examples", (t) => ({
  problemTestCaseId: t.integer().primaryKey(),
  description: t.text(),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
}));

export const codeTemplates = createTable(
  "code_templates",
  (t) => ({
    problemId: t.integer().notNull(),
    languageId: t.integer().notNull(),
    submissionCode: t.text().notNull(),
    footerCode: t.text().notNull(),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
      .timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => sql`now()`)
      .notNull(),
  }),
  (table) => [primaryKey({ columns: [table.problemId, table.languageId] })],
);

export const problemsRelations = relations(problems, ({ many }) => ({
  testCases: many(problemTestCases),
  submissions: many(submissions),
}));

export const problemTestCasesRelations = relations(
  problemTestCases,
  ({ one, many }) => ({
    problem: one(problems, {
      fields: [problemTestCases.problemId],
      references: [problems.id],
    }),
    example: one(problemExamples, {
      fields: [problemTestCases.id],
      references: [problemExamples.problemTestCaseId],
    }),
    wrongAnswers: many(wrongSubmissionAnswerDatas),
  }),
);

export const problemExamplesRelations = relations(
  problemExamples,
  ({ one }) => ({
    problemTestCase: one(problemTestCases, {
      fields: [problemExamples.problemTestCaseId],
      references: [problemTestCases.id],
    }),
  }),
);
