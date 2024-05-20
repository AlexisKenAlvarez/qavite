"use client";

import { api } from "@/trpc/client";
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
  const promptMutation = api.admin.searchAnswer.useMutation();
  const formSchema = z.object({
    message: z.string().min(1),
  });

  type formType = z.infer<typeof formSchema>;

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: formType) => {
    const prompt_data = await promptMutation.mutateAsync({
      prompt: data.message,
    });

    console.log(prompt_data.choices[0]?.text);
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
                  <FormDescription>Ask question</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="text-white"
              disabled={promptMutation.isPending}
            >
              Ask AI
            </Button>
          </form>
        </Form>
      </div>

      <div className="flex h-full flex-col">
        <h1 className="">Output:</h1>
        <div className="mt-2 flex-1 rounded-lg bg-white p-4"></div>
      </div>
    </div>
  );
};

export default TuneHero;
