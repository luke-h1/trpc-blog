import z from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .max(100, 'Max title length is 100')
    .min(1, 'Min title length is 2'),

  body: z.string().min(10, 'Min body length is 10'),
});

export type CreatePostInput = z.TypeOf<typeof createPostSchema>;

export const getPostSchema = z.object({
  id: z.string().uuid(),
});
