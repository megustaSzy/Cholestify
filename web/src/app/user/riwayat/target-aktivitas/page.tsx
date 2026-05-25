import { AppSidebar } from "@/components/AppSidebar";
import MobileTopHeader from "@/components/MobileTopHeader";
import MobileBottomNav from "@/components/MobilrButtomNav";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ActivityTargetHistoryContent from "@/components/user/history/ActivityTarget";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Target Aktivitas - Cholestify",
};

export default function ActivityTargetHistoryPage() {
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
              <ActivityTargetHistoryContent />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
