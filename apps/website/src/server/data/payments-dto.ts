import "server-only";
import {
  paymentOperationTypes,
  payments,
  paymentStatuses,
  recurringPaymentDatas,
} from "../db/schema/payments";
import { db } from "../db";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { subscriptions } from "../db/schema/subscriptions";

export const paymentStatusEnum = z.enum(paymentStatuses);

export type PaymentStatus = z.infer<typeof paymentStatusEnum>;

export const operationTypeEnum = z.enum(paymentOperationTypes);

export type OperationType = z.infer<typeof operationTypeEnum>;

export async function upsertPayment(
  externalId: number,
  payerId: number,
  status: PaymentStatus,
  lastModifiedByMercadopago: Date,
  operationType: OperationType,
  subscriptionExternalId: string,
) {
  await db.transaction(async (transaction) => {
    const [payment] = await transaction
      .select()
      .from(payments)
      .where(eq(payments.externalId, externalId));
    if (!payment) {
      const [insertedPayment] = await transaction
        .insert(payments)
        .values({
          externalId,
          payerId,
          lastModifiedByMercadopago,
          status,
          operationType,
        })
        .returning();
      if (operationType === "recurring_payment") {
        if (!insertedPayment) {
          throw new Error("This should never happend");
        }
        const subscription = await transaction.query.subscriptions.findFirst({
          columns: {
            id: true,
          },
          where: eq(subscriptions.externalId, subscriptionExternalId),
        });
        if (!subscription) {
          throw new Error("This should never happend");
        }
        await transaction.insert(recurringPaymentDatas).values({
          paymentId: insertedPayment.id,
          subscriptionId: subscription.id,
        });
      }
      return;
    } else if (payment.lastModifiedByMercadopago < lastModifiedByMercadopago) {
      const [updatedPayment] = await transaction
        .update(payments)
        .set({
          lastModifiedByMercadopago,
          status,
          operationType,
        })
        .where(eq(payments.externalId, externalId))
        .returning();

      if (operationType === "recurring_payment") {
        if (!updatedPayment) {
          throw new Error("This should never happend");
        }
        const subscription = await transaction.query.subscriptions.findFirst({
          columns: {
            id: true,
          },
          where: eq(subscriptions.externalId, subscriptionExternalId),
        });
        if (!subscription) {
          throw new Error("This should never happend");
        }
        await transaction.insert(recurringPaymentDatas).values({
          paymentId: updatedPayment.id,
          subscriptionId: subscription.id,
        });
      }
    } else {
      console.log("the lastModified date is wrong");
    }
  });
}
