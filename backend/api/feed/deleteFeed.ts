import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { deleteFeedItem } from '../../businessLogic/feed';
import { parseUserId } from '../../utils/auth';
import { makeLogger } from '../../utils/logger';

const logger = makeLogger('deleteFeed');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Delete feedItem ${event.pathParameters.feedId}`);

  const id = event.pathParameters.feedId

  const jwt = event.headers.Authorization.split(' ').pop();
  const owner = parseUserId(jwt);

  try {

    await deleteFeedItem(id, owner);

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