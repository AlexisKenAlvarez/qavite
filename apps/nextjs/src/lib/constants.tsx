import { Flag, Home, MessageSquare,Antenna } from "lucide-react";

export const navigations = [
  {
    label: "dashboard",
    icon: Home,
    link: "/dashboard",
    paths: ["/dashboard", "/"],
  },
  {
    label: "reports",
    icon: Flag,
    link: "/reports",
    paths: ["/reports"],
  },
  {
    label: "chats",
    icon: MessageSquare,
    link: "/chats",
    paths: ["/chats"],
  },
  {
    label: "tune",
    icon: Antenna,
    link: "/tune",
    paths: ["/tune"],
  }
];
