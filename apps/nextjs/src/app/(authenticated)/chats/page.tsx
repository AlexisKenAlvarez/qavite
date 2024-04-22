import ChatsHero from "@/component/ChatsHero";
import { api } from "@/trpc/server";

const page = async () => {
  const chats = await api.admin.getChats();

  return <ChatsHero chats={chats} />;
};

export default page;
