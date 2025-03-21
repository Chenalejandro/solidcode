import PaymentForm from "./_components/PaymentForm";
import { subscribed } from "@/server/data/subscriptions-dto";
import { redirect } from "@/i18n/navigation";
import { env } from "@/env";
import { stackServerApp } from "@/stack";
import { getLocale } from "next-intl/server";
import MercadoPagoConfig, { Preference } from "mercadopago";

export default async function Page() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return <div>Tenés que estar loggeado para realizar la suscripción.</div>;
  }
  const isPaidUser = await subscribed(user.id);
  if (isPaidUser) {
    const locale = await getLocale();
    redirect({ href: "/subscription/success", locale });
  }
  if (!user.primaryEmail) {
    throw new Error("The user does not have an email");
  }
  const client: MercadoPagoConfig = new MercadoPagoConfig({
    accessToken: env.MELI_ACCESS_TOKEN,
  });
  const preference = await new Preference(client).create({
    body: {
      items: [
        {
          id: "subscription",
          unit_price: env.SUBSCRIPTION_PRICE,
          quantity: 1,
          title: "Subscripción Solid Code",
        },
      ],
    },
  });
  return (
    <PaymentForm
      preferenceId={preference.id}
      amount={env.SUBSCRIPTION_PRICE}
      // We want to manually put the email in when not in production
      // since we are going to use mercadopago's test email
      email={env.NODE_ENV !== "production" ? undefined : user.primaryEmail}
    ></PaymentForm>
  );
}
