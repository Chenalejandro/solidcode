import { env } from "./env";
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (env.NEXT_PUBLIC_ENABLE_SENTRY === "true") {
    if (env.NEXT_RUNTIME === "nodejs") {
      await import("../sentry.server.config");
    }

    if (env.NEXT_RUNTIME === "edge") {
      await import("../sentry.edge.config");
    }
  }
}

export const onRequestError = Sentry.captureRequestError;
