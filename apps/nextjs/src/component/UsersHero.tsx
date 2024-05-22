/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'

import { api } from "@/trpc/client";

import type { RouterOutputs } from "@qavite/api";
import { DataTable } from "./DataTable";
import { userColumns } from "./UsersColumn";


const UsersHero = ({
  users,
}: {
  users: RouterOutputs["admin"]["getUsers"];
}) => {
  const { data: userData } = api.admin.getUsers.useQuery(undefined, {
    initialData: users,
  });

  return (
    <div>
      <h1 className="font-primary text-3xl font-bold text-primary">Chats</h1>
      <div className="mt-4">
        <DataTable data={userData ?? []} columns={userColumns} />
      </div>
    </div>
  );
};

export default UsersHero;
