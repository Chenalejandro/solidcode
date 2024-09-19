"use client";
import { Tabs as ShadCnTab } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import { type ComponentProps } from "react";
import { useCreateQueryString } from "../utils";

export function Tabs(
  props: Omit<ComponentProps<typeof ShadCnTab>, "onValueChange"> & {
    searchParamKey: string;
  },
) {
  const { searchParamKey, ...otherProps } = props;
  const pathname = usePathname();
  const { createQueryString } = useCreateQueryString();

  return (
    <ShadCnTab
      onValueChange={(tab) => {
        window.history.replaceState(
          null,
          "",
          `${pathname}?${createQueryString(searchParamKey, tab)}`,
        );
      }}
      {...otherProps}
    ></ShadCnTab>
  );
}
