import Link from "next/link";
import React from "react";

export default function CallToActionForm() {
  return (
    <section className="px-4 sm:px-6 lg:px-16 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-3xl px-5 sm:px-8 md:px-20 py-12 sm:py-16 text-center shadow-2xl shadow-blue-200">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-snug">
            Ready to take control of your
            <br />
            cardiovascular health?
          </h2>
          <p className="text-sm text-blue-200 mb-10 max-w-sm mx-auto leading-relaxed">
            Join thousands of proactive individuals using Colestify to live
            longer, healthier lives.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/user/dashboard"
              className="inline-flex items-center justify-center bg-white hover:bg-blue-50 text-blue-700 font-semibold text-sm px-8 py-3.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              Clinical Portal
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center border border-white/50 hover:border-white hover:bg-white/10 text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition-all active:scale-95"
            >
              Contact Specialist
            </Link>
          </div>
        </div>

        {/* Disclaimer Box */}
        <div className="mt-8 max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-sm">
          <div className="bg-amber-100/50 rounded-full p-2 flex-shrink-0">
            <svg
              className="w-5 h-5 text-amber-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed text-left">
            <strong>Disclaimer:</strong> Cholestify ini merupakan sistem
            pendukung kesehatan, bukan alat diagnosis mandiri. Jadi sistem bisa
            saja salah dalam melakukan hal prediksi seperti screening. Selalu
            konsultasikan dengan dokter anda untuk hasil yang lebih akurat.
          </p>
        </div>
      </div>
    </section>
  );
}
