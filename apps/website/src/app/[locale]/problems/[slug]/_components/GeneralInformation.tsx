import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProblemExample from "@/app/[locale]/problems/[slug]/_components/ProblemExample.mdx";
import DiceSum from "@/app/[locale]/problems/[slug]/_components/descriptions/dice-sum.mdx";
import HighestProfitPath from "@/app/[locale]/problems/[slug]/_components/descriptions/highest-profit-path.mdx";
import InOrderBinaryTreeTraversal from "@/app/[locale]/problems/[slug]/_components/descriptions/in-order-binary-tree-traversal.mdx";
import InvertABinaryTree from "@/app/[locale]/problems/[slug]/_components/descriptions/invert-a-binary-tree.mdx";
import MaximumLengthOfSongsOnCd from "@/app/[locale]/problems/[slug]/_components/descriptions/maximum-length-of-songs-on-cd.mdx";
import MostEvenCut from "@/app/[locale]/problems/[slug]/_components/descriptions/most-even-cut.mdx";
import MostGainCut from "@/app/[locale]/problems/[slug]/_components/descriptions/most-gain-cut.mdx";
import ReverseTheArray from "@/app/[locale]/problems/[slug]/_components/descriptions/reverse-the-array.mdx";
import SplitStudentsIntoGroups from "@/app/[locale]/problems/[slug]/_components/descriptions/split-students-into-groups.mdx";
import WaterContainers from "@/app/[locale]/problems/[slug]/_components/descriptions/water-containers.mdx";
import {
  getProblemExamples,
  type ProblemExamples,
} from "@/server/data/problems-dto";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Tabs } from "./tab";
import { Submissions } from "./Submissions";
import { validTabNames } from "./validTabNames";

type TabName = (typeof validTabNames)[number];

type TabData = {
  name: TabName;
  jsx: () => ReactNode;
  className: string;
};

export default async function GeneralInformation(props: {
  problemId: number;
  problemSlug: string;
}) {
  const { problemId, problemSlug } = props;
  const problemExamples = await getProblemExamples(problemId);

  const t = await getTranslations("ProblemTab");

  const tabDatas: TabData[] = [
    {
      name: "description",
      jsx: () => {
        return (
          <>
            <div className="prose dark:prose-invert prose-headings:mt-0 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
              <Description problemSlug={problemSlug} />
            </div>
            <Examples problemExamples={problemExamples} />
          </>
        );
      },
      className: "min-h-0 flex-grow overflow-y-auto",
    },
    {
      name: "submissions",
      jsx: () => {
        return <Submissions problemId={problemId} />;
      },
      className: "min-h-0 flex-grow overflow-y-auto",
    },
    {
      name: "solutions",
      jsx: () => {
        return <></>;
      },
      className: "min-h-0 flex-grow overflow-y-auto",
    },
  ];

  return (
    <Tabs className="flex h-full flex-col" tabKeyName="selectedTab">
      <TabsList>
        {tabDatas.map((tab) => {
          return (
            <TabsTrigger value={tab.name} key={tab.name}>
              {t(tab.name)}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabDatas.map((tab) => {
        return (
          <TabsContent
            value={tab.name}
            key={tab.name}
            className={tab.className}
          >
            {tab.jsx()}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

function Examples(props: { problemExamples: ProblemExamples }) {
  const { problemExamples } = props;
  return problemExamples.map((problemExample) => (
    <ProblemExample
      input={problemExample.input}
      output={problemExample.expectedResult}
      key={problemExample.orderNumber}
    />
  ));
}

function Description(props: { problemSlug: string }) {
  const { problemSlug } = props;

  if (problemSlug === "dice-sum") {
    return <DiceSum></DiceSum>;
  } else if (problemSlug === "highest-profit-path") {
    return <HighestProfitPath />;
  } else if (problemSlug === "in-order-binary-tree-traversal") {
    return <InOrderBinaryTreeTraversal />;
  } else if (problemSlug === "invert-a-binary-tree") {
    return <InvertABinaryTree />;
  } else if (problemSlug === "maximum-length-of-songs-on-cd") {
    return <MaximumLengthOfSongsOnCd />;
  } else if (problemSlug === "most-even-cut") {
    return <MostEvenCut />;
  } else if (problemSlug === "most-gain-cut") {
    return <MostGainCut />;
  } else if (problemSlug === "reverse-the-array") {
    return <ReverseTheArray />;
  } else if (problemSlug === "split-students-into-groups") {
    return <SplitStudentsIntoGroups />;
  } else if (problemSlug === "water-containers") {
    return <WaterContainers />;
  } else {
    throw new Error(
      `Cannot find problem description with slug "${problemSlug}"`,
    );
  }
}
