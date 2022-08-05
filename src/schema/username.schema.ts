import z from 'zod';

export const createUsernameInputSchema = z.object({
  username: z.string(),
});

export type CreateUsernameInput = z.TypeOf<typeof createUsernameInputSchema>;
