import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateFeedItemRequest } from '../../models/requests/CreateFeedItemRequest';
import { createFeedItem } from '../../businessLogic/feed';
import { parseUserId } from '../../utils/auth';
import { makeLogger } from '../../utils/logger';

const logger = makeLogger('createFeed');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Creating new FeedItem`);

  const newFeedItem: CreateFeedItemRequest = JSON.parse(event.body);

  const jwt = event.headers.Authorization.split(' ').pop();
  const userId = parseUserId(jwt);

  try {

    const item = await createFeedItem(newFeedItem, userId);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ item })
    }

  } catch (err) {
    logger.error(err)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "Internal server error"
    }
  }
}