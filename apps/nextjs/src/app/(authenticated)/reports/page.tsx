import ReportsHero from "@/component/ReportsHero";
import { api } from "@/trpc/server";

const page = async () => {
  const reportsData = await api.admin.getReports();

  return (
    <div>
      <ReportsHero reports={reportsData} />
    </div>
  );
};

export default page;
