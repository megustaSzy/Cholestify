const isProduction = process.env.NODE_ENV === "production";
const useSecure = isProduction || process.env.COOKIE_SECURE === "true";

export const COOKIE_CONFIG = {
  ACCESS_TOKEN: {
    httpOnly: true,
    secure: useSecure,
    sameSite: useSecure ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  },
  REFRESH_TOKEN: {
    httpOnly: true,
    secure: useSecure,
    sameSite: useSecure ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  },
};
