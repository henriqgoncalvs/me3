import z from 'zod';

export const userSkillInputSchema = z.object({
  skill: z.string(),
  id: z.string().optional().nullable(),
});

export type UserSkill = z.TypeOf<typeof userSkillInputSchema> & {
  id: string;
  userId: string;
};
