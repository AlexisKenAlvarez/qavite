import { Flag, Home, MessageSquare } from "lucide-react";

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
  }
];
