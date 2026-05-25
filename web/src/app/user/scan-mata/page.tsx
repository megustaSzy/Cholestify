import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import HeaderForm from "@/components/user/eye-scan/HeaderSection";
import EyeScanForm from "@/components/user/eye-scan/EyeScanSection";
import HowToUse from "@/components/user/eye-scan/HowToUseSection";
import { Suspense } from "react";
import { EyeScanPageSkeleton } from "@/components/user/eye-scan/ScanEyeSkeleton";
import MobileBottomNav from "@/components/MobilrButtomNav";
import MobileTopHeader from "@/components/MobileTopHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan Mata - Cholestify",
};

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
        <main className="flex min-h-screen flex-1 flex-col bg-gray-50 pb-[130px] md:pb-0">
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
