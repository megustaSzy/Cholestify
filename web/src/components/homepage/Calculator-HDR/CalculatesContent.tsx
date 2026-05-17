import React from "react";

export default function CalculatesContent() {
  return (
    <>
      {/* Info Content */}
      <div className="flex-1 text-gray-700 text-sm leading-relaxed space-y-6">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
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
          <ul className="list-disc pl-5 space-y-1">
            <li>
              RHR normal untuk orang dewasa:{" "}
              <strong>60–100 denyut per menit (bpm)</strong>
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

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Bagaimana Cara Mengukur Detak Jantung Istirahat?
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Lakukan pengukuran di pagi hari</strong> setelah bangun
              tidur, sebelum minum kopi, olahraga, atau aktivitas lain.
            </li>
            <li>
              <strong>Duduk atau tetap berbaring dalam kondisi tenang.</strong>
            </li>
            <li>
              Gunakan dua jari (telunjuk dan tengah) untuk meraba denyut nadi di
              leher (dekat tenggorokan) atau pergelangan tangan.
            </li>
            <li>
              Hitung jumlah denyut selama <strong>60 detik penuh</strong>, atau
              hitung selama <strong>15 detik lalu dikali 4</strong>.
            </li>
            <li>
              Catat hasilnya, itu adalah <strong>nilai RHR Anda</strong>.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Kenapa RHR Penting?
          </h2>
          <ul className="list-disc pl-5 space-y-2">
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
