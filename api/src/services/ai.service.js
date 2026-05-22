import axios from "axios";
import FormData from "form-data";
import { InternalServerError } from "../exceptions/InternalServerError.js";
import { io } from "../server.js";

export const predictEyeScan = async (fileBuffer, filename, socketId) => {
  try {
    if (socketId) {
      io.to(socketId).emit("scan_progress", { message: "Menganalisis pola retina mata...", progress: 30 });
    }

    const formData = new FormData();
    formData.append("file", fileBuffer, filename);

    if (socketId) {
      io.to(socketId).emit("scan_progress", { message: "Mengekstraksi indikasi lipid dengan Model AI...", progress: 60 });
    }

    const response = await axios.post(
      process.env.FASTAPI_URL + "/predict",
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
        timeout: 15000, // timeout 15s
      },
    );

    if (socketId) {
      io.to(socketId).emit("scan_progress", { message: "Selesai! Menampilkan hasil...", progress: 100 });
    }

    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new InternalServerError(
        "Waktu request ke layanan AI habis (Timeout). Server sedang sibuk, silakan coba lagi.",
      );
    }

    console.error("[AI Service Error]:", error.response?.data || error.message);

    throw new InternalServerError(
      "Layanan AI gagal memproses gambar. Pastikan server AI menyala dan gambar valid.",
    );
  }
};
