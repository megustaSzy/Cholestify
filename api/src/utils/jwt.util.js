import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES,
  });
};

export const generateRefreshToken = (payload) => {
  // Tambahkan jti (JWT ID) agar payload unik, menghindari token kembar jika login dalam detik yang sama
  const uniquePayload = { ...payload, jti: crypto.randomUUID() };
  return jwt.sign(uniquePayload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
