import { getActiveSubscription } from "@/server/data/subscriptions-dto";
import { stackServerApp } from "@/stack";
import { redirect } from "@/i18n/routing";

export default async function SuccessSubscription() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return <div>Tienes que estar logeado para ver esta página.</div>;
  }

  const activeSubscription = await getActiveSubscription(user.id);
  if (activeSubscription) {
    redirect("/unsubscribe");
  }
  return <div>Ya estás desuscripto!</div>;
}
