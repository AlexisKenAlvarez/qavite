import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  isLoggedIn: publicProcedure.query(({ ctx }) => {
    return ctx.user ? true : false;
  }),
  verifyUser: publicProcedure
    .input(
      z.object({
        token: z.string(),
        auth_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const token = input.token;
      const auth_id = input.auth_id;

      const { data, error } = await ctx.supabase
        .from("verificationTokens")
        .select()
        .eq("token", token)
        .eq("user", auth_id)
        .limit(1)
        .single();

      if (error) {
        throw new TRPCError({
          message: "Failed to verify your account.",
          code: "BAD_REQUEST",
        });
      }

      if (data.user) {
        await ctx.supabase.from("users").update({ verified: true }).eq("auth_id", auth_id);
        await ctx.supabase.from("verificationTokens").delete().eq("token", token);
      }

      return data

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
      const { data, error: createUserError } = await ctx.supabase
        .from("users")
        .insert({
          email: input.email,
          first_name: input.firstname,
          last_name: input.lastname,
        });

      if (createUserError) {
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
      const { data } = await ctx.supabase
        .from("users")
        .select()
        .eq("email", input.email)
        .eq("type", "admin")
        .single();

      if (!data) {
        throw new TRPCError({
          message: "Invalid credentials.",
          code: "BAD_REQUEST",
        });
      }

      const { error: signInError } = await ctx.supabase.auth.signInWithPassword(
        {
          email: input.email,
          password: input.password,
        },
      );

      if (signInError) {
        throw new TRPCError({
          message: "Invalid credentials.",
          code: "BAD_REQUEST",
        });
      }

      return data;
    }),
});
