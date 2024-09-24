import PaymentForm from "./_components/PaymentForm";
import { subscribed } from "@/server/data/subscriptions-dto";
import { redirect } from "@/i18n/routing";
import { env } from "@/env";
import { stackServerApp } from "@/stack";

export default async function Page() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return <div>Tenés que estar loggeado para realizar la suscripción.</div>;
  }
  const isPaidUser = await subscribed(user.id);
  if (isPaidUser) {
    redirect("/subscription/success");
  }
  if (!user.primaryEmail) {
    throw new Error("The user does not have an email");
  }

  return (
    <PaymentForm
      amount={15}
      // We want to manually put the email in when not in production
      // since we are going to use mercadopago's test email
      email={env.NODE_ENV !== "production" ? undefined : user.primaryEmail}
    ></PaymentForm>
  );
}
