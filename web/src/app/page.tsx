import CallToActionForm from "@/components/homepage/CallToAction";
import EcosystemHeratHealth from "@/components/homepage/EcosystemHeartHealth";
import FooterForm from "@/components/homepage/Footer";
import HeroForm from "@/components/homepage/HeroSection";
import NavHeaderClient from "@/components/homepage/NavHeaderClient";
import ThreeStepsPrecissionForm from "@/components/homepage/ThreeStepsPrecission";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";

const TOKEN_COOKIE_NAME = "accessToken";

export const metadata: Metadata = {
  title: "Homepage - Cholestify",
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  return (
    <div className="font-sans text-gray-900 bg-white antialiased">
      <NavHeaderClient hasToken={Boolean(token)} />
      <HeroForm />
      <ThreeStepsPrecissionForm />
      <EcosystemHeratHealth />
      <CallToActionForm />
      <FooterForm />
    </div>
  );
}
