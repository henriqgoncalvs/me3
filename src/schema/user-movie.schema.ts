import z from 'zod';

export const userMovieInputSchema = z.object({
  title: z.string(),
  posterPath: z.string().optional().nullable(),
  releaseDate: z.string().optional().nullable(),
  tmdbId: z.string(),
  id: z.string().optional().nullable(),
});

export type UserMovie = z.TypeOf<typeof userMovieInputSchema> & {
  id: string;
  userId: string;
};
