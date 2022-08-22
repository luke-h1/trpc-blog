import { verifyToken } from '@frontend/utils/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

interface ContextUser {
  id: string;
  email: string;
  name: string;
  iat: string;
  exp: number;
}

function getUserFromRequest(req: NextApiRequest): ContextUser | null {
  const { token } = req.cookies;

  if (token) {
    try {
      const valid = verifyToken<ContextUser>(token);
      return valid;
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function createContext(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req);
  return { req, res, prisma, user };
}

export type Context = ReturnType<typeof createContext>;
