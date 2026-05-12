import Link from "next/link";
import React from "react";
import { IconActivity, IconArrowRight, IconEye, IconUtensils } from "../Icon";
import Image from "next/image";

export default function EcosystemHeratHealth() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-16 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          <div className="lg:w-72 flex-shrink-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-snug mb-5">
              The Complete Ecosystem for Heart Health
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Beyond monitoring, Colestify provides the tools to manage and
              improve your clinical outcomes every single day.
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:gap-3 transition-all duration-200"
            >
              Explore all features <IconArrowRight />
            </Link>
          </div>

          <div className="flex-1 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600">
                      <IconActivity />
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      Health Dashboard
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Monitor your scores with longitudinal tracking. See how your
                    diet and activity impact your lipid level on a per-month
                    basis.
                  </p>
                </div>
                <Image
                  src="/homepage/healthDashboard.jpg"
                  alt="Health Dashboard"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-48 object-cover bg-slate-100"
                />
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600">
                      <IconEye />
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      Biometric Scan
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Our proprietary ScanAI™ technology and lab-validated process
                    to detect patterns in real-life and elevate health features.
                  </p>
                </div>
                <Image
                  src="/homepage/biometricScan.png"
                  alt="Biometric Scan"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-48 object-cover bg-slate-100"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex flex-col sm:flex-row items-stretch min-h-[200px]">
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-blue-600">
                      <IconUtensils />
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      AI Food Directory
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                    Get real-time feedback on your meals. Scan labels or search
                    our directory of 500,000+ heart-healthy recipes and
                    ingredients.
                  </p>
                </div>
                <div className="sm:w-[340px] flex-shrink-0">
                  <Image
                    src="/homepage/aiFoodDirectory.png"
                    alt="AI Food Directory"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-52 sm:h-full object-cover bg-slate-100 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
