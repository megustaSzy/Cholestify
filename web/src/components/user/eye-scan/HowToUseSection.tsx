import { Camera, Eye, EyeOff, Hand, Lightbulb, Upload } from "lucide-react";
import React from "react";

export default function HowToUse() {
  const howToUseSteps = [
    {
      icon: <Camera className="w-6 h-6 text-blue-600" />,
      title: "Ambil Gambar",
      description:
        "Ambil foto mata Anda dengan resolusi tinggi dan tidak berbayang untuk hasil maksimal",
    },
    {
      icon: <Eye className="w-6 h-6 text-blue-600" />,
      title: "Lihat Kualitas Gambar",
      description:
        "Pastikan kembali mata iris dan kornea terlihat jelas tanpa silau untuk deteksi yang akurat.",
    },
    {
      icon: <Upload className="w-6 h-6 text-blue-600" />,
      title: "Upload & AI Analisis",
      description:
        "Unggah foto untuk memulai analisis AI dan terima wawasan klinis secara langsung.",
    },
  ];

  const tips = [
    {
      icon: <Lightbulb className="w-6 h-6 text-blue-600" />,
      title: "Pencahayaan baik",
      description:
        "Lakukan pemindaian di ruangan yang terang benderang untuk mendapat hasil yang maksimal",
    },
    {
      icon: <Hand className="w-6 h-6 text-blue-600" />,
      title: "Stabilkan Kamera",
      description:
        "Pegang ponsel Anda sejajar dengan mata dan tahan sebisa mungkin agar tidak bergerak",
    },
    {
      icon: <EyeOff className="w-6 h-6 text-blue-600" />,
      title: "Lepas Accessories",
      description:
        "Lepaskan kacamata atau lensa kontak berwarna sebelum memulai pemindaian kamera.",
    },
  ];

  return (
    <div className="xl:col-span-2 flex flex-col gap-5">
      {/* Cara Penggunaan */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-3">
          Cara Penggunaan
        </h2>
        <div className="flex flex-col gap-3">
          {howToUseSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                {step.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-0.5">
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hal Yang Harus Perhatikan */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-3">
          Hal Yang Harus Perhatikan
        </h2>
        <div className="flex flex-col gap-3">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                {tip.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-0.5">
                  {tip.title}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
