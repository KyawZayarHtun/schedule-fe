import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/sidebar/AppSidebar.tsx";
import {Outlet} from "react-router";
import {DarkModeToggle} from "@/components/DarkModeToggle.tsx";
import type {CSSProperties} from "react";

const sideBarStyle: CSSProperties = {
  "--sidebar-width": "18rem",
  "--sidebar-width-mobile": "100%",
} as CSSProperties

const DashboardLayout = () => {
  return (
    <SidebarProvider style={sideBarStyle}>
      <AppSidebar />
      <section className="w-full">
        <header className="p-3 border-b flex items-center justify-between">
          <div>
            <SidebarTrigger className="cursor-pointer" />
          </div>
          <div>
            <DarkModeToggle />
          </div>
        </header>
        <main className="mx-auto p-6">
          <Outlet />
        </main>
      </section>
    </SidebarProvider>
  );
};

export default DashboardLayout;