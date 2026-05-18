import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  CLINICAL_THRESHOLDS,
  HEALTH_RECOMMENDATION_ADVICE,
} from "../constants/health-recommendation.constant.js";

const adviceCache = new Map();

const generateFallbackAdvice = (totalCholesterol, ldl, hdl, triglycerides) => {
  let dietaryAdvice = "";
  let activityAdvice = "";

  const isLdlHigh = ldl >= CLINICAL_THRESHOLDS.LDL_HIGH;
  const isTotalHigh =
    totalCholesterol >= CLINICAL_THRESHOLDS.TOTAL_CHOLESTEROL_HIGH;
  const isTgHigh = triglycerides >= CLINICAL_THRESHOLDS.TRIGLYCERIDES_HIGH;
  const isHdlLow = hdl < CLINICAL_THRESHOLDS.HDL_LOW;

  if (isLdlHigh || isTotalHigh || isTgHigh) {
    dietaryAdvice = HEALTH_RECOMMENDATION_ADVICE.DIETARY.HIGH_RISK;
  } else if (isHdlLow) {
    dietaryAdvice = HEALTH_RECOMMENDATION_ADVICE.DIETARY.LOW_HDL;
  } else {
    dietaryAdvice = HEALTH_RECOMMENDATION_ADVICE.DIETARY.OPTIMAL;
  }

  if (isLdlHigh || isTotalHigh || isTgHigh || isHdlLow) {
    activityAdvice = HEALTH_RECOMMENDATION_ADVICE.ACTIVITY.NEEDS_IMPROVEMENT;
  } else {
    activityAdvice = HEALTH_RECOMMENDATION_ADVICE.ACTIVITY.OPTIMAL;
  }

  return { dietaryAdvice, activityAdvice };
};

export const generateHealthAdvice = async (
  totalCholesterol,
  ldl,
  hdl,
  triglycerides,
) => {
  const cacheKey = `${totalCholesterol}-${ldl}-${hdl}-${triglycerides}`;
  if (adviceCache.has(cacheKey)) {
    console.log("[HealthAdvice] Cache hit, skipping API call.");
    return adviceCache.get(cacheKey);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  if (!genAI) {
    console.log("[HealthAdvice] No API key, using fallback.");
    const fallback = generateFallbackAdvice(
      totalCholesterol,
      ldl,
      hdl,
      triglycerides,
    );
    adviceCache.set(cacheKey, fallback);
    return fallback;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a medical assistant specializing in cardiology and nutrition.
You MUST respond in Bahasa Indonesia.

Patient lipid data:
- Total Cholesterol: ${totalCholesterol} mg/dL
- LDL: ${ldl} mg/dL
- HDL: ${hdl} mg/dL
- Triglycerides: ${triglycerides} mg/dL

IMPORTANT:
Return ONLY valid JSON.
No markdown.
No explanation.
No extra text.

JSON format:
{
  "dietaryAdvice": "string (max 2-3 sentences)",
  "activityAdvice": "string (max 2-3 sentences)"
}

Focus on the worst abnormal value first.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (err) {
      console.log("[HealthAdvice] JSON parse failed → fallback digunakan");
      const fallback = generateFallbackAdvice(
        totalCholesterol,
        ldl,
        hdl,
        triglycerides,
      );
      adviceCache.set(cacheKey, fallback);
      return fallback;
    }

    console.log("[HealthAdvice] Gemini success");

    const advice = {
      dietaryAdvice: parsed.dietaryAdvice || "",
      activityAdvice: parsed.activityAdvice || "",
    };

    adviceCache.set(cacheKey, advice);

    return advice;
  } catch (error) {
    console.error("[HealthAdvice] Gemini error → fallback:", error.message);

    const fallback = generateFallbackAdvice(
      totalCholesterol,
      ldl,
      hdl,
      triglycerides,
    );
    adviceCache.set(cacheKey, fallback);
    return fallback;
  }
};
