import { Suspense, type CSSProperties } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import HealthGoalsContent from "@/components/user/profile/HealthGoalsContent";
import { HealthGoalsPageSkeleton } from "@/components/user/profile/skeleton/HealthGoalsSkeleton";
import MobileBottomNav from "@/components/MobilrButtomNav";
import MobileTopHeader from "@/components/MobileTopHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Target Kesehatan - Cholestify",
};

export default function HealthGoalsPage() {
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
        <main className="flex flex-1 flex-col pb-[140px] md:pb-0">
          <Suspense fallback={<HealthGoalsPageSkeleton />}>
            <HealthGoalsContent />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
