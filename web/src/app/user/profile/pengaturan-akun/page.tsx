import { Suspense, type CSSProperties } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AccountSettingContent from "@/components/user/profile/AccountSettingContent";
import { AccountSettingSkeleton } from "@/components/user/profile/skeleton/AccountSettingSkeleton";

export default function AccountSettingsPage() {
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
        <Suspense fallback={<AccountSettingSkeleton/>}>
          <SiteHeader />
          <AccountSettingContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
