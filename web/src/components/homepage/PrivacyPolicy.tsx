"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function PrivacyPolicyForm() {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-slate-50/50 p-6 md:p-10">
      <Card className="w-full max-w-3xl flex flex-col max-h-[85vh] shadow-lg border-gray-200">
        <CardHeader className="border-b border-gray-100 bg-white rounded-t-xl shrink-0 text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">
            Kebijakan Privasi
          </CardTitle>
          <CardDescription className="text-gray-500 mt-1">
            Harap baca kebijakan privasi kami dengan saksama sebelum menggunakan
            layanan Cholestify.
          </CardDescription>
        </CardHeader>

        <CardContent className="overflow-y-auto p-6 md:p-8 space-y-6 text-sm text-gray-600 flex-1 bg-white custom-scrollbar">
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Cholestify
            </h3>
            <p className="leading-relaxed">
              Selamat datang di Cholestify. Kami menghargai privasi Anda dan
              berkomitmen untuk melindungi data pribadi yang Anda bagikan kepada
              kami. Kebijakan ini menjelaskan bagaimana kami mengumpulkan,
              menggunakan, dan melindungi informasi Anda ketika Anda menggunakan
              aplikasi dan layanan kami.
            </p>
          </section>

          <section>
            <p className="leading-relaxed">
              Kami dapat mengumpulkan berbagai jenis informasi, termasuk namun
              tidak terbatas pada informasi pribadi (seperti nama dan alamat
              email), data biometrik (termasuk hasil pemindaian dan foto yang
              diunggah melalui aplikasi), serta informasi kesehatan relevan
              lainnya yang Anda berikan kepada kami untuk keperluan analisis.
            </p>
          </section>

          <section>
            <p className="leading-relaxed">
              Data yang kami kumpulkan digunakan secara eksklusif untuk
              memberikan analisis kesehatan yang akurat, meningkatkan akurasi
              algoritma AI kami, dan menyajikan rekomendasi gaya hidup yang
              disesuaikan dengan profil kesehatan Anda. Kami menjamin bahwa kami
              tidak akan menjual, menyewakan, atau membagikan informasi pribadi
              Anda kepada pihak ketiga mana pun tanpa persetujuan eksplisit
              Anda, kecuali jika diwajibkan oleh hukum.
            </p>
          </section>

          <section>
            <p className="leading-relaxed">
              Kami menerapkan standar keamanan industri tertinggi untuk
              melindungi data Anda dari akses, pengubahan, atau penghancuran
              yang tidak sah. Semua data kesehatan dan biometrik Anda dienkripsi
              secara end-to-end dan disimpan secara aman di server yang mematuhi
              standar perlindungan data global.
            </p>
          </section>

          <section>
            <p className="leading-relaxed">
              Anda memiliki hak penuh untuk mengakses, memperbarui, atau meminta
              penghapusan data pribadi Anda dari sistem kami kapan saja. Hal ini
              dapat dilakukan melalui menu pengaturan akun di dalam aplikasi.
              Apabila Anda ingin menarik kembali persetujuan penggunaan data,
              Anda dapat menghubungi tim dukungan pelanggan kami.
            </p>
          </section>

          <section>
            <p className="leading-relaxed">
              Kebijakan privasi ini dapat kami perbarui dari waktu ke waktu
              untuk menyesuaikan dengan regulasi terbaru atau perubahan pada
              layanan kami. Kami akan menginformasikan setiap perubahan yang
              signifikan kepada Anda melalui email atau melalui notifikasi
              langsung di dalam aplikasi Cholestify.
            </p>
          </section>
        </CardContent>

        <CardFooter className="border-t border-gray-100 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gray-50/80 rounded-b-xl shrink-0">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-5 h-5"
            />
            <Label
              htmlFor="agree"
              className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
            >
              Saya setuju dengan Kebijakan Privasi
            </Label>
          </div>
          <Button
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 transition-all cursor-pointer"
            disabled={!agreed}
            onClick={() => router.push("/")}
          >
            Mengerti
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
