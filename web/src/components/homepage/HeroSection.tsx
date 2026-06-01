import Image from "next/image";
import { IconPlay, avatarColors, avatarLetters } from "../Icon";
import Link from "next/link";

import React from "react";

export default function HeroForm() {
  return (
    <section className="bg-slate-50 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto pt-12 pb-10 md:pt-16 md:pb-14 lg:pt-20 lg:pb-16 flex flex-col md:flex-row items-center gap-10 md:gap-12">
        <div className="flex-1 min-w-0 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-4 py-1.5 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
              Solusi Untuk Anda dalam memantau kadar kolesterol
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900 mb-6">
            Pantau {""}
            <br className="hidden md:block" />
            Kolesterol
            <br />
            Dalam Sekali Scan
          </h1>

          <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-md">
            Pantau kesehatan kolesterol Anda dengan lebih mudah melalui bantuan
            teknologi analisis citra mata. Cholestify memberikan estimasi awal
            yang dapat membantu Anda lebih sadar terhadap kondisi kesehatan,
            namun bukan pengganti pemeriksaan medis profesional.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-3 mb-8 w-full sm:w-auto">
            <Link
              href="/user/dashboard"
              className="inline-flex justify-center items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all active:scale-95 shadow-sm w-full sm:w-auto"
            >
              Mulai Sekarang
            </Link>
            <Link
              href="#"
              className="inline-flex justify-center items-center gap-2 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-sm font-semibold px-6 py-3 rounded-lg transition-all w-full sm:w-auto"
            >
              <span className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <IconPlay />
              </span>
              <span>Watch Demo</span>
            </Link>
          </div>
        </div>

        <div className="hidden md:block flex-[1.1] min-w-0">
          <div className="relative bg-white rounded-3xl shadow-xl shadow-blue-100/60 overflow-hidden p-6 min-h-[420px] flex items-end justify-center">
            <div className="absolute top-5 right-6 bg-white rounded-2xl px-4 py-3 shadow-lg z-10 min-w-[160px]">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-1">
                LDL Cholesterol
              </p>
              <p className="text-3xl font-extrabold text-slate-900 leading-none">
                112{" "}
                <span className="text-sm font-medium text-gray-400">mg/dL</span>
              </p>
              <p className="text-[11px] text-green-500 font-semibold mt-1.5">
                → NORMAL
              </p>
            </div>
            <Image
              src="/homepage/heroPhone.png"
              alt="Colestify app on phone"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full max-w-[480px] h-[380px] object-contain object-bottom bg-transparent"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
