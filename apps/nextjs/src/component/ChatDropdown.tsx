"use client";

import { api } from "@/trpc/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qavite/ui/select";

const ChatDropdown = ({
  id,
  isQuickChat,
}: {
  id: number;
  isQuickChat: boolean;
}) => {
  const quickChatMutation = api.admin.setQuickChat.useMutation();

  return (
    <Select
      defaultValue={isQuickChat.toString()}
      onValueChange={async (data) => {
        await quickChatMutation.mutateAsync({
          id,
          value: data === "true" ? true : false,
        });
      }}
    >
      <SelectTrigger className="w-[180px] border-0 bg-primary text-white">
        <SelectValue placeholder={isQuickChat.toString().toUpperCase()} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">TRUE</SelectItem>
        <SelectItem value="false">FALSE</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ChatDropdown;
