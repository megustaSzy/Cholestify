import Image from "next/image";
import { IconPlay, avatarColors, avatarLetters } from "../Icon";
import Link from "next/link";

import React from "react";

export default function HeroForm() {
  return (
    <section className="bg-slate-50 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto py-16 md:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-12">
        <div className="flex-1 min-w-0 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-4 py-1.5 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
              Clinical Grade Precision
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900 mb-6">
            Monitor
            <br className="hidden md:block" />
            Cholesterol
            <br />
            with a Single Scan
          </h1>

          <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-md">
            Colestify uses advanced ocular imaging technology to detect lipid
            markers instantly. Get hospital-grade insights from your smartphone
            without the needles.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-3 mb-8 w-full sm:w-auto">
            <Link
              href="#"
              className="inline-flex justify-center items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all active:scale-95 shadow-sm w-full sm:w-auto"
            >
              Get Started for Free
            </Link>
            <Link
              href="#"
              className="inline-flex justify-center items-center gap-2 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-sm font-semibold px-6 py-3 rounded-lg transition-all w-full sm:w-auto"
            >
              <span className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <IconPlay />
              </span>
              Watch Science
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3">
            <div className="flex">
              {avatarLetters.map((letter, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-white ${avatarColors[i]} text-white text-xs font-bold flex items-center justify-center ${i !== 0 ? "-ml-2.5" : ""}`}
                >
                  {letter}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center -ml-2.5">
                +2k
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Trusted by{" "}
              <strong className="text-gray-800 font-semibold">2,000+</strong>{" "}
              medical professionals
            </p>
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
