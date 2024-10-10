import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    RATE_LIMIT_COUNT: z
      .string()
      .transform((s) => parseInt(s, 10))
      .pipe(z.number().positive()),
    KV_REST_API_URL: z.string().url(),
    KV_REST_API_TOKEN: z.string(),
    DATABASE_URL: z.string().url(),
    DATABASE_URL_UNPOOLED: z.string().url(),
    POSTGRES_DRIVER: z.enum(["postgres", "vercel"]),
    MELI_ACCESS_TOKEN: z.string(),
    MELI_WEBHOOK_SECRET: z.string(),
    SVIX_WEBHOOK_SECRET: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    FUTUREJUDGE_TOKEN: z.string(),
    FUTURE_JUDGE_API_URL: z.string().url(),
    SENTRY_AUTH_TOKEN: z.string(),
    STACK_SECRET_SERVER_KEY: z.string(),
    AUTH_EMAIL: z.string().email().default("chenalejandro@outlook.com"),
    AUTH_EMAIL_PASSWORD: z.string().default("12345678"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_ENABLE_POSTHOG: z.enum(["true", "false"]),
    NEXT_PUBLIC_ENABLE_SENTRY: z.enum(["true", "false"]),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
    NEXT_PUBLIC_MELI_PUBLIC_KEY: z.string(),
    NEXT_PUBLIC_STACK_PROJECT_ID: z.string(),
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: z.string(),
    NEXT_PUBLIC_STACK_ALLOW_INSECURE_COOKIES: z.enum(["true", "false"]).optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_STACK_ALLOW_INSECURE_COOKIES: process.env.NEXT_PUBLIC_STACK_ALLOW_INSECURE_COOKIES,
    NEXT_PUBLIC_ENABLE_POSTHOG: process.env.NEXT_PUBLIC_ENABLE_POSTHOG,
    NEXT_PUBLIC_ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY,
    RATE_LIMIT_COUNT: process.env.RATE_LIMIT_COUNT,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
    SVIX_WEBHOOK_SECRET: process.env.SVIX_WEBHOOK_SECRET,
    POSTGRES_DRIVER: process.env.POSTGRES_DRIVER,
    NODE_ENV: process.env.NODE_ENV,
    MELI_ACCESS_TOKEN: process.env.MELI_ACCESS_TOKEN,
    MELI_WEBHOOK_SECRET: process.env.MELI_WEBHOOK_SECRET,
    FUTUREJUDGE_TOKEN: process.env.FUTUREJUDGE_TOKEN,
    FUTURE_JUDGE_API_URL: process.env.FUTURE_JUDGE_API_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_MELI_PUBLIC_KEY: process.env.NEXT_PUBLIC_MELI_PUBLIC_KEY,
    NEXT_PUBLIC_STACK_PROJECT_ID: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY:
      process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
    STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY,
    AUTH_EMAIL: process.env.AUTH_EMAIL,
    AUTH_EMAIL_PASSWORD: process.env.AUTH_EMAIL_PASSWORD,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
