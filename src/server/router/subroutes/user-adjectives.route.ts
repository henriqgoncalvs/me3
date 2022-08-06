import * as trpc from '@trpc/server';
import { userAdjectiveInputSchema } from '../../../schema/user-adjective.schema';
import { createProtectedRouter } from '../protected-router';

export const userAdjectivesRoute = createProtectedRouter()
  .mutation('add-adjective', {
    input: userAdjectiveInputSchema,
    async resolve({ ctx, input }) {
      const { adjective, id } = input;
      const userId = ctx.session.user.id;

      try {
        const foundAdjective =
          id &&
          (await ctx.prisma.userAdjective.findUnique({
            where: {
              id,
            },
          }));

        if (foundAdjective) {
          const updatedAdjective = await ctx.prisma.userAdjective.update({
            where: {
              id,
            },
            data: {
              adjective,
            },
          });

          return updatedAdjective;
        }

        const createdAdjective = await ctx.prisma.userAdjective.create({
          data: {
            adjective,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });

        return createdAdjective;
      } catch (e: any) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: e.message });
      }
    },
  })
  .query('get-adjectives', {
    async resolve({ ctx }) {
      const userId = ctx.session.user.id;

      try {
        const adjectives = await ctx.prisma.userAdjective.findMany({
          where: {
            user: {
              id: userId,
            },
          },
        });

        return adjectives;
      } catch (e: any) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: e.message });
      }
    },
  });
