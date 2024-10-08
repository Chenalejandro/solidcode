import { type OpenNextConfig } from "@opennextjs/aws/types/open-next.js";

const config = {
  default: {
    override: { wrapper: "aws-lambda-streaming" },
  },
  // middleware: {
  //   external: true,
  // },
} satisfies OpenNextConfig;

export default config;
