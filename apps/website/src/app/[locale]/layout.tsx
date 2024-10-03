import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/app/_components/theme-provider";
import { TopNav } from "@/app/_components/top-nav";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { env } from "@/env";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { headers } from "next/headers";
import { TanstackQueryClientProvider } from "@/components/TanstackQueryClientProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import {
  unstable_setRequestLocale,
  getMessages,
  getTranslations,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { type ResolvingMetadata, type Metadata } from "next";
import { stackServerApp } from "@/stack";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { routing } from "@/i18n/routing";
import { CSPostHogProvider } from "@/app/_analytics/provider";

export async function generateMetadata(
  { params: { locale } }: { params: { locale: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "App" });
  return {
    title: t("title"),
    description: t("description"),
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const nonce = headers().get("x-nonce")!;

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body
        className={cn(
          "flex max-h-dvh min-h-dvh flex-col bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            nonce={nonce}
            enableColorScheme={false}
          >
            <StackProvider
              app={stackServerApp}
              lang={locale === "es" ? "es-ES" : "en-US"}
            >
              <StackTheme nonce={nonce}>
                <TanstackQueryClientProvider>
                  <CSPostHogProvider>
                    <TopNav />
                    {children}
                    <ReactQueryDevtools initialIsOpen={false} />
                    <Sonner />
                    <Toaster />
                    <Tracking />
                  </CSPostHogProvider>
                </TanstackQueryClientProvider>
              </StackTheme>
            </StackProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

function Tracking() {
  if (env.NODE_ENV !== "production") {
    return <></>;
  }
  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
