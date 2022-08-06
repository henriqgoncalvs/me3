import * as trpc from '@trpc/server';
import { userSkillInputSchema } from '../../../schema/user-skill.schema';
import { createProtectedRouter } from '../protected-router';

export const userSkillsRoute = createProtectedRouter()
  .mutation('add-skill', {
    input: userSkillInputSchema,
    async resolve({ ctx, input }) {
      const { skill, id } = input;
      const userId = ctx.session.user.id;

      try {
        const foundSkill =
          id &&
          (await ctx.prisma.userSkills.findUnique({
            where: {
              id,
            },
          }));

        if (foundSkill) {
          const updatedSkill = await ctx.prisma.userSkills.update({
            where: {
              id,
            },
            data: {
              skill,
            },
          });

          return updatedSkill;
        }

        const createdSkill = await ctx.prisma.userSkills.create({
          data: {
            skill,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });

        return createdSkill;
      } catch (e: any) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: e.message });
      }
    },
  })
  .query('get-skills', {
    async resolve({ ctx }) {
      const userId = ctx.session.user.id;

      try {
        const skills = await ctx.prisma.userSkills.findMany({
          where: {
            user: {
              id: userId,
            },
          },
        });

        return skills;
      } catch (e: any) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: e.message });
      }
    },
  });
