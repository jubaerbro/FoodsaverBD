export type AuthTokenPayload = {
  id: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  email: string;
  name: string;
};

import jwt from 'jsonwebtoken';

const APP_JWT_EXPIRES_IN = '30d';

function getJwtSecret() {
  return process.env.JWT_SECRET || 'foodsaver-test-secret';
}

export function signAppToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: APP_JWT_EXPIRES_IN,
  });
}

export function verifyAppToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
  } catch {
    return null;
  }
}
