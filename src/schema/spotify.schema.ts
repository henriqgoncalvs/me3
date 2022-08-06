import z from 'zod';

export const searchTrackSpotifyInputSchema = z.object({
  q: z.string(),
});

export type SearchTrackSpotifyInputSchema = z.TypeOf<typeof searchTrackSpotifyInputSchema>;
