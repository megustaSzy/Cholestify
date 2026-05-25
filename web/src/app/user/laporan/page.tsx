import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ReportsContent from "@/components/user/report/ReportContent";
import { ReportSkeleton } from "@/components/user/report/ReportSkeleton";
import React, { CSSProperties, Suspense } from "react";

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
        <Suspense fallback={<ReportSkeleton/>}>
        <ReportsContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
