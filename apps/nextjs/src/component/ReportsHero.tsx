/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { api } from "@/trpc/client";

import type { RouterOutputs } from "@qavite/api";

import { DataTable } from "./DataTable";
import { reportColumns } from "./ReportColumns";

const ReportsHero = ({
  reports,
}: {
  reports: RouterOutputs["admin"]["getReports"];
}) => {
  const { data: reportsData } = api.admin.getReports.useQuery(undefined, {
    initialData: reports,
  });

  return (
    <div>
      <h1 className="font-primary text-3xl font-bold text-primary">Reports</h1>
      <div className="mt-4">
        <DataTable data={reportsData ?? []} columns={reportColumns} />
      </div>
    </div>
  );
};

export default ReportsHero;
