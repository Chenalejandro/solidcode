import { relations, sql } from "drizzle-orm";
import { createTable } from "../utils";
import {
  integer,
  pgEnum,
  smallint,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { submissions } from "./submissions";

export const monacoLanguages = ["cpp", "php", "javascript", "python"] as const;

export const monacoLanguagesEnum = pgEnum("monaco_languages", monacoLanguages);

export const languages = createTable("languages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  externalId: integer("external_id").notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  monacoName: monacoLanguagesEnum("monaco_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
});

export const languagesRelations = relations(languages, ({ many }) => ({
  submissions: many(submissions),
  languageVersions: many(languageVersions),
}));

export const languageVersions = createTable(
  "language_versions",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    languageId: integer("language_id").notNull(),
    majorVersion: smallint("major_version").notNull(),
    minorVersion: smallint("minor_version").notNull(),
    patchVersion: smallint("patch_version").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (languageVersionsTable) => ({
    uniqueVersion: unique("unique_version").on(
      languageVersionsTable.languageId,
      languageVersionsTable.majorVersion,
      languageVersionsTable.minorVersion,
      languageVersionsTable.patchVersion,
    ),
  }),
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
