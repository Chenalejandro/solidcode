import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import { Resource } from "sst";

const cloudFront = new CloudFrontClient({});

async function invalidateCloudFrontPaths(paths: string[]) {
  await cloudFront.send(
    new CreateInvalidationCommand({
      // Set CloudFront distribution ID here
      DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: `${Date.now()}`,
        Paths: {
          Quantity: paths.length,
          Items: paths,
        },
      },
    }),
  );
}
