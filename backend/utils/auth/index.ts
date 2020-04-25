import { decode, verify } from 'jsonwebtoken';
import fetch from 'node-fetch';
import { Jwt, JwtPayload, Jwks } from '../../models/auth';

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export async function verifyToken(authToken: string, jwksUrl: string): Promise<JwtPayload> {
  const token = getToken(authToken);
  const jwt: Jwt = decode(token, { complete: true }) as Jwt;
  const jwks = await fetch(jwksUrl).then( (res):Object => res.json()) as Jwks;
  const key = jwks.keys.find( key => key.kid === jwt.header.kid);
  
  if (!key) throw new Error('Unauthorized');
  
  const cert = getCert(key.x5c[0]);
  
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload;
}

function getToken(authToken: string): string {
  if (!authToken) throw new Error('No authentication header');

  if (!authToken.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header');

  const split = authToken.split(' ');
  const token = split[1];

  return token;
}

function getCert(key) {
  key = key.match(/.{1,64}/g).join('\n');
  key = `-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----\n`;
  return key;
};