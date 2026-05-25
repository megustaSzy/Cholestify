import { Suspense, type CSSProperties } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ClinicalProfileContent from "@/components/user/profile/ClinicalProfileContent";
import { ClinicalProfileSkeleton } from "@/components/user/profile/skeleton/ClinicalProfileSkeleton";

export default function ClinicalProfilePage() {
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
        <Suspense fallback={<ClinicalProfileSkeleton />}>
          <SiteHeader />
          <ClinicalProfileContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
