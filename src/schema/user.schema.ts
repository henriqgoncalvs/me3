import z from 'zod';

export const editUserInputSchema = z.object({
  bio: z.string().max(80).optional(),
  name: z.string().max(30).optional(),
});

export type EditUserInputSchema = z.TypeOf<typeof editUserInputSchema>;
