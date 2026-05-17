import type { CSSProperties } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ClinicalProfileContent from "@/components/user/profile/ClinicalProfileContent";

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
        <SiteHeader />
        <ClinicalProfileContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
