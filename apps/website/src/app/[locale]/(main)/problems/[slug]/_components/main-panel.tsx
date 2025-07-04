"use client";
import Cookies from "js-cookie";

import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { type LanguagesSchema } from "@/server/data/languages-dto";
import { useState, type ReactNode } from "react";
import { CodeSubmissionResult } from "@/app/[locale]/(main)/problems/[slug]/_components/SubmissionResult";
import { type Problem, type CodeTemplates } from "@/server/data/problems-dto";
import { CodeSubmissionForm } from "./CodeSubmissionForm";
import { type ClientUser } from "../page";

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

  // FIXME: find a better name for this state
  const [isXXXPending, setIsXXXPending] = useState<boolean>(false);
  const [submissionPublicId, setSubmissionPublicId] = useState<string>();
  const [isPoolingSubmissionResult, setIsPoolingSubmissionResult] =
    useState<boolean>(false);
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
              setIsXXXPending={setIsXXXPending}
              user={user}
              onNewSubmission={onNewSubmission}
              onSuccessSubmissionResponse={onSuccessSubmissionResponse}
              isPoolingSubmissionResult={isPoolingSubmissionResult}
              problemId={problem.id}
              languages={languages}
              codeTemplates={codeTemplates}
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
              isXXXPending={isXXXPending}
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
