import { useState, useActionState } from "react";
import { useTheme } from "next-themes";
import { codeSubmissionAction } from "@/app/[locale]/problems/[slug]/_actions/CodeSubmissionAction";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { codeSchema } from "@/app/[locale]/problems/[slug]/_schemas/CodeSchema";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { type ZodError } from "zod";
import { type LanguagesSchema } from "@/server/data/languages-dto";
import { ProgrammingLanguageSelector } from "@/app/[locale]/problems/[slug]/_components/programming-language-selector";
import LoginModal from "@/components/LoginModal";
import { type CodeTemplates } from "@/server/data/problems-dto";
import { type ClientUser } from "../page";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

export function CodeSubmissionForm({
  problemId,
  languages,
  codeTemplates,
  user,
  onNewSubmission,
  onSuccessSubmissionResponse,
  isPoolingSubmissionResult,
}: {
  problemId: number;
  languages: LanguagesSchema;
  codeTemplates: CodeTemplates;
  user: ClientUser;
  onNewSubmission: (newPublicId?: string) => void;
  onSuccessSubmissionResponse: () => void;
  isPoolingSubmissionResult: boolean;
}) {
  "use memo";
  const { resolvedTheme } = useTheme();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [monacoEditorMounted, setMonacoEditorMounted] =
    useState<boolean>(false);
  const [currentSelectedLanguageId, setCurrentSelectedLanguageId] =
    useState<number>(() => {
      if (typeof window !== "undefined") {
        const storedlanguageIdString = localStorage.getItem(
          `problem${problemId}-languageId`,
        );
        if (storedlanguageIdString) {
          return parseInt(storedlanguageIdString);
        }
        return languages[0].id;
      }
      return languages[0].id;
    });

  const [init, setInit] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const storedCode = localStorage.getItem(`problem${problemId}-code`);
      if (storedCode) {
        return storedCode;
      }
      const codeTemplate = findCodeTemplateFromLanguageId(
        codeTemplates,
        currentSelectedLanguageId,
        languages,
      );
      return codeTemplate.submissionCode;
    }
    const codeTemplate = findCodeTemplateFromLanguageId(
      codeTemplates,
      currentSelectedLanguageId,
      languages,
    );
    return codeTemplate.submissionCode;
  });
  const [code, setCode] = useState<string>(init);

  const [, action] = useActionState(async () => {
    localStorage.setItem(
      `problem${problemId}-languageId`,
      currentSelectedLanguageId.toString(),
    );
    localStorage.setItem(`problem${problemId}-code`, code);
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    const selectedLanguage = findSelectedLanguage(
      currentSelectedLanguageId,
      languages,
    );
    try {
      const response = await codeSubmissionAction({
        problemId: problemId,
        code,
        languageId: selectedLanguage.id,
      });
      if (response.status === "error") {
        toast.error(response.problem.title);
        return;
      }
      onSuccessSubmissionResponse();
      onNewSubmission(response.public_id);
    } catch (error) {
      toast.error("Error. The submission api backed is not deployed yet.");
    }
  }, null);

  const onSelectLanguageChange = (selectedLanguageId: number) => {
    setCurrentSelectedLanguageId(selectedLanguageId);
    const codeTemplate = findCodeTemplateFromLanguageId(
      codeTemplates,
      selectedLanguageId,
      languages,
    );
    setInit(codeTemplate.submissionCode);
    setCode(codeTemplate.submissionCode);
  };
  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
      <form className="flex h-full flex-grow flex-col" action={action}>
        <ProgrammingLanguageSelector
          languages={languages}
          selectedLanguageId={currentSelectedLanguageId}
          onSelectLanguageChange={onSelectLanguageChange}
        ></ProgrammingLanguageSelector>
        {!monacoEditorMounted && (
          <Skeleton className="relative flex h-full min-h-0 w-full flex-grow"></Skeleton>
        )}
        <Editor
          className="relative flex h-full min-h-0 w-full flex-grow"
          setMonacoEditorMounted={setMonacoEditorMounted}
          initialValue={init}
          language={
            findSelectedLanguage(currentSelectedLanguageId, languages)
              .monacoName
          }
          theme={resolvedTheme === "light" ? "vs" : "vs-dark"}
          onChange={(value: string) => {
            setCode(value);
          }}
        />
        <BottomBar
          code={code}
          monacoEditorMounted={monacoEditorMounted}
          isPoolingSubmissionResult={isPoolingSubmissionResult}
        />
      </form>
    </>
  );
}

function RunButton({
  monacoEditorMounted,
  isPoolingSubmissionResult,
  formHasError = false,
}: {
  monacoEditorMounted: boolean;
  isPoolingSubmissionResult: boolean;
  formHasError?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="basis-40"
      disabled={
        !monacoEditorMounted ||
        pending ||
        formHasError ||
        isPoolingSubmissionResult
      }
    >
      Ejecutar
    </Button>
  );
}

function BottomBar({
  code,
  monacoEditorMounted,
  isPoolingSubmissionResult,
}: {
  code: string;
  monacoEditorMounted: boolean;
  isPoolingSubmissionResult: boolean;
}) {
  const parsedCode = codeSchema.safeParse(code);
  return (
    <div className="flex justify-end">
      {parsedCode.success ? (
        <></>
      ) : (
        <SchemaValidationError errorInCode={parsedCode.error} />
      )}
      <RunButton
        formHasError={!parsedCode.success}
        monacoEditorMounted={monacoEditorMounted}
        isPoolingSubmissionResult={isPoolingSubmissionResult}
      />
    </div>
  );
}

function SchemaValidationError({ errorInCode }: { errorInCode: ZodError }) {
  const errorMessages = errorInCode.issues.map((issue) => issue.message);
  const error = errorMessages.join(". ");
  return (
    <>
      <ExclamationTriangleIcon className="h-4 w-4 self-center fill-amber-800" />
      <div className="self-center pl-1 pr-4 text-red-800" role="alert">
        {error}
      </div>
    </>
  );
}

function findSelectedLanguage(
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

function findCodeTemplate(codeTemplates: CodeTemplates, languageId: number) {
  const codeTemplate = codeTemplates.find(
    (template) => template.languageId === languageId,
  );
  if (!codeTemplate) {
    // This condition should never be true
    throw new Error("The selected language is not valid");
  }
  return codeTemplate;
}

function findCodeTemplateFromLanguageId(
  codeTemplates: CodeTemplates,
  languageId: number,
  languages: LanguagesSchema,
) {
  const selectedLanguage = findSelectedLanguage(languageId, languages);
  return findCodeTemplate(codeTemplates, selectedLanguage.id);
}
