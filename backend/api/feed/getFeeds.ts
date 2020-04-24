import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getFeed } from '../../businessModel/feed';
import { parseUserId } from '../../utils/auth';
import { createLogger } from '../../utils/logger';

const logger = createLogger('createFedd');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const jwt = event.headers.Authorization.split(' ').pop();
  const userId = parseUserId(jwt);

  logger.info(`Getting feeds for user: ${userId}`);

  try {

    const feed = await getFeed(userId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Request-Method": "GET",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ feed })
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