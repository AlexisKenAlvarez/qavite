/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { TRPCError } from "@trpc/server";
import GPT3Tokenizer from "gpt3-tokenizer";
import nodemailer from "nodemailer";
import oneline from "oneline";
import OpenAI from "openai";
import stripIndent from "strip-indent";
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
          match_count: 10, // Choose the number of matches
        });

        const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
        let tokenCount = 0;
        let contextText = "";

        // Concat matched documents
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (documents && documents.length > 0) {
          for (let i = 0; i < documents.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
            const document = documents[i]!;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const content = document.content;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const encoded = tokenizer.encode(content);
            tokenCount += encoded.text.length;

            // Limit context to max 1500 tokens (configurable)
            if (tokenCount > 1500) {
              break;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            contextText += `${content.trim()}\n---\n`;
          }
        }

        const converted = oneline`You are QAVITE, a helpful assistant trained to response questions about locations within Cavite State University. You will only provide responses based on the dataset that was fine-tuned and not on pre-defined model. Please ensure that all responses are relevant to locations within Cavite State University and adhere to the information provided in the fine-tuned dataset. If you are unsure and the answer is not explicitly written in the documentation, say "Sorry, I don't know how to help withtha "`;

        const prompt = stripIndent(`${converted} 
        
        Context sections:
        ${contextText}

        Question: """
        ${input.prompt}
        """
        `);

        // In production we should handle possible errors
        const completionResponse = await openai.completions.create({
          model: "ft:gpt-3.5-turbo-0125:personal::9D5iwinm",
          prompt,
          max_tokens: 256,
          frequency_penalty: 0,
          presence_penalty: 0,
          temperature: 0.3, // Set to 0 for deterministic results
        });

        return completionResponse;
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
