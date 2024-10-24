import { getActiveSubscription } from "@/server/data/subscriptions-dto";
import { redirect } from "@/i18n/routing";
import { UnsubscribeButton } from "./UnsubscribeButton";
import { stackServerApp } from "@/stack";
import { getLocale } from "next-intl/server";

export default async function Unsubscribe() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return <div>Tenés que estar loggeado para cancelar la suscripción.</div>;
  }
  const activeSubscription = await getActiveSubscription(user.id);
  if (!activeSubscription) {
    const locale = await getLocale();
    redirect({ href: "/", locale });
  }
  return <UnsubscribeButton />;
}
