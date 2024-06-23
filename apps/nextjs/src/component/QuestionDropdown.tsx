import { useState } from "react";
import { api } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ellipsis } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@qavite/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@qavite/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@qavite/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@qavite/ui/form";
import { Input } from "@qavite/ui/input";
import { toast } from "@qavite/ui/toast";

const QuestionDropdown = ({ id, prompt }: { id: number; prompt: string }) => {
  const editMutation = api.admin.editQuestion.useMutation();
  const deleteMutation = api.admin.deleteQuestion.useMutation();

  const [toEdit, setEditOpen] = useState(false);
  const [toDelete, setDeleteOpen] = useState(false);
  const utils = api.useUtils();

  const formSchema = z.object({
    prompt: z.string().min(2, {
      message: "Must be at least 7 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const promise = new Promise((resolve, reject) => {
        if (values.prompt === prompt) {
          resolve("Success");
        } else {
          editMutation
            .mutateAsync({
              id,
              prompt: values.prompt,
            })
            .then(() => resolve("Update success"))
            .catch((error) => reject(error));
        }
      });

      toast.promise(promise, {
        loading: "Updating...",
        success: "Updated successfully",
        error: "Failed to update",
      });
    } catch (error) {
      console.log(error);
    }

    setEditOpen(false);
    await utils.admin.getQuestions.invalidate();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"outline"}
            size={"icon"}
            className="border-transparent bg-transparent outline-transparent"
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={toEdit} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit this question</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="text-white">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={toDelete} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              question.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                onClick={async () => {
                  try {
                    const promise = new Promise((resolve, reject) => {
                      deleteMutation
                        .mutateAsync({
                          id,
                        })
                        .then(() => resolve("Delete success"))
                        .catch((error) => reject(error));
                    });

                    toast.promise(promise, {
                      loading: "Deleting...",
                      success: "Deleted successfully",
                      error: "Failed to delete",
                    });
                    await utils.admin.getQuestions.invalidate();
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Delete
              </Button>
            </DialogClose>
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionDropdown;
