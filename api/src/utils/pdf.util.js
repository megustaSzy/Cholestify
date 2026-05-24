import PDFDocument from "pdfkit-table";

const drawPatientInfoBox = (doc, user) => {
  const startY = doc.y;

  doc.rect(50, startY, 495, 90).fillAndStroke("#f4f6f8", "#d1d5db");

  doc.fillColor("black");
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Informasi Pasien", 65, startY + 15);

  doc.font("Helvetica").fontSize(10).fillColor("black");

  doc.text("Nama Lengkap", 65, startY + 40);
  doc.text(`: ${user.nama || "-"}`, 145, startY + 40);

  doc.text("Email Pasien", 65, startY + 60);
  doc.text(`: ${user.email || "-"}`, 145, startY + 60);

  doc.text("ID Pasien", 300, startY + 40);
  doc.text(`: ${user.patientId || "Tidak tersedia"}`, 370, startY + 40);

  const dob = user.dob
    ? new Date(user.dob).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Tidak tersedia";

  doc.text("Tanggal Lahir", 300, startY + 60);
  doc.text(`: ${dob}`, 370, startY + 60);

  doc.y = startY + 110;
  doc.fillColor("black");
};

export const generateLipidPDF = (res, user, lipids) => {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Riwayat_Lipid_${user.nama.replace(/\s+/g, "_")}.pdf`,
  );

  const doc = new PDFDocument({ margin: 50, size: "A4" });
  doc.pipe(res);

  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor("black")
    .text("Laporan Riwayat Profil Lipid", { align: "center" })
    .moveDown(0.2);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("black")
    .text("Di-generate secara otomatis oleh Sistem Cholestify", {
      align: "center",
    })
    .moveDown(2);

  drawPatientInfoBox(doc, user);
  doc.moveDown(1.5);

  // TABEL DATA
  const table = {
    title: "Catatan Hasil Pengukuran Lipid (darah)",
    headers: [
      {
        label: "Tanggal",
        property: "tanggal",
        width: 95,
        align: "center",
        headerAlign: "center",
      },
      {
        label: "Kolesterol Total",
        property: "total",
        width: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        label: "LDL",
        property: "ldl",
        width: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        label: "HDL",
        property: "hdl",
        width: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        label: "Trigliserida",
        property: "trigliserida",
        width: 100,
        align: "center",
        headerAlign: "center",
      },
    ],
    datas: lipids.map((lipid) => {
      const date = new Date(lipid.date || lipid.createdAt).toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      );
      return {
        tanggal: date,
        total: `${lipid.totalCholesterol} mg/dL`,
        ldl: `${lipid.ldl} mg/dL`,
        hdl: `${lipid.hdl} mg/dL`,
        trigliserida: `${lipid.triglycerides} mg/dL`,
      };
    }),
  };

  doc.table(table, {
    x: 50,
    width: 495,
    prepareHeader: () =>
      doc.font("Helvetica-Bold").fontSize(10).fillColor("black"),
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      doc.font("Helvetica").fontSize(9).fillColor("black");
    },
    columnSpacing: 5,
    divider: {
      header: { disabled: false, width: 1.5, opacity: 1, color: "#9ca3af" },
      horizontal: {
        disabled: false,
        width: 0.5,
        opacity: 0.5,
        color: "#e5e7eb",
      },
    },
  });

  // FOOTER
  doc.moveDown(3);
  doc
    .fontSize(9)
    .font("Helvetica-Oblique")
    .fillColor("black")
    .text(
      "Catatan: Laporan ini hanya untuk referensi pribadi. Pastikan selalu berkonsultasi dengan dokter atau tenaga medis profesional untuk diagnosis klinis yang akurat.",
      { align: "center", width: 495 },
    );

  doc.end();
};

export const generateScreeningPDF = (res, user, screenings) => {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Riwayat_Screening_${user.nama.replace(/\s+/g, "_")}.pdf`,
  );

  const doc = new PDFDocument({ margin: 50, size: "A4" });
  doc.pipe(res);

  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor("black")
    .text("Laporan Deteksi Mata (Arcus Senilis)", { align: "center" })
    .moveDown(0.2);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("black")
    .text("Di-generate secara otomatis oleh AI Cholestify", { align: "center" })
    .moveDown(2);

  drawPatientInfoBox(doc, user);
  doc.moveDown(1.5);

  const table = {
    title: "Riwayat Pemindaian Mata AI",
    headers: [
      {
        label: "Tanggal",
        property: "tanggal",
        width: 85,
        align: "center",
        headerAlign: "center",
      },
      {
        label: "Hasil Deteksi",
        property: "hasil",
        width: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        label: "Akurasi AI",
        property: "akurasi",
        width: 70,
        align: "center",
        headerAlign: "center",
      },
      {
        label: "Rekomendasi Dokter",
        property: "rekomendasi",
        width: 240,
        align: "left",
        headerAlign: "left",
      },
    ],
    datas: screenings.map((scan) => {
      const date = new Date(scan.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const confidence = `${parseFloat(scan.confidence).toFixed(1)}%`;

      let result = scan.result;
      if (result === "INDIKASI_KUAT") result = "Indikasi Kuat";
      else if (result === "INDIKASI_RINGAN") result = "Indikasi Ringan";
      else if (result === "NORMAL") result = "Normal";

      return {
        tanggal: date,
        hasil: result,
        akurasi: confidence,
        rekomendasi: scan.recommendation || "-",
      };
    }),
  };

  doc.table(table, {
    x: 50,
    width: 495,
    prepareHeader: () =>
      doc.font("Helvetica-Bold").fontSize(10).fillColor("black"),
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      doc.font("Helvetica").fontSize(9).fillColor("black");
    },
    columnSpacing: 8,
    divider: {
      header: { disabled: false, width: 1.5, opacity: 1, color: "#9ca3af" },
      horizontal: {
        disabled: false,
        width: 0.5,
        opacity: 0.5,
        color: "#e5e7eb",
      },
    },
  });

  // FOOTER
  doc.moveDown(3);
  doc
    .fontSize(9)
    .font("Helvetica-Oblique")
    .fillColor("black")
    .text(
      "Catatan: Hasil screening AI ini bertindak sebagai alat bantu (prescreening) dan tidak menggantikan vonis laboratorium medis. Segera hubungi dokter jika Anda memiliki gejala fisik yang mengganggu.",
      { align: "center", width: 495 },
    );

  doc.end();
};
