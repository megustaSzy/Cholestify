import FoodDirectoryContent from "@/components/homepage/food-directory/FoodDirectoryContent";
import FooterForm from "@/components/homepage/Footer";
import NavHeader from "@/components/homepage/NavHeader";
import { FoodDirectorySkeleton } from "@/components/user/food-table/FoodDirectorySkeleton";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "List Makanan - Cholestify",
};

export default function FoodDirectoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <NavHeader />
      {/* Main Content */}
      <main className="flex-1 bg-[#f7f7fb]">
        <div className="mx-auto w-full max-w-7xl px-6">
          <Suspense fallback={<FoodDirectorySkeleton />}>
            <FoodDirectoryContent />
          </Suspense>
        </div>
      </main>
      {/* Footer */}
      <FooterForm />
    </div>
  );
}
