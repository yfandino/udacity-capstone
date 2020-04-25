import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { parseUserId } from '../../utils/auth';
import { getSignedURL } from '../../businessLogic/feed';
import { makeLogger } from '../../utils/logger';

const logger = makeLogger('createFeed');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`Creating new upload url`);
  
  const id = event.pathParameters.feedId;

  const jwt = event.headers.Authorization.split(' ').pop();
  const owner = parseUserId(jwt);

  try {
    
    const url = await getSignedURL(id, owner);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Request-Method': "POST"
      },
      body: JSON.stringify({ url })
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
