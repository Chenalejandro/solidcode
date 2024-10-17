"use client";
import { Tabs as ShadCnTab } from "@/components/ui/tabs";
import { type ComponentProps } from "react";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { validTabNames } from "./validTabNames";

export function Tabs(
  props: Omit<ComponentProps<typeof ShadCnTab>, "onValueChange"> & {
    tabKeyName: string;
  },
) {
  const { tabKeyName, ...otherProps } = props;
  const [selectedTab, setSelectedTab] = useQueryState(
    tabKeyName,
    parseAsStringLiteral(validTabNames).withDefault("description"),
  );

  return (
    <ShadCnTab
      // @ts-expect-error "ignoring type error"
      onValueChange={setSelectedTab}
      value={selectedTab}
      {...otherProps}
    ></ShadCnTab>
  );
}
