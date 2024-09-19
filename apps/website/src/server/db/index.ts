import { drizzle } from "drizzle-orm/vercel-postgres";
import * as paymentsSchema from "./schema/payments";
import * as problemsSchema from "./schema/problems";
import * as submissionsSchema from "./schema/submissions";
import * as subscriptionsSchema from "./schema/subscriptions";
import * as languagesSchema from "./schema/languages";
import { env } from "@/env";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createPool } from "@vercel/postgres";

const schema = {
  ...paymentsSchema,
  ...problemsSchema,
  ...submissionsSchema,
  ...subscriptionsSchema,
  ...languagesSchema,
};

export const db =
  env.POSTGRES_DRIVER === "postgres"
    ? getDrizzlePostgres()
    : drizzle(createPool({ connectionString: env.DATABASE_URL }), { schema });

function getDrizzlePostgres() {
  const globalForDb = globalThis as unknown as {
    conn: postgres.Sql | undefined;
  };

  const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
  if (env.NODE_ENV !== "production") globalForDb.conn = conn;
  return drizzlePostgres(conn, { schema });
}
