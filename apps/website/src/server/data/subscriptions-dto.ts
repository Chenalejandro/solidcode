import "server-only";
import { db, dbWithTransaction } from "../db";
import { and, desc, eq, gt, or, sql } from "drizzle-orm";
import {
  subscriptions,
  subscriptionStatuses,
} from "@/server/db/schema/subscriptions";
import { z } from "zod";
import { payments, recurringPaymentDatas } from "../db/schema/payments";
import { type PgColumn } from "drizzle-orm/pg-core";

export const subscriptionStatusEnum = z.enum(subscriptionStatuses);

export type SubscriptionStatus = z.infer<typeof subscriptionStatusEnum>;

export async function addSubscriptor(
  externalId: string,
  userId: string,
  payerId: number,
  lastModifiedByMercadopago: Date,
  status: SubscriptionStatus,
) {
  await db.insert(subscriptions).values({
    externalId,
    userId,
    payerId,
    lastModifiedByMercadopago,
    status,
  });
}

export async function updateSubscription(
  externalId: string,
  lastModifiedByMercadopago: Date,
  status: SubscriptionStatus,
) {
  await dbWithTransaction.transaction(async (transaction) => {
    const [subscription] = await transaction
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.externalId, externalId));
    if (!subscription) {
      transaction.rollback();
      return;
    } else if (
      subscription.lastModifiedByMercadopago < lastModifiedByMercadopago
    ) {
      await transaction
        .update(subscriptions)
        .set({
          lastModifiedByMercadopago,
          status,
        })
        .where(eq(subscriptions.externalId, externalId));
    } else {
      console.log("the lastModified date is wrong");
    }
  });
}

// This should only be used when the user wants to unsubscribe.
export async function getActiveSubscription(userId: string) {
  return await db.query.subscriptions.findFirst({
    columns: {
      externalId: true,
      payerId: true,
      status: true,
    },
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, "authorized"),
    ),
  });
}

export async function subscribed(userId: string) {
  const subscription = await db.query.subscriptions.findFirst({
    columns: {
      id: true,
      externalId: true,
      payerId: true,
      status: true,
    },
    where: or(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "authorized"),
      ),
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "cancelled"),
        gt(subscriptions.lastModifiedByMercadopago, getOneMonthAgoDate()),
      ),
    ),
    orderBy: [desc(subscriptions.lastModifiedByMercadopago)],
  });
  if (!subscription) {
    return false;
  }
  if (subscription.status === "authorized") {
    return true;
  }

  const recurringPayment = await getRecurringPayment(subscription.id);
  if (recurringPayment && recurringPayment.status === "approved") {
    const lastModified = new Date(recurringPayment.lastModified);
    if (lastModified > getOneMonthAgoDate()) {
      return true;
    }
    return false;
  }
  return false;
}

async function getRecurringPayment(subscriptionId: number) {
  const [recurringPayment] = await db
    .select({
      status: payments.status,
      lastModified: getISOFormatDateQuery(payments.lastModifiedByMercadopago),
    })
    .from(recurringPaymentDatas)
    .innerJoin(payments, eq(payments.id, recurringPaymentDatas.paymentId))
    .where(eq(recurringPaymentDatas.subscriptionId, subscriptionId))
    .limit(1);
  return recurringPayment;
}

function getOneMonthAgoDate() {
  const temporalDateVariable = new Date();
  temporalDateVariable.setMonth(temporalDateVariable.getMonth() - 1);
  return temporalDateVariable;
}

function getISOFormatDateQuery(dateTimeColumn: PgColumn) {
  return sql<string>`to_char(${dateTimeColumn}, 'YYYY-MM-DD"T"HH24:MI:SS.FF3""TZH:TZM')`;
}
