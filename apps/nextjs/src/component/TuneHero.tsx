"use client";

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

const TuneHero = () => {
  const template = {
    messages: [
      {
        role: "system",
        content:
          "You are QAVITE, a helpful assistant trained to response questions about locations within Cavite State University. You will only provide responses based on the dataset that was fine-tuned and not on pre-defined model. Please ensure that all responses are relevant to locations within Cavite State University and adhere to the information provided in the fine-tuned dataset..",
      },
      {
        role: "user",
        content: "Can you tell me where I can find the University Library?",
      },
      {
        role: "assistant",
        content:
          "The library is located between Science Cafe and the College of Agriculture, Food, Environment and Natural Resources (CAFENR).",
      },
    ],
  };

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
    console.log(data);
  }

  return (
    <div className="">
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
                  <FormDescription>
                    The user prompt
                  </FormDescription>
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
            <Button type="submit">Convert</Button>
          </form>
        </Form>
      </div>
      <div className=""></div>
    </div>
  );
};

export default TuneHero;
