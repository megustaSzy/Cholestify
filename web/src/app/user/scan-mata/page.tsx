import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import HeaderForm from "@/components/user/eye-scan/HeaderSection";
import EyeScanForm from "@/components/user/eye-scan/EyeScanSection";
import HowToUse from "@/components/user/eye-scan/HowToUseSection";
import { Suspense } from "react";
import { EyeScanPageSkeleton } from "@/components/user/eye-scan/ScanEyeSkeleton";

export default function EyeScanPage() {
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
        <div className="flex flex-1 flex-col bg-gray-50 min-h-screen">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <Suspense fallback={<EyeScanPageSkeleton />}>
                <HeaderForm />
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                  <EyeScanForm />
                  <HowToUse />
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
