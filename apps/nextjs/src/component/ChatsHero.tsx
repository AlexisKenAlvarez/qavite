/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'

import { api } from "@/trpc/client";

import type { RouterOutputs } from "@qavite/api";import { chatColumns } from "./ChatsColumn";
import { DataTable } from "./DataTable";


const ChatsHero = ({
  chats,
}: {
  chats: RouterOutputs["admin"]["getChats"];
}) => {
  const { data: chatsData } = api.admin.getChats.useQuery(undefined, {
    initialData: chats,
  });

  return (
    <div>
      <h1 className="font-primary text-3xl font-bold text-primary">Chats</h1>
      <div className="mt-4">
        <DataTable data={chatsData ?? []} columns={chatColumns} />
      </div>
    </div>
  );
};

export default ChatsHero;
