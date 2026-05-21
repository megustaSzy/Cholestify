import FoodDirectoryContent from "@/components/homepage/food-directory/FoodDirectoryContent";
import FooterForm from "@/components/homepage/Footer";
import NavHeader from "@/components/homepage/NavHeader";
import React from "react";

export default function FoodDirectoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <NavHeader />
      {/* Main Content */}
      <main className="flex-1 bg-[#f7f7fb]">
        <div className="mx-auto w-full max-w-7xl px-6">
          <FoodDirectoryContent />
        </div>
      </main>
      {/* Footer */}
      <FooterForm />
    </div>
  );
}
