import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { TopNav } from "@/app/_components/top-nav";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { headers } from "next/headers";
import { TanstackQueryClientProvider } from "@/components/TanstackQueryClientProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { type ResolvingMetadata, type Metadata } from "next";
import { stackServerApp } from "@/stack";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { routing } from "@/i18n/routing";
import { CSPostHogProvider } from "@/app/_analytics/provider";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
const PostHogPageView = dynamic(() => import("../PostHogPageView"));

export async function generateMetadata(
  props: { params: Promise<{ locale: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

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

export default async function RootLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const nonce = (await headers()).get("x-nonce")!;

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
            <NuqsAdapter>
              <StackProvider
                app={stackServerApp}
                lang={locale === "es" ? "es-ES" : "en-US"}
              >
                <StackTheme nonce={nonce}>
                  <TanstackQueryClientProvider>

                      {children}
                      <ReactQueryDevtools initialIsOpen={false} />
                      <Sonner />
                      <Toaster />
                  </TanstackQueryClientProvider>
                </StackTheme>
              </StackProvider>
            </NuqsAdapter>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
