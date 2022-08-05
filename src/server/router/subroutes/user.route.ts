import { createUsernameInputSchema } from '../../../schema/username.schema';
import * as trpc from '@trpc/server';
import { createProtectedRouter } from '../protected-router';
import { editUserInputSchema } from '../../../schema/user.schema';

// Example router with queries that can only be hit if the user requesting is signed in
export const userRouter = createProtectedRouter()
  .mutation('username', {
    input: createUsernameInputSchema,
    async resolve({ ctx, input }) {
      const foundUser = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (foundUser) {
        throw new trpc.TRPCError({ code: 'CONFLICT', message: 'Username already exists' });
      }

      try {
        const updateUser = await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            username: input.username,
          },
        });

        return updateUser;
      } catch (e) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: 'There was an error' });
      }
    },
  })
  .mutation('edit-user', {
    input: editUserInputSchema,
    async resolve({ ctx, input }) {
      try {
        const updateUser = await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            ...input,
          },
        });

        return updateUser;
      } catch (e) {
        throw new trpc.TRPCError({ code: 'BAD_REQUEST', message: 'There was an error' });
      }
    },
  });
