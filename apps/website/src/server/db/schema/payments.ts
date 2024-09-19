import { timestamp, text, pgEnum, bigint, integer } from "drizzle-orm/pg-core";
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

export const payments = createTable("payments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  externalId: bigint("external_id", { mode: "number" }).notNull().unique(),
  payerId: bigint("payer_id", { mode: "number" }).notNull(),
  status: paymentStatusEnum("status").notNull(),
  lastModifiedByMercadopago: timestamp("last_modified_by_mercadopago", {
    withTimezone: true,
  }).notNull(),
  operationType: paymentOperationTypesEnum("operation_type").notNull(),
});

export const recurringPaymentDatas = createTable("recurring_payment_datas", {
  paymentId: integer("payment_id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull(),
});

export const invoiceStatuses = [
  "scheduled",
  "processed",
  "recycling",
  "cancelled",
] as const;

export const invoiceStatusEnum = pgEnum("invoice_status", invoiceStatuses);

export const invoices = createTable("invoices", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  externalId: text("external_id").notNull().unique(),
  status: invoiceStatusEnum("status").notNull(),
  lastModifiedByMercadopago: timestamp("last_modified_by_mercadopago", {
    withTimezone: true,
  }).notNull(),
});

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
