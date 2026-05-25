import { AppSidebar } from "@/components/AppSidebar";
import MobileTopHeader from "@/components/MobileTopHeader";
import MobileBottomNav from "@/components/MobilrButtomNav";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import LipidPanelHistoryContent from "@/components/user/history/LipidPanel";
import { LipidPanelHistorySkeleton } from "@/components/user/history/skeleton/LipidPanelHistorySkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Riwayat Lipid Panel - Cholestify",
};

export default function LipidPanelHistoryPage() {
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
        <main className="flex flex-1 flex-col bg-[#faf9ff] pb-[140px] md:pb-0">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
            <div className="w-full max-w-none">
              <Suspense fallback={<LipidPanelHistorySkeleton />}>
                <LipidPanelHistoryContent />
              </Suspense>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
