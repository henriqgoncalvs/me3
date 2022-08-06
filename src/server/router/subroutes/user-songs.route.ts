import * as trpc from '@trpc/server';
import { z } from 'zod';
import { userSongInputSchema } from '../../../schema/user-song.schema';
import { createProtectedRouter } from '../protected-router';

export const userSongsRoute = createProtectedRouter()
  .mutation('add-song', {
    input: userSongInputSchema,
    async resolve({ ctx, input }) {
      const { songTitle, artist, albumBannerUrl, previewUrl, spotifyId, id } = input;
      const userId = ctx.session.user.id;

      try {
        const foundSong =
          id &&
          (await ctx.prisma.userSong.findUnique({
            where: {
              id,
            },
          }));

        if (foundSong) {
          const updatedSong = await ctx.prisma.userSong.update({
            where: {
              id,
            },
            data: {
              songTitle,
              artist,
              albumBannerUrl,
              previewUrl,
              spotifyId,
            },
          });

          return updatedSong;
        }

        const createdSong = await ctx.prisma.userSong.create({
          data: {
            songTitle: songTitle,
            artist: artist,
            spotifyId,
            albumBannerUrl,
            previewUrl,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });

        return createdSong;
      } catch (e) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: 'There was an error' });
      }
    },
  })
  .query('get-songs', {
    async resolve({ ctx }) {
      const userId = ctx.session.user.id;

      try {
        const songs = await ctx.prisma.userSong.findMany({
          where: {
            user: {
              id: userId,
            },
          },
        });

        return songs;
      } catch (e) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: 'There was an error' });
      }
    },
  });
