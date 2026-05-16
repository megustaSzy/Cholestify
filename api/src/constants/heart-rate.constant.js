export const RHR_THRESHOLDS = {
  MALE: {
    INACTIVE: { low: 60, high: 100 },
    LIGHTLY_ACTIVE: { low: 55, high: 95 },
    ACTIVE: { low: 50, high: 90 },
    ATHLETE: { low: 40, high: 80 },
  },
  FEMALE: {
    INACTIVE: { low: 65, high: 100 },
    LIGHTLY_ACTIVE: { low: 60, high: 100 },
    ACTIVE: { low: 55, high: 95 },
    ATHLETE: { low: 45, high: 85 },
  },
};

export const RHR_DESCRIPTIONS = {
  INACTIVE: {
    low: "Detak jantung istirahat kamu cenderung lebih rendah dari rata-rata.",
    normal: "Detak jantung istirahat kamu masih dalam rentang normal.",
    high: "Detak jantung istirahat kamu cukup tinggi dibanding rata-rata.",
  },
  LIGHTLY_ACTIVE: {
    low: "Detak jantung kamu cukup rendah untuk aktivitas harian ringan.",
    normal:
      "Detak jantung kamu masih terlihat normal untuk aktivitas harian ringan.",
    high: "Detak jantung kamu sedikit lebih tinggi dari rata-rata.",
  },
  ACTIVE: {
    low: "Detak jantung kamu cukup rendah dan biasanya ditemukan pada orang yang aktif berolahraga.",
    normal: "Detak jantung kamu terlihat baik untuk seseorang yang aktif.",
    high: "Detak jantung kamu lebih tinggi dari rata-rata orang aktif.",
  },
  ATHLETE: {
    low: "Detak jantung kamu sangat rendah dan umum ditemukan pada atlet tertentu.",
    normal: "Detak jantung kamu masih normal untuk kategori atlet.",
    high: "Detak jantung kamu cukup tinggi untuk kategori atlet.",
  },
};
