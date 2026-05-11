export const MESSAGE = {
  COMMON: {
    BAD_REQUEST: "Parameter tidak valid",
    SUCCESS_UPDATE: "Data berhasil diperbarui",
  },

  USER: {
    FOUND: "Data user berhasil ditemukan",
    NOT_FOUND: "Data user tidak ditemukan",
    CREATED: "Data User berhasil ditambahkan",
    DELETED: "Data User berhasil dihapus",
    EMAIL_ALREADY_USED: "Email sudah digunakan",
  },

  AUTH: {
    LOGIN_SUCCESS: "Login berhasil",
    LOGIN_FAILED: "Email atau password salah",
    REGISTER_SUCCESS: "Registrasi berhasil",
    LOGOUT_SUCCESS: "Logout berhasil",

    UNAUTHORIZED: "User tidak terautentikasi",
    FORBIDDEN: "Akses ditolak",
    FORBIDDEN_OWNER: "Anda hanya bisa mengakses data sendiri",

    RESET_PASSWORD_EMAIL_SENT: "Jika email terdaftar, link reset akan dikirim",
    RESET_TOKEN_INVALID: "Token tidak valid atau sudah kadaluarsa",
    PASSWORD_UPDATED: "Password berhasil diperbarui",
  },

  PROFILE: {
    FOUND: "Data profile berhasil ditemukan",
    NOT_FOUND: "Data Profile tidak ditemukan",
    DELETED: "Data Profile berhasil dihapus",
    RESET: "Data profile berhasil direset",
  },

  TOKEN: {
    NOT_FOUND: "Token tidak ditemukan",
    INVALID: "Token tidak valid",
    REFRESH_NOT_FOUND: "Refresh token tidak ditemukan",
    REFRESH_INVALID: "Refresh token tidak valid",
  },
};
