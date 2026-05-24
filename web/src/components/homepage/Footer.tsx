"use client";

import Link from "next/link";
import React, { useState } from "react";
import { X } from "lucide-react";
import { IconLinkedin, IconTwitter } from "../Icon";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export const footerLinks = [
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
    type: "dialog",
  },
  {
    label: "User Research",
    href: "/user-research",
  },
  {
    label: "Terms of Service",
    href: "/terms",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function FooterForm() {
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleClosePrivacy = () => {
    setOpenPrivacy(false);
    setAgreed(false);
  };

  return (
    <>
      <footer className="border-t border-gray-100 bg-white px-4 py-7 sm:px-6 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="text-center sm:text-left">
            <span className="text-lg font-extrabold text-blue-600">
              Cholestify
            </span>
            <p className="mt-1 text-[11px] text-gray-400">
              © 2026 Cholestify. Clinical Monitor.
            </p>
          </div>

          <div className="flex justify-center sm:flex-1">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 sm:gap-6">
              {footerLinks.map((link) =>
                link.type === "dialog" ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => {
                      setAgreed(false);
                      setOpenPrivacy(true);
                    }}
                    className="text-xs text-gray-500 transition-colors hover:text-blue-600"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-xs text-gray-500 transition-colors hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="#"
              className="text-gray-400 transition-colors hover:text-blue-600"
            >
              <IconTwitter />
            </Link>
            <Link
              href="#"
              className="text-gray-400 transition-colors hover:text-blue-600"
            >
              <IconLinkedin />
            </Link>
          </div>
        </div>
      </footer>

      {openPrivacy && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-bold text-blue-600 sm:text-2xl">
                  Kebijakan Privasi
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  Harap baca kebijakan privasi Cholestify dengan saksama.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenPrivacy(false)}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                aria-label="Tutup privacy policy"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 text-sm leading-relaxed text-gray-600 sm:px-6">
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Cholestify
                </h3>
                <p className="leading-relaxed">
                  Selamat datang di Cholestify. Kami menghargai privasi Anda dan
                  berkomitmen untuk melindungi data pribadi yang Anda bagikan
                  kepada kami. Kebijakan ini menjelaskan bagaimana kami
                  mengumpulkan, menggunakan, dan melindungi informasi Anda
                  ketika Anda menggunakan aplikasi dan layanan kami.
                </p>
              </section>

              <section>
                <p className="leading-relaxed">
                  Kami dapat mengumpulkan berbagai jenis informasi, termasuk
                  namun tidak terbatas pada informasi pribadi (seperti nama dan
                  alamat email), data biometrik (termasuk hasil pemindaian dan
                  foto yang diunggah melalui aplikasi), serta informasi
                  kesehatan relevan lainnya yang Anda berikan kepada kami untuk
                  keperluan analisis.
                </p>
              </section>

              <section>
                <p className="leading-relaxed">
                  Data yang kami kumpulkan digunakan secara eksklusif untuk
                  memberikan analisis kesehatan yang akurat, meningkatkan
                  akurasi algoritma AI kami, dan menyajikan rekomendasi gaya
                  hidup yang disesuaikan dengan profil kesehatan Anda. Kami
                  menjamin bahwa kami tidak akan menjual, menyewakan, atau
                  membagikan informasi pribadi Anda kepada pihak ketiga mana pun
                  tanpa persetujuan eksplisit Anda, kecuali jika diwajibkan oleh
                  hukum.
                </p>
              </section>

              <section>
                <p className="leading-relaxed">
                  Kami menerapkan standar keamanan industri tertinggi untuk
                  melindungi data Anda dari akses, pengubahan, atau penghancuran
                  yang tidak sah. Semua data kesehatan dan biometrik Anda
                  dienkripsi secara end-to-end dan disimpan secara aman di
                  server yang mematuhi standar perlindungan data global.
                </p>
              </section>

              <section>
                <p className="leading-relaxed">
                  Anda memiliki hak penuh untuk mengakses, memperbarui, atau
                  meminta penghapusan data pribadi Anda dari sistem kami kapan
                  saja. Hal ini dapat dilakukan melalui menu pengaturan akun di
                  dalam aplikasi. Apabila Anda ingin menarik kembali persetujuan
                  penggunaan data, Anda dapat menghubungi tim dukungan pelanggan
                  kami.
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
            </div>

            <div className="border-t border-gray-100 bg-gray-50/80 px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="privacy-agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked === true)}
                    className="mt-0.5 size-5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                  />

                  <Label
                    htmlFor="privacy-agree"
                    className="cursor-pointer select-none text-sm font-medium leading-relaxed text-gray-700"
                  >
                    Saya setuju dengan Kebijakan Privasi
                  </Label>
                </div>

                <button
                  type="button"
                  onClick={handleClosePrivacy}
                  disabled={!agreed}
                  className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 sm:w-auto"
                >
                  Saya Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
