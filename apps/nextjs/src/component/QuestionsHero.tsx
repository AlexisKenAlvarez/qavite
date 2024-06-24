/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { api } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { z } from "zod";

import { Button } from "@qavite/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qavite/ui/form";
import { Input } from "@qavite/ui/input";


const QuestionsHero = () => {
  const { data: questionData, fetchNextPage } =
    api.admin.getQuestions.useInfiniteQuery(
      {
        limit: 10,
        offset: 0,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextOffset;
        },
        refetchOnMount: true,
      },
    );
  const utils = api.useUtils();
  const addQuestion = api.admin.addQuestion.useMutation();

  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const formSchema = z.object({
    prompt: z.string().min(7, {
      message: "Must be at least 7 characters",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  useEffect(() => {
    if (inView) {
      void (async () => {
        console.log("Fetching now");
        await fetchNextPage();
      })();
    }
  }, [inView]);

  return (
    <div>
      <div className="w-full">
        <h1 className="font-primary text-3xl font-bold text-primary">
          Questions
        </h1>

        <Form {...form} key={"PROMPTFORM"}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              try {
                await addQuestion.mutateAsync({
                  question: data.prompt,
                });
                form.reset();
                await utils.admin.getQuestions.invalidate();
              } catch (error) {
                console.log(error);
              }
            })}
            className="my-4 space-y-3"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add new question</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Where is DIT?"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="gap-2 text-white"
              disabled={addQuestion.isPending}
            >
              {addQuestion.isPending ? (
                <>
                  <Loader className="animate-spin" size={15} />
                  Loading
                </>
              ) : 
                "Submit"
              }
            </Button>
          </form>
        </Form>
      </div>
      <div className="mt-4 rounded-md bg-white">
        <div className="flex w-full justify-between rounded-md bg-primary/80 p-3 px-5 text-white">
          <h1 className="w-full">Prompt</h1>
          <h1 className="w-24 text-center">Count</h1>
          {/* <h1 className="w-24 text-center">Action</h1> */}
        </div>
        <div className="divide-y">
          {questionData?.pages.map((page, i) =>
            page?.questionsData?.map((question, index) => (
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              <div
                className="flex items-center justify-between p-3 px-5"
                key={question.id}
                ref={
                  questionData.pages.length - 1 === i &&
                  page.questionsData.length - 1 === index
                    ? ref
                    : null
                }
              >
                <h1 className="w-full">{question.prompt}</h1>
                <h1 className="w-24 text-center">{question.count}</h1>
                {/* <div className="flex w-24 justify-center text-center">
                  <QuestionDropdown id={question.id} prompt={question.prompt} />
                </div> */}
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsHero;
