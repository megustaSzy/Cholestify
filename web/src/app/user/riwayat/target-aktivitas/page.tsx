import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ActivityTargetHistoryContent from "@/components/user/history/ActivityTarget";

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
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col bg-[#faf9ff]">
          <div className="w-full px-6 py-6 lg:px-8 xl:px-10">
            <div className="w-full max-w-none">
              <ActivityTargetHistoryContent />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
