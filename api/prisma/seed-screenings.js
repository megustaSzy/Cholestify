import { prisma } from "../src/lib/prisma.js";

async function main() {
  const userId = 14;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.error(`User dengan ID ${userId} tidak ditemukan!`);
    return;
  }

  const eyeImages = [
    "https://www.datariau.com/photo/berita/dir052024/_619_Kenali-Tanda-Kolesterol-Tinggi-pada-Mata.jpg",
    "https://cdn.grid.id/crop/0x0:0x0/700x465/smart/filters:format(webp):quality(100)/photo/2022/08/19/ciri-ciri-kolesterol-tinggi-di-m-20220819080041.jpg",
    "https://foto.kontan.co.id/uJHdZAvyFV1LzheG3MCNil7ZEzU=/smart/2023/02/07/7344672p.jpg",
    "https://cms.tzuchihospital.co.id/storage/images/blog/1771484617.png",
  ];

  const dummyScreenings = [];
  const dummyLipids = [];

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1); 

  let lastImageUrl = "";

  for (let i = 0; i < 52; i++) {
    const recordDate = new Date(startDate);
    recordDate.setDate(startDate.getDate() + i * 7);

    const resultChoice =
      Math.random() > 0.3 ? "INDIKASI_KUAT" : "INDIKASI_RINGAN";

    let randomImageUrl;
    do {
      randomImageUrl = eyeImages[Math.floor(Math.random() * eyeImages.length)];
    } while (randomImageUrl === lastImageUrl);
    lastImageUrl = randomImageUrl;
    const randomConfidence = parseFloat((Math.random() * (99.0 - 75.0) + 75.0).toFixed(1));

    let probNormal, probRingan, probKuat;
    if (resultChoice === "INDIKASI_KUAT") {
      probKuat = randomConfidence;
      probRingan = parseFloat(((100 - randomConfidence) * 0.7).toFixed(1));
      probNormal = parseFloat(((100 - randomConfidence) * 0.3).toFixed(1));
    } else {
      probRingan = randomConfidence;
      probKuat = parseFloat(((100 - randomConfidence) * 0.6).toFixed(1));
      probNormal = parseFloat(((100 - randomConfidence) * 0.4).toFixed(1));
    }

    const mockProbabilities = {
      NORMAL: probNormal,
      INDIKASI_RINGAN: probRingan,
      INDIKASI_KUAT: probKuat
    };

    let description, recommendation;
    if (resultChoice === "INDIKASI_RINGAN") {
      description =
        "Terdeteksi sedikit indikasi arcus senilis. Menunjukkan awal mula penumpukan kolesterol di kornea.";
      recommendation =
        "Kurangi makanan berlemak tinggi, perbanyak aktivitas fisik, dan cek profil lipid Anda secara berkala.";
    } else {
      description =
        "Terdeteksi indikasi kuat arcus senilis. Ini sangat berkaitan erat dengan kadar kolesterol LDL yang tinggi (Hiperlipidemia).";
      recommendation =
        "Sangat disarankan segera berkonsultasi dengan dokter untuk terapi penurun kolesterol dan atur diet ketat.";
    }

    dummyScreenings.push({
      userId: userId,
      imageUrl: randomImageUrl,
      result: resultChoice,
      confidence: randomConfidence,
      probabilities: mockProbabilities,
      description: description,
      recommendation: recommendation,
      createdAt: recordDate,
    });

    const tc = Math.floor(Math.random() * (300 - 220 + 1) + 220);
    const ldl = Math.floor(Math.random() * (210 - 150 + 1) + 150);
    const hdl = Math.floor(Math.random() * (45 - 30 + 1) + 30);
    const tg = Math.floor(Math.random() * (280 - 180 + 1) + 180);

    dummyLipids.push({
      userId: userId,
      date: recordDate,
      totalCholesterol: tc,
      ldl: ldl,
      hdl: hdl,
      triglycerides: tg,
      createdAt: recordDate,
      updatedAt: recordDate,
    });
  }

  await prisma.screening.deleteMany({ where: { userId: userId } });
  await prisma.lipidPanel.deleteMany({ where: { userId: userId } });

  await prisma.screening.createMany({
    data: dummyScreenings,
  });

  await prisma.lipidPanel.createMany({
    data: dummyLipids,
  });

  console.log(
    `Berhasil menambahkan 52 data screening mata dan 52 data Lipid Panel untuk User ID ${userId} dalam 1 tahun terakhir!`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
