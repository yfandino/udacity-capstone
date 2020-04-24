import * as AWS from 'aws-sdk';
import { FeedItem } from '../models/feed/FeedItem';
import { createLogger } from '../utils/logger';

const logger = createLogger('feedDataLayer');

const FEEDS_TABLE = process.env.FEEDS_TABLE;
const FEEDS_ID_INDEX = process.env.TODOS_ID_INDEX;

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}

export async function create(feedItem: FeedItem): Promise<FeedItem> {
  logger.info(`Creating feedItem : ${feedItem}`);

  const DocumentClient = createDynamoDBClient();

  await DocumentClient.put({
    TableName: FEEDS_TABLE,
    Item: feedItem
  }).promise();

  return feedItem;
}

export async function getAll(owner: string): Promise<FeedItem[]> {
  logger.info(`Getting feed for user: ${owner}`);

  const DocumentClient = createDynamoDBClient()

  const result = await DocumentClient.query({
    TableName: FEEDS_TABLE,
    IndexName: FEEDS_ID_INDEX,
    KeyConditionExpression: 'owner = :owner',
    ScanIndexForward: false
  }).promise();
  
  return result.Items as FeedItem[];
}