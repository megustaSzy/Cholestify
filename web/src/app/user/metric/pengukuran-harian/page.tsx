import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import React from "react";
import HeaderSection from "@/components/user/metric/daily-tracking/HeaderSection";
import DailyTrackingContent from "@/components/user/metric/daily-tracking/DailyTrackingContent";

export const metadata: Metadata = {
  title: "Cholestify - Daily Tracking",
  description:
    "Enter your daily health metrics to maintain an accurate clinical profile.",
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
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-6 md:gap-6 md:py-8">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
                  <HeaderSection />
                  <DailyTrackingContent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
