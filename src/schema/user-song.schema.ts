import z from 'zod';

export const userSongInputSchema = z.object({
  songTitle: z.string(),
  artist: z.string(),
  spotifyId: z.string(),
  albumBannerUrl: z.string().optional().nullable(),
  previewUrl: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
});

export type UserSong = {
  songTitle: string;
  artist: string;
  spotifyId: string;
  albumBannerUrl?: string | null;
  previewUrl?: string | null;
  id: string;
  userId: string;
};
