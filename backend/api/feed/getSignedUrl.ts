import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { parseUserId } from '../../utils/auth'
import { getSignedURL } from '../../businessLogic/feed'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters.feedId;

  const jwt = event.headers.Authorization.split(' ').pop();
  const owner = parseUserId(jwt);

  const uploadUrl = await getSignedURL(id, owner);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Request-Method': "POST"
    },
    body: JSON.stringify({ uploadUrl })
  }
}
