import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import React, { Suspense } from "react";
import HeaderSection from "@/components/user/metric/daily-tracking/HeaderSection";
import DailyTrackingContent from "@/components/user/metric/daily-tracking/DailyTrackingContent";
import { DailyTrackingPageSkeleton } from "@/components/user/metric/daily-tracking/DailyTrackingSkeleton";
import MobileBottomNav from "@/components/MobilrButtomNav";
import MobileTopHeader from "@/components/MobileTopHeader";

export const metadata: Metadata = {
  title: "Cholestify - Tracking Harian",
};

export default function DailyTrackingPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
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
        <main className="flex flex-1 flex-col bg-gray-50 pb-[140px] md:pb-0">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-6 md:gap-6 md:py-8">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                  <Suspense fallback={<DailyTrackingPageSkeleton />}>
                    <HeaderSection />
                    <DailyTrackingContent />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
