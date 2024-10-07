import { pgEnum } from "drizzle-orm/pg-core";
import { createTable } from "../utils";

export const subscriptionStatuses = [
  "pending",
  "authorized",
  "paused",
  "cancelled",
] as const;

export const subscriptionStatusEnum = pgEnum(
  "subscription_status",
  subscriptionStatuses,
);

export const subscriptions = createTable("subscriptions", (t) => ({
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  externalId: t.text("external_id").notNull().unique(),
  userId: t.text().notNull(),
  payerId: t.bigint({ mode: "number" }).notNull(),
  status: subscriptionStatusEnum().notNull(),
  lastModifiedByMercadopago: t
    .timestamp({
      withTimezone: true,
    })
    .notNull(),
}));
