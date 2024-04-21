import { api } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@qavite/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@qavite/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@qavite/ui/form";
import { Input } from "@qavite/ui/input";
import { Textarea } from "@qavite/ui/textarea";

const ReportActions = ({ email, id }: { email: string; id: number }) => {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const sendEmailMutation = api.admin.sendEmail.useMutation();
  const closeTicketMutation = api.admin.closeTicket.useMutation();
  const utils = api.useUtils();

  const formSchema = z.object({
    toSend: z.string().email(),
    message: z.string(),
    id: z.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id,
      toSend: email,
      message: "",
    },
  });

  return (
    <div className="flex gap-3 text-white">
      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          onClick={() => setOpen(true)}
          variant={"outline"}
          className="rounded-3xl border-primary bg-transparent text-primary"
        >
          Reply
        </Button>

        <DialogContent className="max-w-md !rounded-2xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                async (data: z.infer<typeof formSchema>) => {
                  try {
                    await sendEmailMutation.mutateAsync(data);
                  } catch (error) {
                    console.log(error);
                  }
                  form.reset();
                  setOpen(false);
                  await utils.admin.getReports.invalidate();
                },
              )}
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="toSend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        className="rounded-xl border border-primary"
                        disabled
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Message"
                        minLength={6}
                        className="rounded-xl border border-primary outline-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                disabled={sendEmailMutation.isPending}
                type="submit"
                className="ml-auto block rounded-3xl text-white"
              >
                {sendEmailMutation.isPending ? "Sending..." : "Send"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <Button className=" rounded-3xl" onClick={() => setRejectOpen(true)}>
          Close
        </Button>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will reject the ticket that was
              submitted.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              className="text-white"
              onClick={async () => {
                await closeTicketMutation.mutateAsync({ id });
                await utils.admin.getReports.invalidate();
                setRejectOpen(false);
              }}
            >
              Close this ticket.
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportActions;
