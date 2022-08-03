// src/server/router/index.ts
import { createRouter } from './router';
import superjson from 'superjson';

import { exampleRouter } from './example';
import { protectedExampleRouter } from './protected-example-router';
import { userRouter } from './subroutes/user.route';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('example.', exampleRouter)
  .merge('question.', protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
