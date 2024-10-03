import { type OpenNextConfig } from "open-next/types/open-next.js";

const config = {
  default: {
    override: { wrapper: "aws-lambda-streaming" },
  },
  // middleware: {
  //   external: true,
  // },
} satisfies OpenNextConfig;

export default config;
