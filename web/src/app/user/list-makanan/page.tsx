import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import HeaderSection from "@/components/user/food-table/HeaderSection";
import BodySection from "@/components/user/food-table/BodySection";
import { Suspense } from "react";
import { FoodDirectorySkeleton } from "@/components/user/food-table/FoodDirectorySkeleton";
import MobileBottomNav from "@/components/MobilrButtomNav";
import MobileTopHeader from "@/components/MobileTopHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Makanan - Cholestify",
};

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

        <main className="flex flex-1 flex-col bg-gray-50 pb-[120px] md:pb-0">
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
