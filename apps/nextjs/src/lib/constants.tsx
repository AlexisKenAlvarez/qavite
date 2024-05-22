import { Flag, Home, MessageSquare, User } from "lucide-react";

export const navigations = [
  {
    label: "dashboard",
    icon: Home,
    link: "/dashboard",
    paths: ["/dashboard", "/"],
  },
  {
    label: "users",
    icon: User,
    link: "/users",
    paths: ["/users"],
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
