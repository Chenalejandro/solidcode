import "server-only";
import { createHmac } from "node:crypto";
import { env } from "@/env";

export function verifyRequest(headers: Headers, urlParams: URLSearchParams) {
  const xSignature = headers.get("x-signature") ?? "";
  const xRequestId = headers.get("x-request-id") ?? "";
  const dataID = urlParams.get("data.id");

  const parts = xSignature.split(",");
  let ts;
  let hash;
  parts.forEach((part) => {
    // Split each part into key and value
    const [key, value] = part.split("=");
    if (key && value) {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      if (trimmedKey === "ts") {
        ts = trimmedValue;
      } else if (trimmedKey === "v1") {
        hash = trimmedValue;
      }
    }
  });

  // Generate the manifest string
  const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

  // Create an HMAC signature
  const hmac = createHmac("sha256", env.MELI_WEBHOOK_SECRET);
  hmac.update(manifest);

  // Obtain the hash result as a hexadecimal string
  const sha = hmac.digest("hex");

  if (sha !== hash) {
    throw new Error("HMAC verification failed");
  }
}
