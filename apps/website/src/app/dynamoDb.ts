import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: process.env.CACHE_BUCKET_REGION });

async function getPaths(tag: string) {
  try {
    const { Items } = await client.send(
      new QueryCommand({
        TableName: process.env.CACHE_DYNAMO_TABLE,
        KeyConditionExpression: "#tag = :tag",
        ExpressionAttributeNames: {
          "#tag": "tag",
        },
        ExpressionAttributeValues: {
          ":tag": { S: `${process.env.NEXT_BUILD_ID}/${tag}` },
        },
      }),
    );
    return (
      Items?.map(
        (item) =>
          item.path?.S?.replace(`${process.env.NEXT_BUILD_ID}/`, "") ?? "",
      ) ?? []
    );
  } catch (e) {
    console.error("Failed to get by tag", e);
    return [];
  }
}
