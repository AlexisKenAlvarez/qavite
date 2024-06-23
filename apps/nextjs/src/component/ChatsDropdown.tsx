import { api } from "@/trpc/client";
import { Ellipsis } from "lucide-react";
import { useState } from "react";

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
import { toast } from "@qavite/ui/toast";

const ChatsDropdown = ({ id }: { id: number }) => {
  const deleteMutation = api.admin.deleteChats.useMutation();

  const [toDelete, setDeleteOpen] = useState(false);
  const utils = api.useUtils()

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
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={toDelete} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this question.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <DialogClose asChild>
              <Button variant={"destructive"} onClick={async() => {
                try {
                  const promise = new Promise((resolve, reject) => {
                    deleteMutation
                      .mutateAsync({
                        id,
                      })
                      .then(() => resolve("Delete success"))
                      .catch((error) => reject(error));
                  })


                  toast.promise(promise, {
                    loading: "Deleting...",
                    success: "Deleted successfully",
                    error: "Failed to delete",
                  })
                  await utils.admin.getChats.invalidate()

                } catch (error) {
                  console.log(error);
                }
              }}>
                Delete
              </Button>
            </DialogClose>
            <DialogClose>
              Cancel
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatsDropdown;
