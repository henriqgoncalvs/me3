// src/server/router/index.ts
import { createRouter } from './router';
import superjson from 'superjson';

import { userRouter } from './subroutes/user.route';
import { spotifyRouter } from './subroutes/spotify.route';
import { userSongsRoute } from './subroutes/user-songs.route';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('spotify.', spotifyRouter)
  .merge('user-songs.', userSongsRoute);

// export type definition of API
export type AppRouter = typeof appRouter;
