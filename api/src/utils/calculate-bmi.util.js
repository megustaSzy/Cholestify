// src/utils/calculate-bmi.util.js

/**
 * Menghitung BMI dari tinggi (cm) dan berat (kg)
 * Rumus: BMI = weight / (height_in_m)^2
 *
 * @param {number} height - Tinggi badan dalam cm
 * @param {number} weight - Berat badan dalam kg
 * @returns {{ bmi: number, bmiCategory: string }}
 */
export const calculateBmi = (height, weight) => {
  const heightInMeter = height / 100;
  const bmi = parseFloat((weight / (heightInMeter * heightInMeter)).toFixed(1));

  let bmiCategory;

  if (bmi < 18.5) {
    bmiCategory = "Underweight";
  } else if (bmi < 25) {
    bmiCategory = "Normal";
  } else if (bmi < 30) {
    bmiCategory = "Overweight";
  } else {
    bmiCategory = "Obese";
  }

  return { bmi, bmiCategory };
};
