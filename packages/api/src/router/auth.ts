import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Pumasok na dito");

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
      console.log("🚀 ~ .mutation ~ data:", data);

      if (error) {
        throw new TRPCError({
          message: "Failed to create your account.",
          code: "BAD_REQUEST",
        });
      }

      return data;
    }),
  adminSignin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.from("admins").select().eq("email", input.email).single();

      if (!data || error) {
        throw new TRPCError({
          message: "Invalid credentials.",
          code: "BAD_REQUEST",
        });
      }

      const { error: signInError } = await ctx.supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (signInError) {
        throw new TRPCError({
          message: "Invalid credentials.",
          code: "BAD_REQUEST",
        });
      }

      return data
    }),
});
