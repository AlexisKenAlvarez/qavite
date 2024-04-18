import { Flag, Home } from "lucide-react";

export const navigations = [
  {
    label: "dashboard",
    icon: Home,
    link: "/dashboard",
    paths: ['/dashboard', '/'],
  },
  {
    label: "reports",
    icon: Flag,
    link: "/reports",
    paths: ['/reports'],
  },
  
]