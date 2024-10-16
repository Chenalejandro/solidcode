import "server-only";
import { invoices, invoiceStatuses } from "../db/schema/payments";
import { z } from "zod";
import { dbWithTransaction } from "../db";
import { eq } from "drizzle-orm";

export const invoiceStatusEnum = z.enum(invoiceStatuses);

export type InvoiceStatus = z.infer<typeof invoiceStatusEnum>;

export async function upsertInvoice(
  externalId: string,
  status: InvoiceStatus,
  lastModifiedByMercadopago: Date,
) {
  await dbWithTransaction.transaction(async (transaction) => {
    const [invoice] = await transaction
      .select()
      .from(invoices)
      .where(eq(invoices.externalId, externalId));
    if (!invoice) {
      await transaction.insert(invoices).values({
        externalId,
        lastModifiedByMercadopago,
        status,
      });
      return;
    } else if (invoice.lastModifiedByMercadopago < lastModifiedByMercadopago) {
      await transaction
        .update(invoices)
        .set({
          lastModifiedByMercadopago,
          status,
        })
        .where(eq(invoices.externalId, externalId));
    } else {
      console.log("the lastModified date is wrong");
    }
  });
}
