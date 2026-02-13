import type {dashBoardMenu} from "@/types/menu.ts";
import {BriefcaseBusiness, Clock, FileSearchCorner, Pickaxe} from "lucide-react";

export const scheduleMenu: dashBoardMenu = [
  {
    title: "Job Managements",
    url: "/jobs",
    icon: BriefcaseBusiness,
    isActive: true,
    items: [],
  },
  {
    title: "Schedule",
    url: "#",
    icon: Clock,
    items: [
      {
        title: "Simple Schedule",
        url: "/simple",
      },
      {
        title: "Cron Schedule",
        url: "#",
      },
      {
        title: "Active Schedules",
        url: "/active-schedules",
      },
    ],
  },
  {
    title: "Trigger Managements",
    url: "#",
    icon: Pickaxe,
    items: [],
  },
  {
    title: "History",
    url: "#",
    icon: FileSearchCorner,
    items: [
      {
        title: "General",
        url: "#",
      },
      {
        title: "Team",
        url: "#",
      },
      {
        title: "Billing",
        url: "#",
      },
      {
        title: "Limits",
        url: "#",
      },
    ],
  },
]