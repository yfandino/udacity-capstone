import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateFeedItemRequest } from '../../models/requests/UpdateFeedItemRequest';
import { updateFeedItem } from '../../businessLogic/feed';
import { createLogger } from '../../utils/logger';

const logger = createLogger('createFedd');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
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
