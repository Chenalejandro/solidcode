import { relations, sql } from "drizzle-orm";
import { createTable } from "../utils";
import { pgEnum, unique } from "drizzle-orm/pg-core";
import { submissions } from "./submissions";

export const monacoLanguages = ["cpp", "php", "javascript", "python"] as const;

export const monacoLanguagesEnum = pgEnum("monaco_languages", monacoLanguages);

export const languages = createTable("languages", (t) => ({
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  externalId: t.integer("external_id").notNull().unique(),
  name: t.varchar({ length: 256 }).notNull(),
  monacoName: monacoLanguagesEnum().notNull(),
  createdAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date())
    .notNull(),
}));

export const languagesRelations = relations(languages, ({ many }) => ({
  submissions: many(submissions),
  languageVersions: many(languageVersions),
}));

export const languageVersions = createTable(
  "language_versions",
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    languageId: t.integer().notNull(),
    majorVersion: t.smallint().notNull(),
    minorVersion: t.smallint().notNull(),
    patchVersion: t.smallint().notNull(),
    createdAt: t.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  }),
  (languageVersionsTable) => [
    unique("unique_version").on(
      languageVersionsTable.languageId,
      languageVersionsTable.majorVersion,
      languageVersionsTable.minorVersion,
      languageVersionsTable.patchVersion,
    ),
  ],
);

export const languageVersionsRelations = relations(
  languageVersions,
  ({ one }) => ({
    language: one(languages, {
      fields: [languageVersions.languageId],
      references: [languages.id],
    }),
  }),
);
