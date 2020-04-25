import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getFeed } from '../../businessLogic/feed';
import { parseUserId } from '../../utils/auth';
import { makeLogger } from '../../utils/logger';

const logger = makeLogger('getFeed');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(event);

  const jwt = event.headers.Authorization.split(' ').pop();
  const userId = parseUserId(jwt);

  logger.info(`Getting feeds for user: ${userId}`);

  try {

    const items = await getFeed(userId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Request-Method": "GET",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ items })
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