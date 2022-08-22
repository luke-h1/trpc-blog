import { AppRouter } from '@frontend/server/route/app.router';
import { createReactQueryHooks } from '@trpc/react';
import type { inferProcedureOutput } from '@trpc/server';

export const trpc = createReactQueryHooks<AppRouter>();

export type InferQueryOutput<
  TRouteKey extends keyof AppRouter['_def']['queries'],
> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>;
