import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: [
    "./src/server/db/schema/payments.ts",
    "./src/server/db/schema/problems.ts",
    "./src/server/db/schema/submissions.ts",
    "./src/server/db/schema/subscriptions.ts",
    "./src/server/db/schema/languages.ts",
  ],
  dbCredentials: {
    url: env.DATABASE_URL_UNPOOLED,
  },
  dialect: "postgresql",
  tablesFilter: ["!pg_stat_statements_info", "!pg_stat_statements"],
} satisfies Config;
