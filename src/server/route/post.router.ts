import {
  createPostSchema,
  getPostSchema,
} from '@frontend/validation/post.schema';
import * as trpc from '@trpc/server';
import { createRouter } from '../createRouter';

export const postRouter = createRouter()
  .mutation('createPost', {
    input: createPostSchema,
    async resolve({ input, ctx }) {
      if (!ctx.user) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'Unauthorized',
        });
      }

      const post = await ctx.prisma?.post.create({
        data: {
          ...input,
          user: { connect: { id: ctx.user.id } },
        },
      });
      return post;
    },
  })
  .query('posts', {
    resolve({ ctx }) {
      return ctx.prisma?.post.findMany();
    },
  })
  .query('post', {
    input: getPostSchema,
    resolve({ input, ctx }) {
      return ctx.prisma?.post.findUnique({
        where: {
          id: input.id,
        },
      });
    },
  });
