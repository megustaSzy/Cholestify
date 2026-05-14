export const calculateRHR = ({
  dob,
  gender,
  restingHeartRate,
  activityLevel,
}) => {
  const today = new Date();

  const birthDate = new Date(dob);

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  let category = "";
  let description = "";

  switch (activityLevel) {
    case "INACTIVE":
      if (restingHeartRate < 60) {
        category = "Rendah";

        description =
          "Detak jantung istirahat kamu cenderung lebih rendah dari rata-rata.";
      } else if (restingHeartRate >= 60 && restingHeartRate <= 100) {
        category = "Normal";

        description =
          "Detak jantung istirahat kamu masih dalam rentang normal.";
      } else {
        category = "Tinggi";

        description =
          "Detak jantung istirahat kamu cukup tinggi dibanding rata-rata.";
      }

      break;

    case "LIGHTLY_ACTIVE":
      if (restingHeartRate < 55) {
        category = "Rendah";

        description =
          "Detak jantung kamu cukup rendah untuk aktivitas harian ringan.";
      } else if (restingHeartRate >= 55 && restingHeartRate <= 95) {
        category = "Normal";

        description =
          "Detak jantung kamu masih terlihat normal untuk aktivitas harian ringan.";
      } else {
        category = "Tinggi";

        description = "Detak jantung kamu sedikit lebih tinggi dari rata-rata.";
      }

      break;

    case "ACTIVE":
      if (restingHeartRate < 50) {
        category = "Rendah";

        description =
          "Detak jantung kamu cukup rendah dan biasanya ditemukan pada orang yang aktif berolahraga.";
      } else if (restingHeartRate >= 50 && restingHeartRate <= 90) {
        category = "Normal";

        description =
          "Detak jantung kamu terlihat baik untuk seseorang yang aktif.";
      } else {
        category = "Tinggi";

        description =
          "Detak jantung kamu lebih tinggi dari rata-rata orang aktif.";
      }

      break;

    case "ATHLETE":
      if (restingHeartRate < 40) {
        category = "Sangat Rendah";

        description =
          "Detak jantung kamu sangat rendah dan umum ditemukan pada atlet tertentu.";
      } else if (restingHeartRate >= 40 && restingHeartRate <= 80) {
        category = "Normal Atlet";

        description = "Detak jantung kamu masih normal untuk kategori atlet.";
      } else {
        category = "Tinggi";

        description = "Detak jantung kamu cukup tinggi untuk kategori atlet.";
      }

      break;

    default:
      category = "Tidak Diketahui";

      description = "Aktivitas harian yang dipilih belum sesuai.";
  }

  return {
    age,

    gender: gender === "MALE" ? "Pria" : "Wanita",

    restingHeartRate,

    activityLevel,

    category,

    description,
  };
};
