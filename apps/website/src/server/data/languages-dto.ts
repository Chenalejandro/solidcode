import "server-only";

import { db } from "../db";
import { z } from "zod";
import { languages, monacoLanguages } from "../db/schema/languages";
import { eq } from "drizzle-orm";

const languageSchema = z.object({
  id: z.number().positive(),
  name: z.string(),
  monacoName: z.enum(monacoLanguages),
});

const languagesSchema = z.array(languageSchema).nonempty();
export type LanguagesSchema = z.infer<typeof languagesSchema>;
export type Language = z.infer<typeof languageSchema>;

export async function getLanguages() {
  const languages = await db.query.languages.findMany({
    columns: { id: true, name: true, monacoName: true },
  });
  return languagesSchema.parse(languages);
}

export async function getExternalLanguageId(id: number) {
  const language = await db.query.languages.findFirst({
    columns: {
      externalId: true,
    },
    where: eq(languages.id, id),
  });
  if (!language) {
    throw new Error(`The language with id = ${id} does not exist`);
  }
  return language.externalId;
}
