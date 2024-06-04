"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { RouterOutputs } from "@qavite/api";

import UserDelete from "./UserDelete";
import UserDropdown from "./UserDropdown";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const userColumns: ColumnDef<RouterOutputs["admin"]["getUsers"]["0"]>[] =
  [
    {
      accessorKey: "email",
      header: "Email",
      size: 20,
      minSize: 20,
      maxSize: 150,
    },
    {
      accessorKey: "Full name",
      header: "Full name",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <p className="">
            {data.first_name} {data.last_name}
          </p>
        );
      },
    },
    {
      accessorKey: "deactivated",
      header: "Account status",

      cell: ({ row }) => {
        const data = row.original;
        const id = data.auth_id;

        return <UserDropdown id={id} isDeactivated={data.deactivated} />;
      },
    },
    {
      accessorKey: "delete",
      header: "Delete User",
      cell: ({ row }) => {
        const data = row.original;
        const id = data.auth_id;

        return <UserDelete id={id} />;
      },
    },
  ];
