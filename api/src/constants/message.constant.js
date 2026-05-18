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

  BIOMETRIC: {
    FOUND: "Data Biometric berhasil ditemukan",
    NOT_FOUND: "Data Biometric tidak ditemukan",
    DELETED: "Data Biometric berhasil dihapus",
    RESET: "Data Biometric berhasil direset",
    ALREADY_EXISTS: "Data Biometric sudah ada untuk user ini",
  },

  LIPID_PANEL: {
    FOUND: "Data Lipid Panel berhasil ditemukan",
    NOT_FOUND: "Data Lipid Panel tidak ditemukan",
    CREATED: "Data Lipid Panel berhasil ditambahkan",
    DELETED: "Data Lipid Panel berhasil dihapus",
    ALREADY_EXISTS: "Data Lipid Panel sudah ada untuk user ini",
  },

  SUMMARY: {
    FOUND: "Data health summary berhasil diambil",
  },

  SCREENING: {
    CREATED: "Screening berhasil",
    IMAGE_REQUIRED: "Image wajib diupload",
  },

  TOKEN: {
    NOT_FOUND: "Token tidak ditemukan",
    INVALID: "Token tidak valid",
    REFRESH_NOT_FOUND: "Refresh token tidak ditemukan",
    REFRESH_INVALID: "Refresh token tidak valid",
  },

  HEALTH_GOAL: {
    CREATED: "Health goal berhasil dibuat",
    HISTORY_FOUND: "Riwayat health goal berhasil diambil",
    NOT_FOUND: "Data health goal tidak ditemukan",
    PROGRESS_FOUND: "Progress health goal berhasil diambil",
  },

  HEALTH_RECOMMENDATION: {
    OVERVIEW_FOUND: "Data overview berhasil diambil",
    FOUND: "Data saran kesehatan berhasil diambil",
    NOT_FOUND: "Data saran kesehatan tidak ditemukan",
  },

  DAILY_TRACKING: {
    CREATED: "Daily tracking berhasil ditambahkan",
    HISTORY_FOUND: "Riwayat daily tracking berhasil diambil",
    NOT_FOUND: "Data daily tracking tidak ditemukan",
    ALREADY_EXISTS: "Anda sudah mengisi daily tracking untuk hari ini",
  },
};
