"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { RouterOutputs } from "@qavite/api";

import UserDropdown from "./UserDropdown";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const userColumns: ColumnDef<
  RouterOutputs["admin"]["getUsers"]["0"]
>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "Full name",
    header: "Full name",
    cell: ({row}) => {
      const data = row.original

      return <p className="">{data.first_name} {data.last_name}</p>
    }
  },
  {
    accessorKey: "deactivated",
    header: "Deactivated",
    cell: ({ row }) => {
      const data = row.original;
      const id = data.auth_id;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return <UserDropdown id={id} isDeactivated={data.deactivated} />;
    },
  },
];
