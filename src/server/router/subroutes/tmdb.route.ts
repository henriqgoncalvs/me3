import * as trpc from '@trpc/server';
import { getMovieSearch, TMDBApiResponse } from '../../../lib/tmdb';
import { tmdbSearchMovieInputSchema } from '../../../schema/tmdb.schema';
import { createProtectedRouter } from '../protected-router';

export const tmdbRouter = createProtectedRouter().query('search-movie', {
  input: tmdbSearchMovieInputSchema,
  async resolve({ input }) {
    const { q } = input;

    try {
      const moviesResponse: TMDBApiResponse = await getMovieSearch({ q });

      const movies = moviesResponse.results.slice(0, 5).map((movie) => ({
        tmdbId: movie.id.toString(),
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
      }));

      return movies || [];
    } catch (e: any) {
      throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: e.message });
    }
  },
});
