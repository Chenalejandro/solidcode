import { subscribed } from "@/server/data/subscriptions-dto";
import { stackServerApp } from "@/stack";
import { redirect } from "@/i18n/routing";

export default async function SuccessSubscription() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return <div>Tienes que estar logeado para ver esta página.</div>;
  }
  const isPaidUser = await subscribed(user.id);
  if (!isPaidUser) {
    redirect("/subscription");
  }
  return (
    <div>
      Ya estás suscripto! Puedes comenzar a usar todas las funcionalidades de
      nuestra página.
    </div>
  );
}
