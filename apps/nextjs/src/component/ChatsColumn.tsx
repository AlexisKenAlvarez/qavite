"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { RouterOutputs } from "@qavite/api";

import ChatDropdown from "./ChatDropdown";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const chatColumns: ColumnDef<
  RouterOutputs["admin"]["getChats"]["0"]
>[] = [
  {
    accessorKey: "count",
    header: "Chat count",
  },
  {
    accessorKey: "prompt",
    header: "prompt",
  },
  {
    accessorKey: "message",
    header: "Quick Chat",
    cell: ({ row }) => {
      const data = row.original;
      const id = data.id;

      return <ChatDropdown id={id} isQuickChat={data.quickchat as boolean} />;
    },
  },
];
