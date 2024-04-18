"use client";

import { api } from "@/trpc/client";

const DashboardHero = ({
  userCount,
  totalReports,
  finishedReports,
}: {
  userCount: number | null;
  totalReports: number | null;
  finishedReports: number | null;
}) => {
  const { data: userQueryCount } = api.admin.countUser.useQuery(undefined, {
    initialData: userCount,
  });

  const { data: totalReportsCount } = api.admin.countReports.useQuery(
    {
      type: "all",
    },
    {
      initialData: totalReports,
    },
  );

  const { data: finishedReportsCount } = api.admin.countReports.useQuery(
    {
      type: "finished",
    },
    {
      initialData: finishedReports,
    },
  );

  const dashboardData = [
    {
      title: "User Registration",
      value: userQueryCount ?? 0,
      color: "#61B061",
      icon: (
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_580_612"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100"
            height="100"
          >
            <rect width="100" height="100" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_580_612)">
            <path
              d="M75.9994 58.3333V45.8333H63.4994V37.5H75.9994V25H84.3327V37.5H96.8327V45.8333H84.3327V58.3333H75.9994ZM38.4994 50C33.916 50 29.9924 48.368 26.7285 45.1041C23.4646 41.8402 21.8327 37.9166 21.8327 33.3333C21.8327 28.75 23.4646 24.8263 26.7285 21.5625C29.9924 18.2986 33.916 16.6666 38.4994 16.6666C43.0827 16.6666 47.0063 18.2986 50.2702 21.5625C53.5341 24.8263 55.166 28.75 55.166 33.3333C55.166 37.9166 53.5341 41.8402 50.2702 45.1041C47.0063 48.368 43.0827 50 38.4994 50ZM5.16602 83.3333V71.6666C5.16602 69.3055 5.77365 67.1354 6.98893 65.1562C8.20421 63.177 9.81879 61.6666 11.8327 60.625C16.1382 58.4722 20.5132 56.8576 24.9577 55.7812C29.4021 54.7048 33.916 54.1666 38.4994 54.1666C43.0827 54.1666 47.5966 54.7048 52.041 55.7812C56.4855 56.8576 60.8605 58.4722 65.166 60.625C67.1799 61.6666 68.7945 63.177 70.0098 65.1562C71.2251 67.1354 71.8327 69.3055 71.8327 71.6666V83.3333H5.16602Z"
              fill="#006400"
            />
          </g>
        </svg>
      ),
    },

    {
      title: "Total Reports",
      value: totalReportsCount ?? 0,
      color: "#FA6161",
      icon: (
        <svg
          width="101"
          height="101"
          viewBox="0 0 101 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_580_621"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="101"
            height="101"
          >
            <rect
              x="0.0966797"
              y="0.258636"
              width="100"
              height="100"
              fill="#D9D9D9"
            />
          </mask>
          <g mask="url(#mask0_580_621)">
            <path
              d="M20.9302 87.7586V16.9253H58.4302L60.0968 25.2586H83.4302V66.9253H54.2635L52.5968 58.592H29.2635V87.7586H20.9302Z"
              fill="#980000"
            />
          </g>
        </svg>
      ),
    },
    {
      title: "Finished Reports",
      value: finishedReportsCount ?? 0,
      color: "#F4BF65",
      icon: (
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_580_658"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100"
            height="100"
          >
            <rect width="100" height="100" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_580_658)">
            <path
              d="M33.3332 50H66.6665V41.6667H33.3332V50ZM33.3332 33.3333H66.6665V25H33.3332V33.3333ZM83.1248 85.3125L66.2498 63.3333C65.0693 61.7361 63.6109 60.5035 61.8748 59.6354C60.1387 58.7674 58.2637 58.3333 56.2498 58.3333H16.6665V16.6667C16.6665 14.375 17.4825 12.4132 19.1144 10.7813C20.7464 9.14932 22.7082 8.33334 24.9998 8.33334H74.9998C77.2915 8.33334 79.2533 9.14932 80.8853 10.7813C82.5172 12.4132 83.3332 14.375 83.3332 16.6667V83.3334C83.3332 83.6806 83.3158 84.0104 83.2811 84.3229C83.2464 84.6354 83.1943 84.9653 83.1248 85.3125ZM24.9998 91.6667C22.7082 91.6667 20.7464 90.8507 19.1144 89.2188C17.4825 87.5868 16.6665 85.625 16.6665 83.3334V66.6667H56.2498C56.9443 66.6667 57.5866 66.8229 58.1769 67.1354C58.7672 67.4479 59.2707 67.882 59.6873 68.4375L77.1873 91.3542C76.8401 91.4931 76.4755 91.5799 76.0936 91.6146C75.7116 91.6493 75.3471 91.6667 74.9998 91.6667H24.9998Z"
              fill="#E89304"
            />
          </g>
        </svg>
      ),
    },
  ];

  return (
    <div>
      <h1 className="font-primary text-3xl font-bold text-primary">
        Dashboard
      </h1>

      <div className="mt-6 flex w-full gap-10">
        {dashboardData.map((data, index) => (
          <div
            key={index}
            className="w-full max-w-72 rounded-md p-4"
            style={{ backgroundColor: data.color }}
          >
            <h1 className="text-5xl font-bold text-white">{data.value}</h1>
            <div className="flex items-end justify-between">
              <p className="mt-10 text-white">{data.title}</p>
              <div className="-mb-2">{data.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHero;
