import Link from "next/link";
import React from "react";

export default function CallToActionForm() {
  return (
    <section className="px-4 sm:px-6 lg:px-16 pb-24 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Disclaimer Box */}
        <div className="w-full bg-amber-50 border-2 border-amber-300 rounded-3xl px-5 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-md">
          <div className="bg-amber-100 rounded-full p-3 flex-shrink-0">
            <svg
              className="w-6 h-6 text-amber-600"
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
          <div className="w-full space-y-1 text-left">
            <h3 className="text-base sm:text-lg font-bold text-amber-900">
              Disclaimer Kesehatan
            </h3>

            <p className="text-sm sm:text-base text-amber-800 leading-relaxed text-left">
              Cholestify merupakan sistem pendukung kesehatan, bukan alat
              diagnosis mandiri. Hasil prediksi atau screening dapat memiliki
              kemungkinan kesalahan. Selalu konsultasikan dengan dokter untuk
              mendapatkan hasil yang lebih akurat.
            </p>
          </div>
        </div>

        {/* CTA Box */}
        <div className="w-full bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-3xl px-5 sm:px-8 md:px-20 py-12 sm:py-16 text-center shadow-2xl shadow-blue-200">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-snug">
            Siap untuk mengendalikan kesehatan
            <br />
            kardiovaskular Anda?
          </h2>

          <p className="text-sm text-blue-200 mb-10 max-w-sm mx-auto leading-relaxed">
            Bergabunglah dengan kami untuk memantau kadar kolesterol anda dan
            memulai hidup lebih sehat.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/user/dashboard"
              className="inline-flex items-center justify-center bg-white hover:bg-blue-50 text-blue-700 font-semibold text-sm px-8 py-3.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              Ayo Mulai Hidup Sehat Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
