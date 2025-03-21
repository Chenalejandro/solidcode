import {
  NextResponse,
  type NextMiddleware,
  type NextRequest,
  type MiddlewareConfig,
  type NextFetchEvent,
} from "next/server";
import { env } from "@/env";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// import { auth } from "@/auth";
// export default auth((req) => {
//   return middleware(req);
// })

// FIXME: this cannot be done since we are using the basic tier of svix
// const allowedSvixOrigins = [
//   "44.228.126.217",
//   "50.112.21.217",
//   "52.24.126.164",
//   "54.148.139.208",
//   "2600:1f24:64:8000::/52",
//   "54.164.207.221",
//   "54.90.7.123",
//   "2600:1f28:37:4000::/52",
//   "52.215.16.239",
//   "54.216.8.72",
//   "63.33.109.123",
//   "2a05:d028:17:8000::/52",
//   "13.126.41.108",
//   "15.207.218.84",
//   "65.2.133.31",
// ];

function withExtraMiddleware(next: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // FIXME: this cannot be done since we are using the basic tier of svix
    // if (env.NODE_ENV !== "development") {
    //   if (request.nextUrl.pathname === "/api/webhooks/user" || request.nextUrl.pathname === "/api/webhooks/submission") {
    //     if (!allowedSvixOrigins.includes(request.ip ?? "")) {
    //       return new Response("Forbidden", { status: 403 });
    //     }
    //   }
    // }

    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
    default-src 'self';
    script-src 'self' ${
      request.nextUrl.pathname === "/es" || request.nextUrl.pathname === "/es/"
        ? ""
        : `'nonce-${nonce}'`
    };
    script-src-elem 'self' ${
      request.nextUrl.pathname === "/es" || request.nextUrl.pathname === "/es/"
        ? "'unsafe-inline'"
        : `'nonce-${nonce}' ${env.NODE_ENV === "development" ? "" : "'strict-dynamic'"}`
    }
      ${env.NODE_ENV === "development" ? "https://unpkg.com/react-scan/dist/auto.global.js" : ""}
      https://us-assets.i.posthog.com
      https://http2.mlstatic.com
      https://*.mercadopago.com
      https://*.mercadolibre.com;
    style-src 'self' 'nonce-${nonce}';
    style-src-elem 'self' 'unsafe-inline';
    style-src-attr 'self' 'unsafe-inline';
    img-src 'self'
      data:
      https://avatars.githubusercontent.com
      https://secure.gravatar.com
      https://*.mercadopago.com
      https://*.mercadolibre.com
      https://*.mercadolivre.com;
    font-src 'self';
    object-src 'none';
    base-uri 'none';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    worker-src 'self' blob:;
    frame-src 'self'
      https://*.mercadopago.com
      https://*.mercadolibre.com;
    connect-src 'self' ${env.NODE_ENV === "development" ? "http://localhost:8102" : ""}
      data:
      https://o4507580172664832.ingest.us.sentry.io
      https://us-assets.i.posthog.com
      https://us.i.posthog.com
      https://http2.mlstatic.com
      https://*.mercadopago.com
      https://*.mercadolibre.com
      https://*.stack-auth.com
      https://*.solidcode.pro;
  `;

    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
      .replace(/\s{2,}/g, " ")
      .trim();

    const requestHeaders = new Headers(request.headers);
    request.headers.set("x-nonce", nonce);
    request.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue,
    );

    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue,
    );

    const response = request.nextUrl.pathname.startsWith("/api")
      ? NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
      : await next(request, event);

    response?.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue,
    );

    return response;
  };
}

export default withExtraMiddleware(createMiddleware(routing));

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap file)
     * - robots.txt (robots file)
     */
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|monitoring-tunnel|ingest).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
