import { subscribed } from "@/server/data/subscriptions-dto";
import { stackServerApp } from "@/stack";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function SuccessSubscription() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return <div>Tienes que estar logeado para ver esta página.</div>;
  }
  const isPaidUser = await subscribed(user.id);
  if (!isPaidUser) {
    const locale = await getLocale();
    redirect({ href: "/subscription", locale });
  }
  return (
    <div>
      Ya estás suscripto! Puedes comenzar a usar todas las funcionalidades de
      nuestra página.
    </div>
  );
}
