import "server-only";
import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie", // storing auth tokens in cookies
  //there is other parameter named "urls" which is covered later in the docs
  urls: {
    signIn: "/signin",
    signUp: "/signup",
  },
});
