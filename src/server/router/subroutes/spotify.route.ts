import * as trpc from '@trpc/server';
import { z } from 'zod';
import { getTrackSearch, SpotifyApiResponse } from '../../../lib/spotify';
import { searchTrackSpotifyInputSchema } from '../../../schema/spotify.schema';
import { createProtectedRouter } from '../protected-router';

export const spotifyRouter = createProtectedRouter().query('search', {
  input: searchTrackSpotifyInputSchema,
  async resolve({ input }) {
    const { q } = input;

    try {
      const tracksResponse: SpotifyApiResponse = await getTrackSearch({ q });

      const tracks = tracksResponse.tracks?.items.map((track) => ({
        spotifyId: track.id,
        songTitle: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        albumBannerUrl: track.album.images[0]?.url,
        previewUrl: track.preview_url,
      }));

      return tracks || [];
    } catch (e: any) {
      throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: e.message });
    }
  },
});
