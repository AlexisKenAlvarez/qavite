/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TRPCError } from "@trpc/server";
import nodemailer from "nodemailer";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  countUser: protectedProcedure.query(async ({ ctx }) => {
    const { count, error } = await ctx.supabase
      .from("users")
      .select("*", { count: "exact" })
      .eq("verified", true);

    if (error) {
      throw new TRPCError({
        message: "Failed to count users",
        code: "BAD_REQUEST",
      });
    }

    return count;
  }),
  addQuestion: protectedProcedure
    .input(
      z.object({
        question: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("questions").insert({
        prompt: input.question,
      });

      if (error) {
        throw new TRPCError({
          message: "Failed to add question",
          code: "BAD_REQUEST",
        });
      }

      return true;
    }),
  deleteQuestion: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("questions")
        .delete()
        .eq("id", input.id);

      if (error) {
        throw new TRPCError({
          message: "Failed to add question",
          code: "BAD_REQUEST",
        });
      }

      return true;
    }),
  deleteChats: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("chats")
        .delete()
        .eq("id", input.id);

      if (error) {
        throw new TRPCError({
          message: "Failed to add question",
          code: "BAD_REQUEST",
        });
      }

      return true;
    }),
  editChat: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        prompt: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("chats")
        .update({
          prompt: input.prompt,
          count: 0,
        })
        .eq("id", input.id);

      if (error) {
        throw new TRPCError({
          message: "Failed to add question",
          code: "BAD_REQUEST",
        });
      }

      return true;
    }),
  editQuestion: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        prompt: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("questions")
        .update({
          prompt: input.prompt,
          count: 0,
        })
        .eq("id", input.id);

      if (error) {
        throw new TRPCError({
          message: "Failed to add question",
          code: "BAD_REQUEST",
        });
      }

      return true;
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
          .eq("status", "closed");

        if (error) {
          throw new TRPCError({
            message: "Failed to count users",
            code: "BAD_REQUEST",
          });
        }

        return count;
      }
    }),
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("users")
      .select("*")
      .eq("verified", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new TRPCError({
        message: "Failed to get users",
        code: "BAD_REQUEST",
      });
    }

    return data;
  }),
  getReports: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("tickets")
      .select("*, author(*)")
      .eq("status", "open");

    if (error) {
      throw new TRPCError({
        message: "Failed to get users",
        code: "BAD_REQUEST",
      });
    }

    return data;
  }),
  sendEmail: protectedProcedure
    .input(
      z.object({
        toSend: z.string().email(),
        message: z.string(),
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false,
          },
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: input.toSend,
          subject: `QAVITE`,
          html: `
          <p>Message: ${input.message} </p>
          `,
        });
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          message: "Failed to send email",
          code: "BAD_REQUEST",
        });
      }

      return true;
    }),
  closeTicket: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("tickets")
        .update({
          status: "closed",
        })
        .eq("id", input.id);

      if (error) {
        throw new TRPCError({
          message: "Failed to close ticket",
          code: "BAD_REQUEST",
        });
      }

      return true;
    }),
    getQuestions: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).default(10),  // Use default value
        cursor: z.number().nullish().default(0),  // Cursor can be null
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit
      const cursor = input.cursor ?? 0
  
      const {data: questionsData, error} = await ctx.supabase
        .from("questions")
        .select("*")
        .order("count", { ascending: false })
        .range(cursor, cursor + limit - 1)

      if (error) {
        throw new TRPCError({
          message: "Failed to get questions",
          code: "BAD_REQUEST",
        });
      }

      const hasMore = questionsData.length === limit
  
      return {
        questionsData,
        nextOffset: hasMore ? cursor + limit : null,
      };
    }),
    getChats: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).default(10),  // Use default value
        cursor: z.number().nullish().default(0),  // Cursor can be null
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit
      const cursor = input.cursor ?? 0
  
      const {data: questionsData, error} = await ctx.supabase
        .from("chats")
        .select("*")
        .order("count", { ascending: false })
        .range(cursor, cursor + limit - 1)

      if (error) {
        throw new TRPCError({
          message: "Failed to get questions",
          code: "BAD_REQUEST",
        });
      }

      const hasMore = questionsData.length === limit
  
      return {
        questionsData,
        nextOffset: hasMore ? cursor + limit : null,
      };
    }),
  setQuickChat: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        value: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input.value);
      const { error } = await ctx.supabase
        .from("chats")
        .update({
          quickchat: input.value,
        })
        .eq("id", input.id);

      if (error) {
        console.log("🚀 ~ .mutation ~ error:", error);
        throw new TRPCError({
          message: "Failed to set quick chat",
          code: "BAD_REQUEST",
        });
      }

      return true;
    }),
  deactivate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        value: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("users")
        .update({
          deactivated: input.value,
        })
        .eq("auth_id", input.id);

      if (error) {
        throw new TRPCError({
          message: "Failed to deactivate user",
          code: "BAD_REQUEST",
        });
      }

      return true;
    }),
  deleteUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("users")
        .delete()
        .eq("auth_id", input.id);

      const { error: authErrorDelete } =
        await ctx.supabase.auth.admin.deleteUser(input.id);

      if (authErrorDelete) {
        throw new TRPCError({
          message: "Failed to delete user",
          code: "BAD_REQUEST",
        });
      }

      if (error) {
        throw new TRPCError({
          message: "Failed to delete user",
          code: "BAD_REQUEST",
        });
      }
    }),
});
