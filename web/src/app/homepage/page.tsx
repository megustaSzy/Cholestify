import CallToActionForm from "@/components/homepage/CallToActionForm";
import EcosystemHeratHealth from "@/components/homepage/EcosystemHeratHealth";
import FooterForm from "@/components/homepage/FooterForm";
import HeroForm from "@/components/homepage/HeroForm";
import NavHeader from "@/components/homepage/NavHeader";
import ThreeStepsPrecissionForm from "@/components/homepage/ThreeStepsPrecissionForm";
import React from "react";

export default function HomePage() {
  return (
    <div className="font-sans text-gray-900 bg-white antialiased">
      <NavHeader />
      <HeroForm />
      <ThreeStepsPrecissionForm />
      <EcosystemHeratHealth />
      <CallToActionForm />
      <FooterForm />
    </div>
  );
}
