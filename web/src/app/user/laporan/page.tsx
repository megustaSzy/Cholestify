import { AppSidebar } from "@/components/AppSidebar";
import MobileTopHeader from "@/components/MobileTopHeader";
import MobileBottomNav from "@/components/MobilrButtomNav";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ReportsContent from "@/components/user/report/ReportContent";
import { ReportSkeleton } from "@/components/user/report/ReportSkeleton";
import { Metadata } from "next";
import React, { CSSProperties, Suspense } from "react";

export const metadata: Metadata = {
  title: "Laporan - Cholestify",
};

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
      {/* sidebar */}
      <div className="hidden md:block">
        <AppSidebar variant="inset" />
      </div>

      {/* Navbar Mobile */}
      <MobileBottomNav />

      <SidebarInset>
        {/* site header dekstop */}
        <div className="hidden md:block">
          <SiteHeader />
        </div>
        <MobileTopHeader />

        <main className="flex flex-1 flex-col pb-32 md:pb-0">
          <Suspense fallback={<ReportSkeleton />}>
            <ReportsContent />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
