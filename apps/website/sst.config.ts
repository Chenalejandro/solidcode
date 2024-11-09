/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "website",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: { awsx: "2.17.0", aws: "6.58.0" },
    };
  },
  async run() {
    const vpc = new awsx.ec2.Vpc("vpc");

    const securityGroup = new aws.ec2.SecurityGroup("securityGroup", {
      vpcId: vpc.vpcId,
      egress: [
        {
          fromPort: 0,
          toPort: 0,
          protocol: "-1",
          cidrBlocks: ["0.0.0.0/0"],
          ipv6CidrBlocks: ["::/0"],
        },
      ],
    });

    const cluster = new aws.ecs.Cluster("cluster");

    const lb = new awsx.lb.ApplicationLoadBalancer("lb");

    const service = new awsx.ecs.EC2Service("service", {
      cluster: cluster.arn,
      networkConfiguration: {
        subnets: vpc.privateSubnetIds,
        securityGroups: [securityGroup.id],
      },
      desiredCount: 1,
      taskDefinitionArgs: {
        container: {
          name: "futurejudge",
          image: "alejandrochen97/futurejudge",
          privileged: true,
          cpu: 2,
          memory: 2048,
          essential: true,
          portMappings: [
            {
              containerPort: 80,
              targetGroup: lb.defaultTargetGroup,
            },
          ],
        },
      },
    });

    lb.loadBalancer.dnsName;
    new sst.aws.Nextjs("SolidCode", {
      openNextVersion: "3.2.1",
      server: {
        architecture: "x86_64",
        memory: "2048 MB",
      },
      environment: {
        NEXT_PUBLIC_ENABLE_POSTHOG:
          process.env.NEXT_PUBLIC_ENABLE_POSTHOG ?? "",
        NEXT_PUBLIC_ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY ?? "",
        RATE_LIMIT_COUNT: process.env.RATE_LIMIT_COUNT ?? "",
        KV_REST_API_URL: process.env.KV_REST_API_URL ?? "",
        KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ?? "",
        SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN ?? "",
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED ?? "",
        SVIX_WEBHOOK_SECRET: process.env.SVIX_WEBHOOK_SECRET ?? "",
        POSTGRES_DRIVER: process.env.POSTGRES_DRIVER ?? "",
        NODE_ENV: process.env.NODE_ENV ?? "",
        MELI_ACCESS_TOKEN: process.env.MELI_ACCESS_TOKEN ?? "",
        MELI_WEBHOOK_SECRET: process.env.MELI_WEBHOOK_SECRET ?? "",
        FUTUREJUDGE_TOKEN: process.env.FUTUREJUDGE_TOKEN ?? "",
        FUTURE_JUDGE_API_URL: process.env.FUTURE_JUDGE_API_URL ?? "",
        NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
        NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "",
        NEXT_PUBLIC_MELI_PUBLIC_KEY:
          process.env.NEXT_PUBLIC_MELI_PUBLIC_KEY ?? "",
        NEXT_PUBLIC_STACK_PROJECT_ID:
          process.env.NEXT_PUBLIC_STACK_PROJECT_ID ?? "",
        NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY:
          process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY ?? "",
        STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY ?? "",
        AUTH_EMAIL: process.env.AUTH_EMAIL ?? "",
        AUTH_EMAIL_PASSWORD: process.env.AUTH_EMAIL_PASSWORD ?? "",
      },
    });
  },
});
