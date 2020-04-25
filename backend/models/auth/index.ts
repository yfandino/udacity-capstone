import { JwtHeader } from 'jsonwebtoken';

export interface Jwt {
  header: JwtHeader
  payload: JwtPayload
}

export interface JwtPayload {
  iss: string
  sub: string
  iat: number
  exp: number
}

export interface Jwks {
  keys: Array<Key>
}

interface Key {
  alg: string,
  kty: string,
  use: string,
  n: string,
  e: string,
  kid: string,
  x5t: string,
  x5c: Array<string>
}