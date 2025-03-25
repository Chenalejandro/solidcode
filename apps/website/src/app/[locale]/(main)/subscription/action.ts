"use server";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { z } from "zod";
import { redirect } from "@/i18n/navigation";
import {
  addSubscriptor,
  subscriptionStatusEnum,
} from "@/server/data/subscriptions-dto";
import { env } from "@/env";
import { stackServerApp } from "@/stack";
import { getLocale } from "next-intl/server";
import { type IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";

// We need to create a zod schemas from the type definitions
// in order to do the validation.
// Whenever there is a change to the interfaces, we need to update the schema.
// import {
//   type ICardPaymentBrickPayer,
//   type ICardPaymentFormData,
// } from "@mercadopago/sdk-react/bricks/cardPayment/type";

const payerIdentificationSchema = z.object({
  type: z.string().optional(),
  number: z.string().optional(),
});

const cardPaymentBrickPlayerSchema = z.object({
  email: z.string().optional(),
  identification: payerIdentificationSchema.optional(),
});

// FIXME: we should be using some form of input validation,
// but it is a little bit tricky keep the schema in sync with IPaymentFormData.
// So we just type the data as IPaymentFormData
export async function processPayment(data: IPaymentFormData) {
  const user = await stackServerApp.getUser();
  if (!user) {
    console.log(
      "Calling the server action when the user is anonymous (not authenticated)",
    );
    throw new Error("Unauthenticated");
  }

  const client = new MercadoPagoConfig({
    accessToken: env.MELI_ACCESS_TOKEN,
    options: { timeout: 5000 },
  });

  if (data.selectedPaymentMethod === "wallet_purchase" || data.selectedPaymentMethod === "onboarding_credits") {
    return;
  }

  const preapproval = new PreApproval(client);

  const response = await createSubscription(preapproval, data);
  if (response.api_response.status !== 201) {
    console.error(response);
    throw new Error("Payment cannot be created");
  }

  const subscriptionStatus = subscriptionStatusEnum.safeParse(response.status);
  if (
    !response.id ||
    !response.payer_id ||
    !response.last_modified ||
    !subscriptionStatus.success
  ) {
    console.error(response);
    throw new Error("Critial: there are missing fields from the response");
  }
  await addSubscriptor(
    response.id,
    user.id,
    response.payer_id,
    new Date(response.last_modified),
    subscriptionStatus.data,
  );
  await user.update({
    clientReadOnlyMetadata: {
      subscribed: true,
    },
  });
  console.log(response);
  const locale = await getLocale();
  redirect({ href: "/subscription/success", locale });
}

async function createSubscription(
  preapproval: PreApproval,
  data: IPaymentFormData,
) {
  try {
    return await preapproval.create({
      body: {
        preapproval_plan_id: env.PREAPPROVAL_PLAN_ID,
        reason: "Solid code",
        external_reference: "SC_1234",
        payer_email: data.formData.payer.email,
        card_token_id: data.formData.token,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: data.formData.transaction_amount,
          currency_id: "ARS",
        },
        status: "authorized",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Cannot get the response from mercadopago");
  }
}
