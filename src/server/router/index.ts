// src/server/router/index.ts
import { createRouter } from './router';
import superjson from 'superjson';

import { userRouter } from './subroutes/user.route';
import { spotifyRouter } from './subroutes/spotify.route';
import { userSongsRoute } from './subroutes/user-songs.route';
import { userMoviesRoute } from './subroutes/user-movies.route';
import { tmdbRouter } from './subroutes/tmdb.route';
import { userAdjectivesRoute } from './subroutes/user-adjectives.route';
import { userSkillsRoute } from './subroutes/user-skills.route';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('spotify.', spotifyRouter)
  .merge('tmdb.', tmdbRouter)
  .merge('user-songs.', userSongsRoute)
  .merge('user-movies.', userMoviesRoute)
  .merge('user-adjectives.', userAdjectivesRoute)
  .merge('user-skills.', userSkillsRoute);

// export type definition of API
export type AppRouter = typeof appRouter;
