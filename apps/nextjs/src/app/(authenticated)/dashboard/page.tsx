import DashboardHero from "@/component/DashboardHero";
import { api } from "@/trpc/server";

const page = async () => {
  const userCount = await api.admin.countUser();
  const totalReports = await api.admin.countReports({ type: "all" });
  const finishedReports = await api.admin.countReports({ type: "finished" });
  const userList = await api.admin.getUsers()

  return (
    <div>
      <DashboardHero
        userCount={userCount}
        totalReports={totalReports}
        finishedReports={finishedReports}
        userList={userList}
      />
    </div>
  );
};

export default page;
