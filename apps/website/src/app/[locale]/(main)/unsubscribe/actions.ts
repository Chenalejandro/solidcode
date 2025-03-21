"use server";
import { env } from "@/env";
import {
  getActiveSubscription,
  subscriptionStatusEnum,
  updateSubscription,
} from "@/server/data/subscriptions-dto";
import { stackServerApp } from "@/stack";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export async function unsubscribe() {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("unauthenticated");
  }

  const activeSubscription = await getActiveSubscription(user.id);
  if (!activeSubscription) {
    throw new Error("The user does not have an active subscription");
  }
  const client = new MercadoPagoConfig({
    accessToken: env.MELI_ACCESS_TOKEN,
    options: { timeout: 5000 },
  });
  const preApprovalClient = new PreApproval(client);
  const response = await preApprovalClient.update({
    id: activeSubscription.externalId,
    body: {
      status: "cancelled",
    },
  });
  console.log(response);

  if (!response.last_modified) {
    throw new Error("missing fields");
  }
  const subscriptionStatus = subscriptionStatusEnum.parse(response.status);
  await updateSubscription(
    activeSubscription.externalId,
    new Date(response.last_modified),
    subscriptionStatus,
  );
  await user.update({
    clientReadOnlyMetadata: {
      subscribed: false,
    },
  });
  const locale = await getLocale();
  redirect({ href: "/unsubscribe/success", locale });
}
