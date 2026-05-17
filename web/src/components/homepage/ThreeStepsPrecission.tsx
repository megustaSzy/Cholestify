import React from "react";
import { IconBarChart, IconBrain, IconShield } from "../Icon";

export default function ThreeStepsPrecissionForm() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Tiga Langkah Penting
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            Pemindai AI kami menjembatani kesenjangan antara akurasi
            laboratorium dan kenyamanan di rumah.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {/* Step 1 */}
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
            <div className="text-blue-600 mb-5">
              <IconShield />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              1. Pemindaian Aman
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Cukup ikuti arahan penangkapan kamera pada mata dan sejajarkan
              lengan anda dengan panduan di layar. Pemindai AI kami akan
              mendeteksi dalam hitungan detik.
            </p>
          </div>

          {/* Step 2 — highlighted */}
          <div className="flex-1 bg-blue-600 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white mb-5">
              <IconBrain />
            </div>
            <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest mb-3">
              2. Analisis AI
            </p>
            <p className="text-sm text-blue-100 leading-relaxed">
              Algoritma klinis memproses pola mikrovaskular iris untuk
              memperkirakan kolesterol dan penanda lipid dengan akurasi yang
              cukup tinggi.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
            <div className="text-blue-600 mb-5">
              <IconBarChart />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              3. Wawasan Penting
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Anda akan menerima laporan dan saran kadar makanan yang dapat
              ditindaklanjuti untuk mengontrol kadar kolesterol anda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
