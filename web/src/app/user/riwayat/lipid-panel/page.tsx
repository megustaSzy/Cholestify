import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import LipidPanelHistoryContent from "@/components/user/history/LipidPanel";
import { LipidPanelHistorySkeleton } from "@/components/user/history/skeleton/LipidPanelHistorySkeleton";
import { Suspense } from "react";

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
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col bg-[#faf9ff]">
          <div className="w-full px-6 py-6 lg:px-8 xl:px-10">
            <div className="w-full max-w-none"></div>
            <Suspense fallback={<LipidPanelHistorySkeleton />}>
              <LipidPanelHistoryContent />
            </Suspense>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
