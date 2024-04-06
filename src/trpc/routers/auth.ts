import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  isLoggedIn: publicProcedure.query(({ ctx }) => {
    return ctx.user ? true : false;
  }),
  createUser: publicProcedure
    .input(
      z.object({
        firstname: z.string().min(1),
        lastname: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(3).max(20),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            firstname: input.firstname,
            lastname: input.lastname,
          },
        },
      });

      if (error) {
        throw new TRPCError({
          message: "Failed to create your account.",
          code: "BAD_REQUEST",
        });
      }

      return data;
    }),
});
