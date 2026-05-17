import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardContent from "@/components/user/dashboard/DashboardContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Cholestify",
};

export default function DashboardUserPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <DashboardContent />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
