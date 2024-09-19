import { timestamp, text, pgEnum, bigint, integer } from "drizzle-orm/pg-core";
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

export const subscriptions = createTable("subscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  externalId: text("external_id").notNull().unique(),
  userId: text("user_id").notNull(),
  payerId: bigint("payer_id", { mode: "number" }).notNull(),
  status: subscriptionStatusEnum("status").notNull(),
  lastModifiedByMercadopago: timestamp("last_modified_by_mercadopago", {
    withTimezone: true,
  }).notNull(),
});
