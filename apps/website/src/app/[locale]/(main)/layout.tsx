import { TopNav } from "@/app/_components/top-nav";
import { env } from "@/env";
import { type ReactNode } from "react";
import { PostHogProvider } from "./PostHogProvider";

export default function Layout({ children }: { children: ReactNode }) {
  if (env.NEXT_PUBLIC_ENABLE_POSTHOG === "true") {
    return (
      <PostHogProvider>
        <TopNav />
        {children}
      </PostHogProvider>
    );
  }
  return <>{children}</>;
}
