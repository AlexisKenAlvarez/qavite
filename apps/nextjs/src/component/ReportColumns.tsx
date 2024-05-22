"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { RouterOutputs } from "@qavite/api";
import type { Database } from "@qavite/api/lib/types";

import ReportActions from "./ReportActions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const reportColumns: ColumnDef<
  RouterOutputs["admin"]["getReports"][0]
>[] = [
  {
    accessorKey: "id",
    header: "Report Id.",
  },
  {
    accessorKey: "author.email",
    header: "Email Address",
  },
  {
    accessorKey: "message",
    header: "Report",
    cell: ({ row }) => {
      return <div className="min-w-[10rem]">{row.original.message}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <div className="min-w-[10rem]">{row.original.category?.replaceAll("_", " ")}</div>;
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      type UserSupabase = Database["public"]["Tables"]["users"]["Row"];
      const report = row.original;
      const reportId = report.id;
      const author: UserSupabase = report.author as unknown as UserSupabase;

      return <ReportActions email={author.email} id={reportId} />;
    },
  },
];
