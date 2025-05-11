"use client";
import Cookies from "js-cookie";

import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { type LanguagesSchema } from "@/server/data/languages-dto";
import { useActionState, useState, type ReactNode } from "react";
import { CodeSubmissionResult } from "@/app/[locale]/(main)/problems/[slug]/_components/SubmissionResult";
import { type Problem, type CodeTemplates } from "@/server/data/problems-dto";
import { CodeSubmissionForm } from "./CodeSubmissionForm";
import { type ClientUser } from "../page";
import { codeSubmissionAction } from "@/app/[locale]/(main)/problems/[slug]/_actions/CodeSubmissionAction";
import { toast } from "sonner";
import LoginModal from "@/components/LoginModal";
import { findCodeTemplateFromLanguageId, findSelectedLanguage } from "../utils";

// FIXME: Since child components need to share state, consider centralizing the state
// in this component to avoid using useEffect in child components.
export function MainPanel({
  defaultHorizontalLayout,
  defaultVerticalSubLayout,
  problem,
  languages,
  codeTemplates,
  generalInformation,
  user,
}: {
  defaultHorizontalLayout: number[];
  defaultVerticalSubLayout: number[];
  problem: Problem;
  languages: LanguagesSchema;
  codeTemplates: CodeTemplates;
  generalInformation: ReactNode;
  user: ClientUser;
}) {
  const onLayoutChange = (sizes: number[], layoutCookieName: string) => {
    Cookies.set(layoutCookieName, JSON.stringify(sizes));
  };

  const [submissionPublicId, setSubmissionPublicId] = useState<string>();
  const [isPoolingSubmissionResult, setIsPoolingSubmissionResult] =
    useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const [currentSelectedLanguageId, setCurrentSelectedLanguageId] =
    useState<number>(() => {
      if (typeof window !== "undefined") {
        const storedlanguageIdString = localStorage.getItem(
          `problem${problem.id}-languageId`,
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
      const storedCode = localStorage.getItem(`problem${problem.id}-code`);
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
  const [, action, isPending] = useActionState(async () => {
    localStorage.setItem(
      `problem${problem.id}-languageId`,
      currentSelectedLanguageId.toString(),
    );
    localStorage.setItem(`problem${problem.id}-code`, code);
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
        problemId: problem.id,
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
  const onNewSubmission = (newPublicId?: string) =>
    setSubmissionPublicId(newPublicId);
  const onSuccessSubmissionResponse = () => {
    setIsPoolingSubmissionResult(true);
  };
  const onPoolingResultCompletes = () => {
    setIsPoolingSubmissionResult(false);
  };
  return (
    <ResizablePanelGroup
      className="grow rounded-lg border"
      direction="horizontal"
      onLayout={(sizes: number[]) => onLayoutChange(sizes, "horizontalLayout")}
    >
      <ResizablePanel
        defaultSize={defaultHorizontalLayout[0]}
        minSize={12}
        collapsible
        collapsedSize={10}
      >
        {generalInformation}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={defaultHorizontalLayout[1]}
        minSize={12}
        collapsible
        collapsedSize={10}
      >
        <ResizablePanelGroup
          direction="vertical"
          onLayout={(sizes: number[]) =>
            onLayoutChange(sizes, "verticalSubLayout")
          }
        >
          <ResizablePanel
            defaultSize={defaultVerticalSubLayout[0]}
            minSize={8}
            collapsible
            collapsedSize={6}
          >
            <CodeSubmissionForm
              action={action}
              init={init}
              isPoolingSubmissionResult={isPoolingSubmissionResult}
              languages={languages}
              onSelectLanguageChange={onSelectLanguageChange}
              currentSelectedLanguageId={currentSelectedLanguageId}
              loginModal={
                <LoginModal
                  isOpen={isLoginModalOpen}
                  setIsOpen={setIsLoginModalOpen}
                />
              }
              code={code}
              onCodeChange={(value: string) => {
                setCode(value);
              }}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={defaultVerticalSubLayout[1]}
            minSize={8}
            collapsible
            collapsedSize={6}
          >
            <CodeSubmissionResult
              isXXXPending={isPending}
              user={user}
              submissionPublicId={submissionPublicId}
              onPoolingResultCompletes={onPoolingResultCompletes}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
