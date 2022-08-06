import z from 'zod';

export const usernameInputSchema = z.object({
  username: z.string(),
});

export type UsernameInputSchema = z.TypeOf<typeof usernameInputSchema>;
