import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export function signToken({
  id,
  email,
}: {
  id: string;
  email: string;
}): string {
  return jwt.sign({ id, email }, JWT_SECRET);
}

export function verifyToken<T>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
