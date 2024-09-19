"use client";
import { env } from "@/env";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { type ReactNode } from "react";

if (env.NEXT_PUBLIC_ENABLE_POSTHOG === "true") {
  if (typeof window !== "undefined") {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    });
  }
}
export function CSPostHogProvider({ children }: { children: ReactNode }) {
  if (env.NEXT_PUBLIC_ENABLE_POSTHOG === "true") {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
  }
  return <>{children}</>;
}
