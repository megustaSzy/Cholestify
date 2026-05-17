import CalculatesContent from "@/components/homepage/Calculator-HDR/CalculatesContent";
import CalculatesForm from "@/components/homepage/Calculator-HDR/CalculatesForm";
import FooterForm from "@/components/homepage/Footer";
import NavHeader from "@/components/homepage/NavHeader";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <NavHeader />
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-12">
          <CalculatesForm />
          <CalculatesContent />
        </div>
      </main>
      {/* Footer */}
      <FooterForm />
    </div>
  );
}
