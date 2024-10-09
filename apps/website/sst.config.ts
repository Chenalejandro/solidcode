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
      buildCommand: ["npx", "--yes", `@opennextjs/aws@3.1.4`, "build"].join(
        " ",
      ),
      openNextVersion: "3.1.4",
      server: {
        architecture: "x86_64",
        memory: "2048 MB",
      },
      environment: {
        // This env var is not needed for production. It is only needed when running e2e tests.
        // NEXT_PUBLIC_ALLOW_INSECURE_COOKIES: process.env.NEXT_PUBLIC_ALLOW_INSECURE_COOKIES,
        NEXT_PUBLIC_ENABLE_POSTHOG:
          process.env.NEXT_PUBLIC_ENABLE_POSTHOG ?? "",
        NEXT_PUBLIC_ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY ?? "",
        RATE_LIMIT_COUNT: process.env.RATE_LIMIT_COUNT ?? "",
        KV_REST_API_URL: process.env.KV_REST_API_URL ?? "",
        KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ?? "",
        SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN ?? "",
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED ?? "",
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
