import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
  return btoa(binString);
}

export function textEncoder(str: string) {
  const encoder = new TextEncoder();
  return bytesToBase64(encoder.encode(str));
}

function base64ToBytes(base64: string) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => {
    const codePointAtIndexZero = m.codePointAt(0);
    if (codePointAtIndexZero !== undefined) {
      return codePointAtIndexZero;
    }
    throw new Error("index out of range");
  });
}

export function textDecoder(str: string) {
  const decoder = new TextDecoder();
  return decoder.decode(base64ToBytes(str));
}
