import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/client";

import { Button } from "@qavite/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@qavite/ui/dialog";

const UserDelete = ({ id }: { id: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const deleteUserMutation = api.admin.deleteUser.useMutation();
  const utils = api.useUtils();

  return (
    <div className="w-[100px]">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="text-white hover:bg-red-500">Delete</Button>
        </DialogTrigger>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              user&apos;s account from the database.
            </DialogDescription>
            <Button
              onClick={async () => {
                await deleteUserMutation.mutateAsync({
                  id,
                });

                await utils.admin.getUsers.invalidate();
                setOpen(false)
                router.refresh();
              }}
              className="text-white !mt-4 block"
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Confirm"}
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDelete;
