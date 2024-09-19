import { type Metadata } from "next";
import { redirect } from "next/navigation";
import SettingsPage from "@/app/[locale]/settings/SettingsPage";
import { stackServerApp } from "@/stack";
import { getActiveSubscription } from "@/server/data/subscriptions-dto";

export const metadata: Metadata = {
  title: "Configuraciones",
};

export default async function Page() {

  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/signin");
  }
  const activeSubscription = await getActiveSubscription(user.id);
  return <SettingsPage user={{ userId: user.id, userName: user.displayName ?? ""}}
    isSubscribed={!!activeSubscription}
  />;
}
