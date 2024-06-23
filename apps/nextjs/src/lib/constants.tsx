import { Flag, Home, MessageCircle, MessageSquare, User } from "lucide-react";

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
    label: "questions",
    icon: MessageSquare,
    link: "/questions",
    paths: ["/questions"],
  },
  {
    label: "chats",
    icon: MessageCircle,
    link: "/chats",
    paths: ["/chats"],
  }
];
