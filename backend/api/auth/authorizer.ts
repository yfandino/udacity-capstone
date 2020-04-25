import 'source-map-support/register';
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import { makeLogger } from '../../utils/logger';
import { verifyToken } from '../../utils/auth';

const logger = makeLogger('authorizer');
const JWKS_URL: string = process.env.AUTH0_JWTK_URL;

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {

  logger.info(`Validating credetials... ${event.authorizationToken}`);

  try {

    const jwtToken = await verifyToken(event.authorizationToken, JWKS_URL);
    logger.info('User was authorized...');

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    };
  } catch (err) {
    logger.error(err);

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    };
  }
}