import Image from "next/image";
import React from "react";

const measurementSteps = [
  {
    number: 1,
    title: "Lakukan pengukuran di pagi hari",
    description:
      "Ukur setelah bangun tidur, sebelum minum kopi, olahraga, atau melakukan aktivitas lain.",
  },
  {
    number: 2,
    title: "Posisikan tubuh dalam keadaan tenang",
    description:
      "Duduk santai atau tetap berbaring agar detak jantung berada pada kondisi istirahat.",
  },
  {
    number: 3,
    title: "Temukan denyut nadi",
    description:
      "Gunakan dua atau tiga jari untuk meraba denyut nadi di pergelangan tangan atau leher.",
  },
  {
    number: 4,
    title: "Hitung denyut nadi",
    description: "Hitung denyut nadi selama 30 detik dengan ritme yang stabil.",
  },
  {
    number: 5,
    title: "Kalikan 2 dan catat hasilnya",
    description:
      "Kalikan hasil hitungan selama 30 detik dengan 2. Itulah nilai RHR Anda.",
  },
];

const rhrGuideImages = [
  {
    src: "/rhr/three-finger.png",
    alt: "Posisi jari untuk mengukur denyut nadi",
    title: "Temukan denyut nadi",
  },
  {
    src: "/rhr/timer-30.png",
    alt: "Hitung denyut nadi selama 30 detik",
    title: "Hitung 30 detik",
  },
  {
    src: "/rhr/times-2.png",
    alt: "Kalikan hasil denyut nadi dengan dua",
    title: "Kalikan 2",
  },
];

export default function CalculatesContent() {
  return (
    <>
      {/* Info Content */}
      <div className="flex-1 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-900">
            Apa Itu Detak Jantung Istirahat (RHR)?
          </h2>
          <p className="mb-3">
            <strong>Resting Heart Rate (RHR)</strong> atau{" "}
            <strong>Detak Jantung Saat Istirahat</strong> adalah jumlah detak
            jantung Anda per menit saat tubuh berada dalam kondisi benar-benar
            rileks, biasanya saat Anda baru bangun tidur di pagi hari sebelum
            melakukan aktivitas apa pun.
          </p>
          <p className="mb-3">
            RHR merupakan salah satu indikator penting dari{" "}
            <strong>kesehatan jantung dan kebugaran fisik</strong>. Umumnya:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              RHR normal untuk orang dewasa:{" "}
              <strong>60-100 denyut per menit (bpm)</strong>
            </li>
            <li>
              Atlet atau individu sangat fit bisa memiliki RHR di bawah{" "}
              <strong>60 bpm</strong>, bahkan mendekati <strong>40 bpm</strong>
            </li>
          </ul>
          <p className="mt-3">
            Semakin rendah nilai RHR Anda (dalam batas normal), maka{" "}
            <strong>semakin baik kondisi kebugaran jantung Anda</strong>.
          </p>
        </section>

        {/* SECTION YANG DIPERINDAH */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Bagaimana Cara Mengukur Detak Jantung Istirahat?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Ikuti langkah-langkah berikut untuk mengukur detak jantung
              istirahat dengan benar. Panduan visual di samping akan membantu
              Anda memahami setiap tahap dengan lebih mudah.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
            {/* Step kiri di desktop, bawah di mobile */}
            <div className="order-2 space-y-3 lg:order-1">
              {measurementSteps.map((step) => (
                <div
                  key={step.number}
                  className="flex min-h-[112px] items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50/80 p-4 transition hover:bg-white hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Gambar kanan di desktop, atas di mobile */}
            <div className="order-1 flex justify-center lg:order-2 lg:justify-center">
              <div className="flex w-full max-w-[320px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-sm lg:h-full lg:max-w-[300px]">
                <div className="space-y-3">
                  {rhrGuideImages.map((image) => (
                    <div
                      key={image.title}
                      className="flex min-h-[112px] items-center gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3"
                    >
                      <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center">
                        <div className="relative h-[80px] w-[80px]">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-contain"
                            sizes="80px"
                          />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-snug text-gray-900">
                          {image.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-1 flex-col justify-center rounded-2xl border border-gray-100 bg-gray-100 p-4">
                  <p className="text-sm font-extrabold text-center">
                    Rumus Cepat RHR
                  </p>

                  <div className="mt-3 rounded-xl bg-white px-4 py-3 text-center shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground">
                      Hitung 30 detik
                    </p>
                    <p className="mt-1 font-semibold text-gray-700">
                      Denyut x 2 = bpm
                    </p>
                  </div>

                  <div className="mt-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs font-semibold text-gray-700">
                      Contoh:
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-900/80">
                      Jika dalam 30 detik terasa 36 denyut, maka 36 x 2 ={" "}
                      <strong>72 bpm</strong>.
                    </p>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-gray-700">
                    Lakukan pengukuran saat tubuh benar-benar tenang agar hasil
                    lebih akurat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-900">
            Kenapa RHR Penting?
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              RHR yang terlalu tinggi bisa menjadi indikator{" "}
              <strong>stres, kurang tidur, dehidrasi, gangguan tiroid</strong>,
              atau <strong>masalah jantung</strong>.
            </li>
            <li>
              RHR yang konsisten rendah (pada orang yang tidak berolahraga) bisa
              menunjukkan adanya{" "}
              <strong>gangguan irama jantung (bradikardia)</strong>.
            </li>
            <li>
              Mengukur dan memantau RHR secara rutin bisa membantu{" "}
              <strong>mendeteksi perubahan kondisi kesehatan sejak dini</strong>
              .
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
