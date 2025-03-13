import { type Metadata } from "next";
import { redirect } from "@/i18n/navigation";
import SettingsPage from "@/app/[locale]/(main)/settings/SettingsPage";
import { stackServerApp } from "@/stack";
import { getActiveSubscription } from "@/server/data/subscriptions-dto";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Configuraciones",
};

export default async function Page() {
  const user = await stackServerApp.getUser();
  if (!user) {
    const locale = await getLocale();
    redirect({ href: "/signin", locale });
    return;
  }
  const activeSubscription = await getActiveSubscription(user.id);
  return (
    <SettingsPage
      user={{ userId: user.id, userName: user.displayName ?? "" }}
      isSubscribed={!!activeSubscription}
    />
  );
}
