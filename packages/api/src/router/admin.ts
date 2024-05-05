/* eslint-disable @typescript-eslint/no-misused-promises */
import { TRPCError } from "@trpc/server";
import nodemailer from "nodemailer";
import OpenAI from "openai";
import { z } from "zod";

import { cvsuData } from "../../lib/data";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const adminRouter = createTRPCRouter({
  searchAnswer: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const user_input = input.prompt.replace(/\n/g, " ");

        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: user_input,
        });

        const embedding = embeddingResponse.data[0]?.embedding;

        const { data: documents } = await ctx.supabase.rpc("match_documents", {
          query_embedding: JSON.stringify(embedding),
          match_threshold: 0.78, // Choose an appropriate threshold for your data
          match_count: 5, // Choose the number of matches
        });

        return documents;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          message: "Failed to search for answer",
          code: "BAD_REQUEST",
        });
      }
    }),

  genEmbed: publicProcedure.query(({ ctx }) => {
    try {
      cvsuData.forEach(async (data: string) => {
        // OpenAI recommends replacing newlines with spaces for best results
        const input = data.replace(/\n/g, " ");

        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input,
        });

        const embedding = embeddingResponse.data[0]?.embedding;

        // In production we should handle possible errors
        await ctx.supabase.from("cvsu_data").insert({
          content: data,
          embedding: JSON.stringify(embedding),
        });
      });
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        message: "Failed to generate embeddings",
        code: "BAD_REQUEST",
      });
    }

    return true;
  }),

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
    const { data, error } = await ctx.supabase.from("users").select("*");

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
  getChats: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("chats")
      .select("*")
      .order("count", { ascending: false })
      .limit(15);

    if (error) {
      throw new TRPCError({
        message: "Failed to get users",
        code: "BAD_REQUEST",
      });
    }

    return data;
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
});
