import type { LanguagesSchema } from "@/server/data/languages-dto";
import type { CodeTemplates } from "@/server/data/problems-dto";

export function findSelectedLanguage(
  selectedLanguageId: number,
  languages: LanguagesSchema,
) {
  const selectedLanguage = languages.find(
    (language) => language.id === selectedLanguageId,
  );
  if (!selectedLanguage) {
    // This condition should never be true
    throw new Error("The selected language is not valid");
  }
  return selectedLanguage;
}

export function findCodeTemplate(
  codeTemplates: CodeTemplates,
  languageId: number,
) {
  const codeTemplate = codeTemplates.find(
    (template) => template.languageId === languageId,
  );
  if (!codeTemplate) {
    // This condition should never be true
    throw new Error("The selected language is not valid");
  }
  return codeTemplate;
}
export function findCodeTemplateFromLanguageId(
  codeTemplates: CodeTemplates,
  languageId: number,
  languages: LanguagesSchema,
) {
  const selectedLanguage = findSelectedLanguage(languageId, languages);
  return findCodeTemplate(codeTemplates, selectedLanguage.id);
}
