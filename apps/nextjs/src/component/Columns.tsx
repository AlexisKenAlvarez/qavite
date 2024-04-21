"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { RouterOutputs } from "@qavite/api";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<RouterOutputs["admin"]["getUsers"][0]>[] = [
  {
    accessorKey: "id",
    header: "User No.",
  },
  {
    id: "fullname",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original;
      console.log("🚀 ~ name:", name);

      return (
        <h1 className="">
          {name.first_name} {name.last_name}
        </h1>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
];
