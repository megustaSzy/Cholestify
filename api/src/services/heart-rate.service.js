import { calculateRHR } from "../utils/calculate-rhr.util.js";

export const HeartRateService = {
  async calculate(body) {
    return calculateRHR(body);
  },
};
