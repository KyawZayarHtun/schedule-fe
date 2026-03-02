import type {LucideIcon} from "lucide-react";

export interface navItem {
  title: string;
  url: string;
}

export interface navMenu extends navItem {
  icon: LucideIcon;
  isActive?: boolean;
  items: navItem[];
}

export type dashBoardMenu = navMenu[];
