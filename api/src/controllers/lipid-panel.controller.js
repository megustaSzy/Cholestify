import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";

import { LipidPanelService } from "../services/lipid-panel.service.js";

export const LipidPanelController = {
  async getLipidPanels(req, res, next) {
    try {
      const data = await LipidPanelService.getLipidPanels();

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.LIPID_PANEL.FOUND,

        metadata: {
          status: HttpStatus.OK,
        },

        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getLipidPanelByUserId(req, res, next) {
    try {
      const id = Number(req.params.id);

      const data = await LipidPanelService.getLipidPanelByUserId(id);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.LIPID_PANEL.FOUND,

        metadata: {
          status: HttpStatus.OK,
        },

        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createLipidPanel(req, res, next) {
    try {
      const userId = req.user.id;

      const data = await LipidPanelService.create(userId, req.body);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGE.LIPID_PANEL.CREATED,

        metadata: {
          status: HttpStatus.CREATED,
        },

        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateLipidPanel(req, res, next) {
    try {
      const userId = Number(req.params.id);

      const data = await LipidPanelService.update(userId, req.body);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.COMMON.SUCCESS_UPDATE,

        metadata: {
          status: HttpStatus.OK,
        },

        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteLipidPanel(req, res, next) {
    try {
      const userId = Number(req.params.id);

      await LipidPanelService.remove(userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.LIPID_PANEL.DELETED,

        metadata: {
          status: HttpStatus.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
