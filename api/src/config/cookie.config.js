export const COOKIE_CONFIG = {
  ACCESS_TOKEN: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  },
  REFRESH_TOKEN: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  },
};


// export const COOKIE_CONFIG = {
//   ACCESS_TOKEN: {
//     httpOnly: true,
//     secure: true, // WAJIB di production
//     sameSite: "none", // WAJIB untuk OAuth (Google)
//     maxAge: 15 * 60 * 1000,
//     path: "/",
//   },
//   REFRESH_TOKEN: {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     path: "/",
//   },
// };