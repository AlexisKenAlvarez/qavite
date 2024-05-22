import UsersHero from "@/component/UsersHero";
import { api } from "@/trpc/server";

const page = async () => {
  const users = await api.admin.getUsers();

  return <UsersHero users={users} />;
};

export default page;