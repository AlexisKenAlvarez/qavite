"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { RouterOutputs } from "@qavite/api";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const chatColumns: ColumnDef<
  RouterOutputs["admin"]["getChats"]["0"]
>[] = [
  {
    accessorKey: "prompt",
    header: "prompt",
  },
  {
    accessorKey: "count",
    header: "Chat count",
  }
];
