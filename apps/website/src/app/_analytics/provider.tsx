"use client";
import { env } from "@/env";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";
import { useUser } from "@stackframe/stack";

if (env.NEXT_PUBLIC_ENABLE_POSTHOG === "true") {
  if (typeof window !== "undefined") {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      persistence: "localStorage",
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      capture_pageview: false,
      capture_pageleave: true,
    });
  }
}
export function CSPostHogProvider({ children }: { children: ReactNode }) {
  if (env.NEXT_PUBLIC_ENABLE_POSTHOG === "true") {
    return (
      <PostHogProvider client={posthog}>
        <PostHogAuthWrapper>{children}</PostHogAuthWrapper>
      </PostHogProvider>
    );
  }
  return <>{children}</>;
}

const PostHogAuthWrapper = ({ children }: { children: ReactNode }) => {
  const user = useUser();
  useEffect(() => {
    if (user) {
      posthog.identify(user.id, { email: user.primaryEmail });
    } else {
      posthog.reset();
    }
  }, [user]);
  return <>{children}</>;
};
