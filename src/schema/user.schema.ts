import z from 'zod';

export const editUserInputSchema = z.object({
  bio: z.string().optional(),
  name: z.string().optional(),
});

export type EditUserInputSchema = z.TypeOf<typeof editUserInputSchema>;
