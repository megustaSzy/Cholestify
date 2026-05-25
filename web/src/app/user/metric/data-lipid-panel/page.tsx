import { AppSidebar } from "@/components/AppSidebar";
import { LogLipidPanelForm } from "@/components/user/metric/log-lipid-panel/LogLipidPanelForm";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import type { Metadata } from "next";
import { Suspense } from "react";
import { LogLipidPanelFormSkeleton } from "@/components/user/metric/log-lipid-panel/LogLipidPanelSkeleton";
import MobileBottomNav from "@/components/MobilrButtomNav";
import MobileTopHeader from "@/components/MobileTopHeader";

export const metadata: Metadata = {
  title: "Log Lipid Panel - Cholestify",
  description:
    "Enter your latest blood work results to track your cardiovascular health.",
};

export default function LogLipidPanelPage() {
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
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
              <Suspense fallback={<LogLipidPanelFormSkeleton />}>
                <LogLipidPanelForm />
              </Suspense>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
