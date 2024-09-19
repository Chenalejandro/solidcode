import {
  index,
  timestamp,
  text,
  primaryKey,
  integer,
  smallint,
  unique,
  boolean,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createTable } from "../utils";
import { submissions, wrongSubmissionAnswerDatas } from "./submissions";

export const problems = createTable("problems", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
});

export const problemTestCases = createTable(
  "problem_test_cases",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    problemId: integer("problem_id").notNull(),
    orderNumber: smallint("order_number").notNull(),
    longRunningTest: boolean("long_running_test").notNull().default(false),
    input: text("input").notNull(),
    expectedResult: text("expected_result").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => sql`now()`)
      .notNull(),
  },
  (testCasesTable) => ({
    uniqueOrdering: unique("unique_ordering").on(
      testCasesTable.problemId,
      testCasesTable.orderNumber,
    ),
  }),
);

export const problemExamples = createTable("problem_examples", {
  problemTestCaseId: integer("problem_test_case_id").primaryKey(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
});

export const codeTemplates = createTable(
  "code_templates",
  {
    problemId: integer("problem_id").notNull(),
    languageId: integer("language_id").notNull(),
    submissionCode: text("submission_code").notNull(),
    footerCode: text("footer_code").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => sql`now()`)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.problemId, table.languageId] }),
    };
  },
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
