import {
  RHR_THRESHOLDS,
  RHR_DESCRIPTIONS,
} from "../constants/heart-rate.constant.js";

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

  const threshold = RHR_THRESHOLDS[gender]?.[activityLevel];
  const desc = RHR_DESCRIPTIONS[activityLevel];

  let category = "";
  let description = "";

  if (!threshold || !desc) {
    category = "Tidak Diketahui";
    description = "Aktivitas harian yang dipilih belum sesuai.";
  } else if (restingHeartRate < threshold.low) {
    category = activityLevel === "ATHLETE" ? "Sangat Rendah" : "Rendah";
    description = desc.low;
  } else if (restingHeartRate <= threshold.high) {
    category = activityLevel === "ATHLETE" ? "Normal Atlet" : "Normal";
    description = desc.normal;
  } else {
    category = "Tinggi";
    description = desc.high;
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
