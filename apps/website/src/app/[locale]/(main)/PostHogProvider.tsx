"use client";

import PostHogPageView from "@/app/[locale]/(main)/PostHogPageView";
import { env } from "@/env";
import { useUser } from "@stackframe/stack";
import posthog from "posthog-js";
import { PostHogProvider as PostHogReactProvider } from "posthog-js/react";
import { type ReactNode, useEffect } from "react";

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true,
    });
  }, []);

  return (
    <PostHogReactProvider client={posthog}>
      <PostHogPageView />
      <PostHogUserIndentification>{children}</PostHogUserIndentification>
    </PostHogReactProvider>
  );
}
const PostHogUserIndentification = ({ children }: { children: ReactNode }) => {
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
