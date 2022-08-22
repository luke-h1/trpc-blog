import z from 'zod';

export const createUserSchmea = z.object({
  name: z.string(),
  email: z.string().email(),
});

export const createUserOutputSchmea = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchmea>;

export const requestOTPSchema = z.object({
  email: z.string().email(),
  redirect: z.string().default('/'),
});

export type requestOTPInput = z.TypeOf<typeof requestOTPSchema>;

export const verifyOTPSchema = z.object({
  hash: z.string(),
});
