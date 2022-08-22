import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export function signToken(data: object): string {
  return jwt.sign(data, JWT_SECRET);
}

export function verifyToken<T>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
