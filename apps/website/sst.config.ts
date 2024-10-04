/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "website",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("SolidCode", {
      openNextVersion: "3.1.3",
      environment: {
        NEXT_PUBLIC_ENABLE_POSTHOG:
          process.env.NEXT_PUBLIC_ENABLE_POSTHOG ?? "",
        NEXT_PUBLIC_ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY ?? "",
        RATE_LIMIT_COUNT: process.env.RATE_LIMIT_COUNT ?? "",
        KV_REST_API_URL: process.env.KV_REST_API_URL ?? "",
        KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ?? "",
        SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN ?? "",
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        SVIX_WEBHOOK_SECRET: process.env.SVIX_WEBHOOK_SECRET ?? "",
        POSTGRES_DRIVER: process.env.POSTGRES_DRIVER ?? "",
        NODE_ENV: process.env.NODE_ENV ?? "",
        MELI_ACCESS_TOKEN: process.env.MELI_ACCESS_TOKEN ?? "",
        MELI_WEBHOOK_SECRET: process.env.MELI_WEBHOOK_SECRET ?? "",
        FUTUREJUDGE_TOKEN: process.env.FUTUREJUDGE_TOKEN ?? "",
        FUTURE_JUDGE_API_URL: process.env.FUTURE_JUDGE_API_URL ?? "",
        NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
        NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "",
        NEXT_PUBLIC_MELI_PUBLIC_KEY:
          process.env.NEXT_PUBLIC_MELI_PUBLIC_KEY ?? "",
        NEXT_PUBLIC_STACK_PROJECT_ID:
          process.env.NEXT_PUBLIC_STACK_PROJECT_ID ?? "",
        NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY:
          process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY ?? "",
        STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY ?? "",
        AUTH_EMAIL: process.env.AUTH_EMAIL ?? "",
        AUTH_EMAIL_PASSWORD: process.env.AUTH_EMAIL_PASSWORD ?? "",
      },
    });
  },
});
