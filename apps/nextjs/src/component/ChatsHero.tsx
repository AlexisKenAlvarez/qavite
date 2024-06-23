/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { useEffect } from "react";
import { api } from "@/trpc/client";
import { useInView } from "react-intersection-observer";

import ChatsDropdown from "./ChatsDropdown";

const ChatsHero = () => {
  const { data: chatsData, fetchNextPage } =
    api.admin.getChats.useInfiniteQuery(
      {
        limit: 10,
        offset: 0,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextOffset;
        },
        refetchOnMount: true,
      },
    );

  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      void (async () => {
        console.log("Fetching now");
        await fetchNextPage();
      })();
    }
  }, [inView]);

  return (
    <div>
      <div className="w-full">
        <h1 className="font-primary text-3xl font-bold text-primary">Chats</h1>
      </div>
      <div className="mt-4 rounded-md bg-white">
        <div className="flex w-full justify-between rounded-md bg-primary/80 p-3 px-5 text-white">
          <h1 className="w-full">Prompt</h1>
          <h1 className="w-24 text-center">Count</h1>
          <h1 className="w-24 text-center">Action</h1>
        </div>
        <div className="divide-y">
          {chatsData?.pages.map((page, i) =>
            page?.questionsData?.map((chat, index) => (
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              <div
                className="flex items-center justify-between p-3 px-5"
                key={chat.id}
                ref={
                  chatsData.pages.length - 1 === i &&
                  page.questionsData.length - 1 === index
                    ? ref
                    : null
                }
              >
                <h1 className="w-full">{chat.prompt}</h1>
                <h1 className="w-24 text-center">{chat.count}</h1>
                <div className="flex w-24 justify-center text-center">
                  <ChatsDropdown id={chat.id} />
                </div>
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsHero;
