import { AppSidebar } from "@/components/AppSidebar";
import { LogLipidPanelForm } from "@/components/user/metric/log-lipid-panel/LogLipidPanelForm";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import type { Metadata } from "next";

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
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <LogLipidPanelForm />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
