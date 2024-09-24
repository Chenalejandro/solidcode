import { getActiveSubscription } from "@/server/data/subscriptions-dto";
import { redirect } from "@/i18n/routing";
import { UnsubscribeButton } from "./UnsubscribeButton";
import { stackServerApp } from "@/stack";

export default async function Unsubscribe() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return <div>Tenés que estar loggeado para cancelar la suscripción.</div>;
  }
  const activeSubscription = await getActiveSubscription(user.id);
  if (!activeSubscription) {
    redirect("/");
  }
  return <UnsubscribeButton />;
}
