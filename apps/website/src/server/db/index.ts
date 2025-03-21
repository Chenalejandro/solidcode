import * as paymentsSchema from "./schema/payments";
import * as problemsSchema from "./schema/problems";
import * as submissionsSchema from "./schema/submissions";
import * as subscriptionsSchema from "./schema/subscriptions";
import * as languagesSchema from "./schema/languages";
import { env } from "@/env";
import { drizzle as nodePostgres } from "drizzle-orm/node-postgres";
import { drizzle as neonHttp } from "drizzle-orm/neon-http";
import { drizzle as neonWebsocket } from "drizzle-orm/neon-serverless";
import { Pool } from "pg";

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
    : neonHttp(env.DATABASE_URL, {
        schema,
        casing: "snake_case",
      });

export const dbWithTransaction =
  env.POSTGRES_DRIVER === "postgres"
    ? getDrizzlePostgres()
    : neonWebsocket(env.DATABASE_URL, {
        schema,
        casing: "snake_case",
      });

function getDrizzlePostgres() {
  const globalForDb = globalThis as unknown as {
    conn: Pool | undefined;
  };

  const conn =
    globalForDb.conn ??
    new Pool({
      connectionString: env.DATABASE_URL,
    });
  if (env.NODE_ENV !== "production") globalForDb.conn = conn;
  return nodePostgres({ client: conn, casing: "snake_case", schema });
}
