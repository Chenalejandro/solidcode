import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["es"];

export default getRequestConfig(async ({ locale }: { locale: string }) => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.

  if (!locales.includes(locale)) notFound();
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
