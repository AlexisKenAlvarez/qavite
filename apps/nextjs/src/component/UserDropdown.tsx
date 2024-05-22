"use client";

import { api } from "@/trpc/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qavite/ui/select";

const UserDropdown = ({
  id,
  isDeactivated,
}: {
  id: string;
  isDeactivated: boolean;
}) => {
  const deactivateMutation = api.admin.deactivate.useMutation();

  return (
    <Select
      defaultValue={isDeactivated.toString()}
      onValueChange={async (data) => {
        await deactivateMutation.mutateAsync({
          id,
          value: data === "true" ? true : false,
        });
      }}
    >
      <SelectTrigger className="w-[180px] border-0 bg-primary text-white">
        <SelectValue placeholder={isDeactivated.toString().toUpperCase()} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">TRUE</SelectItem>
        <SelectItem value="false">FALSE</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserDropdown;
