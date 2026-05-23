import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ReportsContent from "@/components/user/report/ReportContent";
import React, { CSSProperties } from "react";

export default function ReportPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <ReportsContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
