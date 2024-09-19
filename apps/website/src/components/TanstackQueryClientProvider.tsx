"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { type ReactNode } from "react";

const client = new QueryClient();
export const TanstackQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
