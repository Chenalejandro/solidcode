import { pgEnum } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import { relations } from "drizzle-orm";
import { subscriptions } from "./subscriptions";

export const paymentStatuses = [
  "pending",
  "approved",
  "authorized",
  "in_process",
  "in_mediation",
  "rejected",
  "cancelled",
  "refunded",
  "charged_back",
] as const;

export const paymentStatusEnum = pgEnum("payment_status", paymentStatuses);

export const paymentOperationTypes = [
  "investment",
  "regular_payment",
  "money_transfer",
  "recurring_payment",
  "account_fund",
  "payment_addition",
  "cellphone_recharge",
  "pos_payment",
  "money_exchange",
  "card_validation",
] as const;

export const paymentOperationTypesEnum = pgEnum(
  "operationTypes",
  paymentOperationTypes,
);

export const payments = createTable("payments", (t) => ({
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  externalId: t.bigint("external_id", { mode: "number" }).notNull().unique(),
  payerId: t.bigint({ mode: "number" }).notNull(),
  status: paymentStatusEnum().notNull(),
  lastModifiedByMercadopago: t
    .timestamp({
      withTimezone: true,
    })
    .notNull(),
  operationType: paymentOperationTypesEnum().notNull(),
}));

export const recurringPaymentDatas = createTable(
  "recurring_payment_datas",
  (t) => ({
    paymentId: t.integer().primaryKey(),
    subscriptionId: t.integer().notNull(),
  }),
);

export const invoiceStatuses = [
  "scheduled",
  "processed",
  "recycling",
  "cancelled",
] as const;

export const invoiceStatusEnum = pgEnum("invoice_status", invoiceStatuses);

export const invoices = createTable("invoices", (t) => ({
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  externalId: t.text("external_id").notNull().unique(),
  status: invoiceStatusEnum().notNull(),
  lastModifiedByMercadopago: t
    .timestamp({
      withTimezone: true,
    })
    .notNull(),
}));

export const recurringPaymentDatasRelations = relations(
  recurringPaymentDatas,
  ({ one }) => ({
    payment: one(payments, {
      fields: [recurringPaymentDatas.paymentId],
      references: [payments.id],
    }),
    subscription: one(subscriptions, {
      fields: [recurringPaymentDatas.subscriptionId],
      references: [subscriptions.id],
    }),
  }),
);
