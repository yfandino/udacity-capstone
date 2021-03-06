import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateFeedItemRequest } from '../../models/requests/UpdateFeedItemRequest';
import { updateFeedItem } from '../../businessLogic/feed';
import { makeLogger } from '../../utils/logger';

const logger = makeLogger('updateFeed');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`Updating feedItem ${event.body}`);

  const feedItem: UpdateFeedItemRequest = JSON.parse(event.body)

  try {

    await updateFeedItem(feedItem);

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ""
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
