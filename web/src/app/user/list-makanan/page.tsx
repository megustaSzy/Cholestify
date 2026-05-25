import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import HeaderSection from "@/components/user/food-table/HeaderSection";
import BodySection from "@/components/user/food-table/BodySection";
import { Suspense } from "react";
import { FoodDirectorySkeleton } from "@/components/user/food-table/FoodDirectorySkeleton";

export default function FoodTablePage() {
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
              <Suspense fallback={<FoodDirectorySkeleton />}>
                <HeaderSection />
                <BodySection />
              </Suspense>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
