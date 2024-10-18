import {
  codeTemplates,
  problems,
  problemTestCases,
} from "@/server/db/schema/problems";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@/env";
import { readFileSync } from "node:fs";
import path from "path";
import {
  languages,
  languageVersions,
  monacoLanguages,
} from "./schema/languages";
import { z } from "zod";
import { sql, type InferSelectModel } from "drizzle-orm";

const client = postgres(env.DATABASE_URL);
const db = drizzle(client, { casing: "snake_case" });

const languageSchema = z.object({
  id: z.number().positive(),
  name: z.string(),
  monaco_name: z.enum(monacoLanguages),
  major: z.number().nonnegative(),
  minor: z.number().nonnegative(),
  patch: z.number().nonnegative(),
});

const languagesSchema = z.array(languageSchema).nonempty();

async function getLanguages() {
  const response = await fetch(env.FUTURE_JUDGE_API_URL + "/languages", {
    headers: {
      Authorization: `Bearer ${env.FUTUREJUDGE_TOKEN}`,
    },
  });
  if (!response.ok) {
    console.log(response);
    throw new Error("The response was not ok");
  }
  const json: unknown = await response.json();
  return languagesSchema.parse(json);
}

type LanguageModel = InferSelectModel<typeof languages>;

async function main() {
  const __dirname = import.meta.dirname;
  const futureJudgeLanguages = await getLanguages();
  const t = {
    "reverse-the-array": "revertir-el-arreglo",
    "most-even-cut": "corte-mas-parejo",
    "maximum-length-of-songs-on-cd": "maxima-duracion-de-canciones-en-cd",
    "most-gain-cut": "corte-de-mayor-ganancia",
    "in-order-binary-tree-traversal": "recorrido-del-arbol-binario-en-orden",
    "dice-sum": "suma-de-los-dados",
    "split-students-into-groups": "dividir-estudiantes-en-grupos",
    "highest-profit-path": "camino-de-mayor-ganancia",
    "water-containers": "recipientes-de-agua",
    "invert-a-binary-tree": "invertir-arbol-binario",
  };
  await db.transaction(async (transaction) => {
    const insertedLanguages: LanguageModel[] = [];
    for (const futureJudgeLanguage of futureJudgeLanguages) {
      const [returnedLanguage] = await transaction
        .insert(languages)
        .values({
          externalId: futureJudgeLanguage.id,
          name: futureJudgeLanguage.name,
          monacoName: futureJudgeLanguage.monaco_name,
        })
        .onConflictDoUpdate({
          target: languages.externalId,
          set: {
            name: futureJudgeLanguage.name,
            monacoName: futureJudgeLanguage.monaco_name,
            updatedAt: sql`now()`,
          },
        })
        .returning();
      if (!returnedLanguage) {
        throw new Error("this should never throw");
      }
      insertedLanguages.push(returnedLanguage);

      const { major, minor, patch } = futureJudgeLanguage;

      await transaction
        .insert(languageVersions)
        .values({
          languageId: returnedLanguage.id,
          majorVersion: major,
          minorVersion: minor,
          patchVersion: patch,
        })
        .onConflictDoNothing();
    }

    const testForBacktracking = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4,
      5,
    ];
    const testForDynamicProgramming = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4,
      5, 6, 7, 8, 9, 10,
    ];

    const seedProblems = [
      {
        slug: "reverse-the-array",
        testCases: createTestCasesWithOrderNumber([
          {
            input: "5\n1 2 3 4 5",
            expectedResult: "5 4 3 2 1",
          },
          {
            input: "5\n5 4 3 2 1",
            expectedResult: "1 2 3 4 5",
          },
          {
            input: "25\n1 2 3 4 5 1 2 3 4 5 1 2 3 4 5 1 2 3 4 5 1 2 3 4 5",
            expectedResult: "5 4 3 2 1 5 4 3 2 1 5 4 3 2 1 5 4 3 2 1 5 4 3 2 1",
          },
          {
            input: "8\n7 2 5 9 9 1 3 5",
            expectedResult: "5 3 1 9 9 5 2 7",
          },
        ]),
      },
      {
        slug: "most-even-cut",
        testCases: createTestCasesWithOrderNumber([
          {
            input: "3\n1 2 1",
            expectedResult: "2",
          },
          {
            input: "3\n1 3 2",
            expectedResult: "2",
          },
          {
            input: "5\n1 2 3 4 2",
            expectedResult: "0",
          },
          {
            input:
              "9000\n100000 2 3 4 2 1 2 3 4 2 1 2 3 8 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 7 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 9 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 8 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 7 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 9 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 8 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 7 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 9 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 8 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 7 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 9 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 8 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 7 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 9 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 8 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 7 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 9 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 8 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 7 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 9 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 8 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 7 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 9 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 8 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 7 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 9 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 8 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 7 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 9 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2 1 2 3 4 2",
            expectedResult: "78251",
            longRunningTest: true,
          },
        ]),
      },
      {
        slug: "maximum-length-of-songs-on-cd",
        testCases: createTestCasesWithOrderNumber([
          {
            input: "9\n3\n2 4 5",
            expectedResult: "9",
          },
          {
            input: "8\n3\n2 4 5",
            expectedResult: "7",
          },
          {
            input: `125\n${testForBacktracking.length}\n${testForBacktracking.join(" ")}`,
            expectedResult: "125",
          },
          {
            input: `165\n${testForDynamicProgramming.length}\n${testForDynamicProgramming.join(" ")}`,
            expectedResult: "165",
            longRunningTest: true,
          },
        ]),
      },
      {
        slug: "most-gain-cut",
        testCases: createTestCasesWithOrderNumber([
          {
            input: `4\n4\n2 3 5 7`,
            expectedResult: "8",
          },
          {
            input: `10\n10\n1 7 8 9 10 17 17 20 24 25`,
            expectedResult: "35",
          },
        ]),
      },
      {
        slug: "in-order-binary-tree-traversal",
        testCases: createTestCasesWithOrderNumber([
          {
            input: (() => {
              const input: number[] = [];
              return `${input.length}\n${input.join(" ")}`;
            })(),
            expectedResult: "",
          },
          {
            input: (() => {
              const input: number[] = [1];
              return `${input.length}\n${input.join(" ")}`;
            })(),
            expectedResult: `${[1].join(" ")}`,
          },
          {
            input: (() => {
              const input: number[] = [1, 2, 3];
              return `${input.length}\n${input.join(" ")}`;
            })(),
            expectedResult: `${[2, 1, 3].join(" ")}`,
          },
          {
            input: (() => {
              const input = [1, 2, 3, -1, 4, -1, -1, 5, 6, -1, 7];
              return `${input.length}\n${input.join(" ")}`;
            })(),
            expectedResult: `${[2, 5, 7, 4, 6, 1, 3].join(" ")}`,
          },
        ]),
      },
      {
        slug: "dice-sum",
        testCases: createTestCasesWithOrderNumber([
          {
            input: "2 2 3",
            expectedResult: "2",
          },
          {
            input: "3 3 7",
            expectedResult: "6",
          },
          {
            input: "5 5 5",
            expectedResult: "1",
          },
          {
            input: "3 4 6",
            expectedResult: "10",
          },
          // This is the limit for backtracking, number larger than this will take too long to process
          {
            input: "9 9 40",
            expectedResult: "16131483",
          },
          // This test does not timeout only when using dynamic programming
          {
            input: "12 12 40",
            expectedResult: "1519691394",
          },
        ]),
      },
      {
        slug: "split-students-into-groups",
        testCases: createTestCasesWithOrderNumber([
          {
            input: "3 2",
            expectedResult: "3",
          },
          {
            input: "4 2",
            expectedResult: "7",
          },
          {
            input: "4 3",
            expectedResult: "6",
          },
          {
            input: "30 20",
            expectedResult: "581535955088511150",
          },
          // Only works when using dynamic programming
          {
            input: "90 84",
            expectedResult: "3623390511035223115",
          },
        ]),
      },
      {
        slug: "highest-profit-path",
        testCases: createTestCasesWithOrderNumber([
          {
            input: "1\n2\n2 5",
            expectedResult: "7",
          },
          {
            input: "2\n1\n4\n6",
            expectedResult: "10",
          },
          {
            input: "2\n2\n2 5\n7 2",
            expectedResult: "11",
          },
          {
            input: "4\n4\n2 5 10 7\n7 2 8 9\n4 3 1 3\n6 4 3 2",
            expectedResult: "39",
          },
        ]),
      },
      {
        slug: "water-containers",
        testCases: createTestCasesWithOrderNumber([
          {
            input: "2\n1 1",
            expectedResult: "0",
          },
          {
            input: "2 1 3 2\n3 3",
            expectedResult: "3",
          },
          {
            input: "2 4 2 1 3 5 7\n5 5",
            expectedResult: "4",
          },
          {
            input: "9 4 2 1 3 4 7 10 3 2 4 6 2 7 3 5 9 1\n18 5",
            expectedResult: "6",
          },
          {
            input: "9 4 2 1 3 4 7 6 3 2 4 6 2 7 3 5 9 1 7 3\n20 20",
            expectedResult: "9",
          },
          {
            input: "6 7 9 8\n7 15",
            expectedResult: "3",
          },
          {
            input: "28 7 36 9 4 2 1 3 4 7 6 3 2 4 6 2 7 3 5 9 1 7 3 5\n50 300",
            expectedResult: "24",
          },
          {
            input:
              "28 7 15 8 36 9 4 2 1 3 4 7 6 3 2 4 6 2 7 3 5 9 1 7 3 5 2 3 5 20 26 27 2 8 3\n50 300",
            expectedResult: "35",
            longRunningTest: true,
          },
        ]),
      },
      {
        slug: "invert-a-binary-tree",
        testCases: createTestCasesWithOrderNumber([
          {
            input: (() => {
              const input: number[] = [];
              return `${input.length}\n${input.join(" ")}`;
            })(),
            expectedResult: "",
          },
          {
            input: (() => {
              const input: number[] = [1];
              return `${input.length}\n${input.join(" ")}`;
            })(),
            expectedResult: `${[1].join(" ")}`,
          },
          {
            input: (() => {
              const input: number[] = [1, 2, 3];
              return `${input.length}\n${input.join(" ")}`;
            })(),
            expectedResult: `${[1, 3, 2].join(" ")}`,
          },
          {
            input: (() => {
              const input = [1, 2, 3, -1, 4, -1, -1, 5, 6, -1, 7];
              return `${input.length}\n${input.join(" ")}`;
            })(),
            expectedResult: `${[1, 3, 2, -1, -1, 4, -1, 6, 5, -1, -1, 7].join(" ")}`,
          },
        ]),
      },
    ];
    for (const seedProblem of seedProblems) {
      const [insertedProblem] = await transaction
        .insert(problems)
        .values({
          slug: seedProblem.slug,
        })
        .onConflictDoUpdate({
          target: [problems.slug],
          set: {
            updatedAt: sql`now()`,
          },
        })
        .returning();

      if (!insertedProblem) throw new Error("The returned object is undefined");
      for (const testCase of seedProblem.testCases) {
        await transaction
          .insert(problemTestCases)
          .values({ problemId: insertedProblem.id, ...testCase })
          .onConflictDoUpdate({
            target: [problemTestCases.problemId, problemTestCases.orderNumber],
            set: {
              input: testCase.input,
              longRunningTest: !!testCase.longRunningTest,
              expectedResult: testCase.expectedResult,
              updatedAt: sql`now()`,
            },
          });
      }

      const seedCodeTemplates = insertedLanguages.map((language) => {
        return {
          problemId: insertedProblem.id,
          languageId: language.id,
          submissionCode: readFileSync(
            path.resolve(
              __dirname,
              // @ts-expect-error ignoring the any error
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              getFilePath("main", language.monacoName, t[insertedProblem.slug]),
            ),
            "utf8",
          ),
          footerCode: readFileSync(
            path.resolve(
              __dirname,
              getFilePath(
                "footer",
                language.monacoName,
                // @ts-expect-error ignoring the any error
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                t[insertedProblem.slug],
              ),
            ),
            "utf8",
          ),
        };
      });
      for (const seedCodeTemplate of seedCodeTemplates) {
        await transaction
          .insert(codeTemplates)
          .values(seedCodeTemplate)
          .onConflictDoUpdate({
            target: [codeTemplates.problemId, codeTemplates.languageId],
            set: {
              submissionCode: seedCodeTemplate.submissionCode,
              footerCode: seedCodeTemplate.footerCode,
              updatedAt: sql`now()`,
            },
          });
      }
    }
  });
}

function getFilePath(
  aCodeSection: "main" | "footer",
  language: string,
  problemFileName: string,
) {
  switch (language) {
    case "php":
      return `./seeds/${problemFileName}/${aCodeSection}.php`;
    case "javascript":
      return `./seeds/${problemFileName}/${aCodeSection}.js`;
    case "cpp":
      return `./seeds/${problemFileName}/${aCodeSection}.cpp`;
    case "python":
      return `./seeds/${problemFileName}/${aCodeSection}.py`;
    default:
      throw new Error(`${language} is an unsupported programming language`);
  }
}

function createTestCasesWithOrderNumber(
  testCases: {
    input: string;
    expectedResult: string;
    longRunningTest?: boolean;
  }[],
) {
  return testCases.map((element, index) => ({
    ...element,
    orderNumber: index + 1,
  }));
}

main()
  .then(async () => {
    await client.end();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await client.end();
    process.exit(1);
  });
