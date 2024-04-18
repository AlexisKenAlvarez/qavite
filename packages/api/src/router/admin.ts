import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  countUser: protectedProcedure.query(async ({ ctx }) => {
    const { count, error } = await ctx.supabase
      .from("users")
      .select("*", { count: "exact" });

    if (error) {
      throw new TRPCError({
        message: "Failed to count users",
        code: "BAD_REQUEST",
      });
    }

    return count;
  }),

  countReports: protectedProcedure
    .input(
      z.object({
        type: z.enum(["all", "finished"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.type === "all") {
        const { count, error } = await ctx.supabase
          .from("tickets")
          .select("*", { count: "exact" });

        if (error) {
          throw new TRPCError({
            message: "Failed to count users",
            code: "BAD_REQUEST",
          });
        }

        return count;
      } else {
        const { count, error } = await ctx.supabase
          .from("tickets")
          .select("*", { count: "exact" })
          .neq("status", "pending");

        if (error) {
          throw new TRPCError({
            message: "Failed to count users",
            code: "BAD_REQUEST",
          });
        }

        return count;
      }
    }),
});
