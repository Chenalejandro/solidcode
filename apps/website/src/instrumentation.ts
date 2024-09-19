import { env } from "./env";

export async function register() {
  if (env.NEXT_PUBLIC_ENABLE_SENTRY === "true") {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("../sentry.server.config");
    }

    if (process.env.NEXT_RUNTIME === "edge") {
      await import("../sentry.edge.config");
    }
  }
}
