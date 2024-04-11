import Hero from "@/component/dashboard/Hero";
import Reports from "@/component/dashboard/Reports";
import { Home } from "lucide-react"
import { Flag } from 'lucide-react';

export const navigations = [
  {
    label: "dashboard",
    icon: Home,
    link: "/dashboard",
    paths: ['/dashboard', '/'],
    component: Hero
  },
  {
    label: "reports",
    icon: Flag,
    link: "/reports",
    paths: ['/reports'],
    component: Reports
  },
  
]