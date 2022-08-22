import mailService from '@frontend/services/mailService';
import { decode, encode } from '@frontend/utils/base64';
import { signToken } from '@frontend/utils/jwt';
import {
  createUserSchmea,
  requestOTPSchema,
  verifyOTPSchema,
} from '@frontend/validation/user.schema';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as trpc from '@trpc/server';
import { serialize } from 'cookie';
import { createRouter } from '../createRouter';

export const userRouter = createRouter()
  .mutation('register', {
    input: createUserSchmea,
    // eslint-disable-next-line consistent-return
    async resolve({ ctx, input }) {
      const { email, name } = input;

      try {
        const user = await ctx.prisma?.user.create({
          data: {
            email,
            name,
          },
        });
        return user;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          // user already exists
          if (e.code === 'p2002') {
            throw new trpc.TRPCError({
              code: 'CONFLICT',
              message: 'User already exists',
            });
          }
          throw new trpc.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
          });
        }
      }
    },
  })
  .mutation('requestOTP', {
    input: requestOTPSchema,
    async resolve({ input, ctx }) {
      const { email, redirect } = input;

      const user = await ctx.prisma?.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const token = await ctx.prisma?.token.create({
        data: {
          redirect,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      // send email with OTP to user

      mailService.sendEmail(
        user.email,
        process.env.NEXT_PUBLIC_URL,
        encode(`${token?.id}:${user.email}`),
      );
      return true;
    },
  })
  .query('verifyOTP', {
    input: verifyOTPSchema,
    async resolve({ input, ctx }) {
      const { hash } = input;
      const decoded = decode(hash).split(':');

      const [id, email] = decoded;

      const token = await ctx.prisma?.token.findFirst({
        where: {
          id,
          user: {
            email,
          },
        },
        include: {
          user: true,
        },
      });

      if (!token) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'Invalid token',
        });
      }

      const signedToken = signToken({
        id: token.user.id,
        email: token.user.email,
      });

      ctx.res.setHeader(
        'Set-Cookie',
        serialize('token', signedToken, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        }),
      );
    },
  })
  .query('me', {
    resolve({ ctx }) {
      return ctx.user;
    },
  });
