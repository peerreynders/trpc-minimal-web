import { router } from '@trpc/server';
import { z } from 'zod';

type Context = {};

function createContext(): Context {
  return {};
}

const queryInput = z
  .object({
    name: z.string(),
  })
  .nullish();

const appRouter = router<Context>().query('hello', {
  input: queryInput,
  resolve({ input }) {
    return {
      text: `hello ${input?.name ?? 'world'}`,
    };
  },
});

export type AppRouter = typeof appRouter;

export { appRouter, createContext };
