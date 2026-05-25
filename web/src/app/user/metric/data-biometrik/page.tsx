import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import LogBiometricsContent from "@/components/user/metric/biometric/BiometricForm";
import HeaderSection from "@/components/user/metric/biometric/HeaderSection";
import { Suspense } from "react";
import { LogBiometricsSkeleton } from "@/components/user/metric/biometric/BiometricsSkeleton";
import MobileBottomNav from "@/components/MobilrButtomNav";
import MobileTopHeader from "@/components/MobileTopHeader";

export const metadata: Metadata = {
  title: "Cholestify - Log Biometrics",
};

export default function LogBiometricsPage() {
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-6 md:gap-6 md:py-8">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-3xl mx-auto flex flex-col">
                  <Suspense fallback={<LogBiometricsSkeleton />}>
                    <HeaderSection />
                    <LogBiometricsContent />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
