import { Suspense, type CSSProperties } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import HealthGoalsContent from "@/components/user/profile/HealthGoalsContent";
import { HealthGoalsPageSkeleton } from "@/components/user/profile/skeleton/HealthGoalsSkeleton";

export default function HealthGoalsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
       <Suspense fallback={<HealthGoalsPageSkeleton/>}>
         <SiteHeader />
        <HealthGoalsContent />
       </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
