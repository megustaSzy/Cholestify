import {
  CLINICAL_THRESHOLDS,
  HEALTH_RECOMMENDATION_ADVICE,
} from "../constants/health-recommendation.constant.js";

export const generateHealthAdvice = (
  totalCholesterol,
  ldl,
  hdl,
  triglycerides
) => {
  let dietaryAdvice = "";
  let activityAdvice = "";

  const isLdlHigh = ldl >= CLINICAL_THRESHOLDS.LDL_HIGH;
  const isTotalHigh =
    totalCholesterol >= CLINICAL_THRESHOLDS.TOTAL_CHOLESTEROL_HIGH;
  const isTgHigh = triglycerides >= CLINICAL_THRESHOLDS.TRIGLYCERIDES_HIGH;
  const isHdlLow = hdl < CLINICAL_THRESHOLDS.HDL_LOW;

  // 1. Dietary Advice
  if (isLdlHigh || isTotalHigh || isTgHigh) {
    dietaryAdvice = HEALTH_RECOMMENDATION_ADVICE.DIETARY.HIGH_RISK;
  } else if (isHdlLow) {
    dietaryAdvice = HEALTH_RECOMMENDATION_ADVICE.DIETARY.LOW_HDL;
  } else {
    dietaryAdvice = HEALTH_RECOMMENDATION_ADVICE.DIETARY.OPTIMAL;
  }

  // 2. Activity Advice
  if (isLdlHigh || isTotalHigh || isTgHigh || isHdlLow) {
    activityAdvice = HEALTH_RECOMMENDATION_ADVICE.ACTIVITY.NEEDS_IMPROVEMENT;
  } else {
    activityAdvice = HEALTH_RECOMMENDATION_ADVICE.ACTIVITY.OPTIMAL;
  }

  return { dietaryAdvice, activityAdvice };
};
