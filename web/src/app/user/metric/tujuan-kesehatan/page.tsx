import { AppSidebar } from "@/components/AppSidebar";
import MobileTopHeader from "@/components/MobileTopHeader";
import MobileBottomNav from "@/components/MobilrButtomNav";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import HeaderSection from "@/components/user/metric/set-health-goals/HeaderSection";
import SetHealthGoalsSection from "@/components/user/metric/set-health-goals/SetHealthGoalsSection";
import { SetHealthGoalsPageSkeleton } from "@/components/user/metric/set-health-goals/SetHealthGoalsSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tujuan Kesehatan - Cholestify",
};

export default function SetHealthGoalsPage() {
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
        <main className="flex flex-1 flex-col pb-[140px] md:pb-0">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                  <Suspense fallback={<SetHealthGoalsPageSkeleton />}>
                    <HeaderSection />
                    <SetHealthGoalsSection />
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
