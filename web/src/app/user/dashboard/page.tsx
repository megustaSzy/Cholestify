import { AppSidebar } from "@/components/AppSidebar";
import MobileTopHeader from "@/components/MobileTopHeader";
import MobileBottomNav from "@/components/MobilrButtomNav";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardContent from "@/components/user/dashboard/DashboardContent";
import { DashboardSkeleton } from "@/components/user/dashboard/DashboardSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

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

        <main className="flex flex-1 flex-col bg-gray-50 pb-24 md:pb-0">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardContent />
            </Suspense>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
