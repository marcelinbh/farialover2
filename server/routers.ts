import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  profiles: router({
    list: publicProcedure.query(async () => {
      const { getAllProfiles } = await import('./supabase');
      return getAllProfiles();
    }),
  }),

  comments: router({
    list: publicProcedure
      .input((val: unknown) => {
        if (typeof val === 'object' && val !== null && 'profileId' in val && typeof (val as any).profileId === 'number') {
          return val as { profileId: number };
        }
        throw new Error('Invalid input: profileId must be a number');
      })
      .query(async ({ input }) => {
        const { getCommentsByProfile } = await import('./supabase');
        return getCommentsByProfile(input.profileId);
      }),
    create: publicProcedure
      .input((val: unknown) => {
        if (
          typeof val === 'object' &&
          val !== null &&
          'profileId' in val &&
          'authorName' in val &&
          'commentText' in val &&
          typeof (val as any).profileId === 'number' &&
          typeof (val as any).authorName === 'string' &&
          typeof (val as any).commentText === 'string'
        ) {
          return val as { profileId: number; authorName: string; commentText: string };
        }
        throw new Error('Invalid input: profileId, authorName, and commentText are required');
      })
      .mutation(async ({ input }) => {
        const { createComment } = await import('./supabase');
        return createComment(input.profileId, input.authorName, input.commentText);
      }),
  }),
});

export type AppRouter = typeof appRouter;
