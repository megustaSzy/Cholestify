// controllers/heart-rate.controller.js

import { HttpStatus } from "../constants/http-status.constant.js";

import { HeartRateService } from "../services/heart-rate.service.js";

export const HeartRateController = {
  async calculate(req, res, next) {
    try {
      const data = await HeartRateService.calculate(req.body);

      return res.status(HttpStatus.OK).json({
        success: true,

        message: "Perhitungan detak jantung berhasil",

        metadata: {
          status: HttpStatus.OK,
        },

        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
