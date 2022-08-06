import { z } from 'zod';

export const tmdbSearchMovieInputSchema = z.object({
  q: z.string(),
});

export type TmdbSearchMovieInputSchema = z.TypeOf<typeof tmdbSearchMovieInputSchema>;
