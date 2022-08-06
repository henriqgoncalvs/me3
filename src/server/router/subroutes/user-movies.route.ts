import * as trpc from '@trpc/server';
import { userMovieInputSchema } from '../../../schema/user-movie.schema';
import { createProtectedRouter } from '../protected-router';

export const userMoviesRoute = createProtectedRouter()
  .mutation('add-movie', {
    input: userMovieInputSchema,
    async resolve({ ctx, input }) {
      const { title, tmdbId, posterPath, releaseDate, id } = input;
      const userId = ctx.session.user.id;

      try {
        const foundMovie =
          id &&
          (await ctx.prisma.userMovie.findUnique({
            where: {
              id,
            },
          }));

        if (foundMovie) {
          const updatedMovie = await ctx.prisma.userMovie.update({
            where: {
              id,
            },
            data: {
              title,
              tmdbId,
              posterPath,
              releaseDate,
            },
          });

          return updatedMovie;
        }

        const createdMovie = await ctx.prisma.userMovie.create({
          data: {
            title,
            releaseDate,
            tmdbId,
            posterPath,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });

        return createdMovie;
      } catch (e: any) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: e.message });
      }
    },
  })
  .query('get-movies', {
    async resolve({ ctx }) {
      const userId = ctx.session.user.id;

      try {
        const movies = await ctx.prisma.userMovie.findMany({
          where: {
            user: {
              id: userId,
            },
          },
        });

        return movies;
      } catch (e) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: 'There was an error' });
      }
    },
  });
