import * as AWS from 'aws-sdk';
import { FeedItem } from '../models/feed/FeedItem';
import { makeLogger } from '../utils/logger';

const logger = makeLogger('feedDataLayer');

const FEEDS_TABLE = process.env.FEEDS_TABLE;
const FEEDS_ID_INDEX = process.env.TODOS_ID_INDEX;

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance');
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}

export async function createOrUpdate(feedItem: FeedItem, action: string): Promise<FeedItem> {
  logger.info(`${action} feedItem : ${JSON.stringify(feedItem, null, 2)}`);

  if (action === "Update") {
    feedItem.updatedAt = new Date().toISOString();
  }

  const DocumentClient = createDynamoDBClient();

  await DocumentClient.put({
    TableName: FEEDS_TABLE,
    Item: feedItem
  }).promise();

  return feedItem;
}

export async function getAll(owner: string): Promise<FeedItem[]> {
  logger.info(`Getting feed for user: ${owner}`);

  const DocumentClient = createDynamoDBClient();
console.log(FEEDS_TABLE)
  const result = await DocumentClient.query({
    TableName: FEEDS_TABLE,
    IndexName: FEEDS_ID_INDEX,
    KeyConditionExpression: '#owner = :owner',
    ExpressionAttributeNames: {
      "#owner": "owner"
    },
    ExpressionAttributeValues: {
      ':owner': owner
    },
    ScanIndexForward: false
  }).promise();
  
  return result.Items as FeedItem[];
}

export async function deleteItem(id: string, owner: string): Promise<void> {
  logger.info(`Delete feedItem : ${id}`);
  const DocumentClient = createDynamoDBClient();
  
  await DocumentClient.delete({
    TableName: FEEDS_TABLE,
    Key: {
      owner,
      id
    }
  }).promise();
}

export async function addFeedItemURL(bucket: string, key: string): Promise<void> {
  logger.info(`Adding URL to feedItem`);

  const DocumentClient = createDynamoDBClient();

  const split = key.split("/");
  const owner = split[0];
  const id = split[1];

  await DocumentClient.update({
    TableName: FEEDS_TABLE,
    Key: {
      "owner": owner,
      "id": id
    },
    UpdateExpression: "set #url = :url",
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ExpressionAttributeValues: {
      ":name" : `https://${bucket}.s3.amazonaws.com/${key}`
    },
    ReturnValues: "ALL_NEW"
  }).promise();
}