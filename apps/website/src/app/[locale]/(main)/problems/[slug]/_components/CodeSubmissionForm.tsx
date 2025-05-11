import { useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { codeSchema } from "@/app/[locale]/(main)/problems/[slug]/_schemas/CodeSchema";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { type ZodError } from "zod";
import { type LanguagesSchema } from "@/server/data/languages-dto";
import { ProgrammingLanguageSelector } from "@/app/[locale]/(main)/problems/[slug]/_components/programming-language-selector";
import dynamic from "next/dynamic";
import { findSelectedLanguage } from "../utils";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

export function CodeSubmissionForm({
  languages,
  isPoolingSubmissionResult,
  action,
  loginModal,
  currentSelectedLanguageId,
  onSelectLanguageChange,
  init,
  code,
  onCodeChange,
}: {
  languages: LanguagesSchema;
  isPoolingSubmissionResult: boolean;
  action: () => void;
  loginModal: ReactNode;
  currentSelectedLanguageId: number;
  onSelectLanguageChange: (selectedLanguageId: number) => void;
  init: string;
  code: string;
  onCodeChange: (value: string) => void;
}) {
  const { resolvedTheme } = useTheme();
  const [monacoEditorMounted, setMonacoEditorMounted] =
    useState<boolean>(false);
  return (
    <>
      {loginModal}
      <form className="flex h-full grow flex-col" action={action}>
        <ProgrammingLanguageSelector
          languages={languages}
          selectedLanguageId={currentSelectedLanguageId}
          onSelectLanguageChange={onSelectLanguageChange}
        ></ProgrammingLanguageSelector>
        {!monacoEditorMounted && (
          <Skeleton className="relative flex h-full min-h-0 w-full grow"></Skeleton>
        )}
        <Editor
          className="relative flex h-full min-h-0 w-full grow"
          setMonacoEditorMounted={setMonacoEditorMounted}
          initialValue={init}
          language={
            findSelectedLanguage(currentSelectedLanguageId, languages)
              .monacoName
          }
          theme={resolvedTheme === "light" ? "vs" : "vs-dark"}
          onChange={onCodeChange}
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
      <div className="self-center pr-4 pl-1 text-red-800" role="alert">
        {error}
      </div>
    </>
  );
}
