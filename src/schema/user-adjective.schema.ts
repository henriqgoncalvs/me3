import z from 'zod';

export const userAdjectiveInputSchema = z.object({
  adjective: z.string(),
  id: z.string().optional().nullable(),
});

export type UserAdjective = z.TypeOf<typeof userAdjectiveInputSchema> & {
  id: string;
  userId: string;
};
