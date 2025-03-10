/**
 * You can run `build` or `dev` (or `lint`) with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import { env } from "./src/env.js";
import nextMdx from "@next/mdx";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import { type NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const withMdx = nextMdx({
  // By default only the `.mdx` extension is supported.
  extension: /\.mdx?$/,
  options: {
    /* otherOptions… */
  },
});

const config: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config, options) => {
    if (!options.isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          // you can add other languages here as needed
          // (list of languages: https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages)
          languages: ["javascript", "typescript", "php", "python", "cpp"],
          filename: "static/[name].worker.[contenthash].js",
        }),
      );
    }
    return config;
  },
  pageExtensions: ["md", "mdx", "tsx", "ts", "jsx", "js"],
  rewrites: async () => {
    return {
      // Disallow access to the source nap files.
      beforeFiles: [
        {
          source: "/:path*.map",
          destination: "/404",
        },
      ],
      afterFiles: [
        {
          source: "/ingest/static/:path*",
          destination: "https://us-assets.i.posthog.com/static/:path*",
        },
        {
          source: "/ingest/:path*",
          destination: "https://us.i.posthog.com/:path*",
        },
        {
          source: "/ingest/decide",
          destination: "https://us.i.posthog.com/decide",
        },
      ],
      fallback: [],
    };
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

const withNextIntlWithMdxConfig = withNextIntl(withMdx(config));

const finalConfig =
  env.NEXT_PUBLIC_ENABLE_SENTRY === "false"
    ? withNextIntlWithMdxConfig
    : withSentryConfig(withNextIntlWithMdxConfig, {
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options

        org: "solid-code-fm",
        project: "javascript-nextjs",

        silent: false,

        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces (increases build time)
        widenClientFileUpload: true,

        authToken: env.SENTRY_AUTH_TOKEN,

        // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
        // This can increase your server load as well as your hosting bill.
        // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
        // side errors will fail.
        tunnelRoute: "/monitoring-tunnel",

        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true,

        // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
        // See the following for more information:
        // https://docs.sentry.io/product/crons/
        // https://vercel.com/docs/cron-jobs
        automaticVercelMonitors: true,
      });

export default finalConfig;
