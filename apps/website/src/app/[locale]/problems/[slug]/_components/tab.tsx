"use client";
import { Tabs as ShadCnTab } from "@/components/ui/tabs";
import { type ComponentProps } from "react";
import { useQueryState } from "nuqs";

export function Tabs(
  props: Omit<ComponentProps<typeof ShadCnTab>, "onValueChange"> & {
    tabKeyName: string;
  },
) {
  const { tabKeyName, ...otherProps } = props;
  const [selectedTab, setSelectedTab] = useQueryState(tabKeyName, {
    defaultValue: "",
  });

  return <ShadCnTab onValueChange={setSelectedTab} {...otherProps}></ShadCnTab>;
}
