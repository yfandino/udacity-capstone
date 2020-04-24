import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateFeedItemRequest } from '../../models/requests/CreateFeedItemRequest';
import { createFeedItem } from '../../businessModel/feed';
import { parseUserId } from '../../utils/auth';
import { createLogger } from '../../utils/logger';

const logger = createLogger('createFedd');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Creating new FeedItem`);

  const item: CreateFeedItemRequest = JSON.parse(event.body);

  const jwt = event.headers.Authorization.split(' ').pop();
  const userId = parseUserId(jwt);

  try {

    const feedItem = await createFeedItem(item, userId);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ feedItem })
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