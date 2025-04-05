import "@/styles/globals.css";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { headers } from "next/headers";
import { TanstackQueryClientProvider } from "@/components/TanstackQueryClientProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { NextIntlClientProvider, type Locale, hasLocale } from "next-intl";
import { type ResolvingMetadata, type Metadata } from "next";
import { stackServerApp } from "@/stack";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { routing } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { env } from "@/env";
const PostHogPageView = dynamic(() => import("./(main)/PostHogPageView"));

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const { children } = props;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const nonce = (await headers()).get("x-nonce")!;

  return (
    <html
      lang={locale}
      suppressHydrationWarning={true}
      className={`${geist.variable}`}
    >
      {env.NODE_ENV === "development" && (
        <head>
          <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          />
        </head>
      )}
      <body className="bg-background flex max-h-dvh min-h-dvh flex-col antialiased">
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
                  </TanstackQueryClientProvider>
                </StackTheme>
              </StackProvider>
            </NuqsAdapter>
          </ThemeProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
