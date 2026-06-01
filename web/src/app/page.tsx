import CallToActionForm from "@/components/homepage/CallToAction";
import EcosystemHeratHealth from "@/components/homepage/EcosystemHeartHealth";
import FooterForm from "@/components/homepage/Footer";
import HeroForm from "@/components/homepage/HeroSection";
import NavHeaderClient from "@/components/homepage/NavHeaderClient";
import ThreeStepsPrecissionForm from "@/components/homepage/ThreeStepsPrecission";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";

export const metadata: Metadata = {
  title: "Cholestify",
};

export default async function HomePage() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const hasAuthCookie = Boolean(accessToken || refreshToken);

  return (
    <div className="font-sans text-gray-900 bg-white antialiased">
      <NavHeaderClient hasToken={hasAuthCookie} />
      <HeroForm />
      <ThreeStepsPrecissionForm />
      <EcosystemHeratHealth />
      <CallToActionForm />
      <FooterForm />
    </div>
  );
}
