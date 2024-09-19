import { type NextRequest } from "next/server";
import { verifyRequest } from "./utils";
import MercadoPagoConfig, { Invoice, Payment, PreApproval } from "mercadopago";
import {
  operationTypeEnum,
  paymentStatusEnum,
  upsertPayment,
} from "@/server/data/payments-dto";
import {
  subscriptionStatusEnum,
  updateSubscription,
} from "@/server/data/subscriptions-dto";
import { invoiceStatusEnum, upsertInvoice } from "@/server/data/invoices-dto";
import { env } from "@/env";

export async function POST(request: NextRequest) {
  try {
    verifyRequest(request.headers, request.nextUrl.searchParams);
  } catch (error) {
    return new Response("Bad request", { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const json: any = await request.json();
  console.log(json);

  const client = new MercadoPagoConfig({
    accessToken: env.MELI_ACCESS_TOKEN,
    options: { timeout: 5000 },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  switch (json.type) {
    case "payment": {
      const paymentClient = new Payment(client);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const payment = await paymentClient.get({ id: json.data.id });
      const parsedPaymentStatus = paymentStatusEnum.safeParse(payment.status);
      const parsedOperationType = operationTypeEnum.safeParse(
        payment.operation_type,
      );
      if (
        !payment.id ||
        !payment?.payer?.id ||
        !payment.date_last_updated ||
        !parsedPaymentStatus.success ||
        !parsedOperationType.success
      ) {
        console.error(payment);
        throw new Error("Missing fields");
      }
      if (parsedOperationType.data === "recurring_payment") {
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          !payment?.metadata?.preapproval_id &&
          // @ts-expect-error ignoring the type hinting of "transaction_data" since it is wrong
          !payment?.point_of_interaction?.transaction_data?.subscription_id
        ) {
          console.error(payment);
          throw new Error("Missing fields");
        }
      }
      await upsertPayment(
        payment.id,
        parseInt(payment.payer.id),
        parsedPaymentStatus.data,
        new Date(payment.date_last_updated),
        parsedOperationType.data,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        payment?.metadata?.preapproval_id ??
          // @ts-expect-error ignoring the type hinting of "transaction_data" since it is wrong
          payment?.point_of_interaction?.transaction_data?.subscription_id ??
          "",
      );
      break;
    }
    case "subscription_preapproval": {
      const subscriptionPreapprovalClient = new PreApproval(client);
      const subscriptionPreapproval = await subscriptionPreapprovalClient.get({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        id: json.data.id,
      });
      const parsedSubscriptionStatus = subscriptionStatusEnum.safeParse(
        subscriptionPreapproval.status,
      );
      if (
        !subscriptionPreapproval.id ||
        !subscriptionPreapproval.last_modified ||
        !parsedSubscriptionStatus.success
      ) {
        console.error(subscriptionPreapproval);
        throw new Error("Missing fields");
      }
      await updateSubscription(
        subscriptionPreapproval.id,
        new Date(subscriptionPreapproval.last_modified),
        parsedSubscriptionStatus.data,
      );
      break;
    }
    case "subscription_authorized_payment": {
      const invoiceClient = new Invoice(client);
      const invoice = await invoiceClient.get({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        id: json.data.id,
      });
      const parsedInvoiceStatus = invoiceStatusEnum.safeParse(invoice.status);
      if (
        !invoice.id ||
        !invoice.last_modified ||
        !parsedInvoiceStatus.success
      ) {
        console.error(invoice);
        throw new Error("Missing fields");
      }
      await upsertInvoice(
        invoice.id,
        parsedInvoiceStatus.data,
        new Date(invoice.last_modified),
      );
      break;
    }

    default:
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Unkown webhook event type: ${json.type}`);
  }
  return Response.json({ success: true });
}
