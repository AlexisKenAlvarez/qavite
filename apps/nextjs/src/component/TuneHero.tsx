/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@qavite/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qavite/ui/form";
import { Input } from "@qavite/ui/input";

interface OutputType {
  messages: {
    role: string;
    content: string;
  }[];
}

const TuneHero = () => {
  const [output, setOutput] = useState<OutputType[]>([]);

  const formSchema = z.object({
    message: z.string().min(1),
    response: z.string().min(1),
  });

  type formType = z.infer<typeof formSchema>;

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      response: "",
    },
  });

  const onSubmit = (data: formType) => {
    const template = {
      messages: [
        {
          role: "system",
          content:
            "You are QAVITE, a helpful assistant trained to response questions about locations within Cavite State University. You will only provide responses based on the dataset that was fine-tuned and not on pre-defined model. Please ensure that all responses are relevant to locations within Cavite State University and adhere to the information provided in the fine-tuned dataset..",
        },
        {
          role: "user",
          content: "",
        },
        {
          role: "assistant",
          content: "",
        },
      ],
    };

    template.messages[1]!.content = data.message;
    template.messages[2]!.content = data.response;

    setOutput((oldArray) => [...oldArray, template]);
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-10">
      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Input placeholder="Prompt" {...field} />
                  </FormControl>
                  <FormDescription>The user prompt</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="response"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI response</FormLabel>
                  <FormControl>
                    <Input placeholder="Response" {...field} />
                  </FormControl>
                  <FormDescription>
                    The assistant response for AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="text-white">
              Convert
            </Button>
          </form>
        </Form>
      </div>

      <div className="flex h-full flex-col">
        <h1 className="">Output:</h1>
        <div className="mt-2 flex-1 rounded-lg bg-white p-4">
          {output.map((item, i) => (
            <pre className="text-wrap" key={i}>
              {JSON.stringify(item, null, 2)}{output.length > 1 && i !== output.length - 1 ? "," : ""}
            </pre>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TuneHero;
