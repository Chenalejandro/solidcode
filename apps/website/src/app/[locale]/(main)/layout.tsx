import { CSPostHogProvider } from "@/app/_analytics/provider";
import { TopNav } from "@/app/_components/top-nav";
import PostHogPageView from "@/app/PostHogPageView";
import { type ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <CSPostHogProvider>
      <PostHogPageView />
      <TopNav />
      {children}
    </CSPostHogProvider>
  );
}
