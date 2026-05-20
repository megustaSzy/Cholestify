# ⚙️ Cholestify Backend API

Selamat datang di direktori Backend dari proyek **Cholestify**. Panduan ini akan membantu Anda menginstal, mengkonfigurasi, dan menjalankan server Node.js/Express.js secara lokal, lengkap dengan referensi seluruh endpoint yang tersedia.

---

## 🚀 Panduan Instalasi & Menjalankan API

Ikuti langkah-langkah di bawah ini untuk menjalankan server backend secara lokal.

### 1. Instalasi Dependensi
Pastikan Anda berada di dalam folder `api/`, lalu jalankan:
```bash
npm install
```

### 2. Konfigurasi Environment Variables (`.env`)
Buatlah sebuah file bernama `.env` di dalam folder `api/`. Salin isi dari `.env.example` ke dalam file `.env` tersebut dan sesuaikan nilainya (seperti URL database, kredensial Cloudinary, dan Secret Keys).

Berikut adalah isi dari `.env.example` yang perlu Anda konfigurasikan:

```env
NODE_ENV=development

# PORT
PORT=3001

# DATABASE
DATABASE_URL="postgresql://username:password@localhost:5432/cholestify?schema=public"

# JWT SECRETS
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# ADMIN CREDENTIALS
ADMIN_EMAIL=your_email
ADMIN_PASSWORD=your_password
ADMIN_NOTELP=your_notelp

# COOKIE SETTINGS
COOKIE_SECURE=false

# SMTP EMAIL NOTIFICATIONS
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email.com
SMTP_PASS=your_pass
SMTP_FROM=your_account

# FRONTEND CONNECTION
FRONTEND_URL=http://localhost:3000

# GOOGLE OAUTH
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=yout_client_secret
GOOGLE_REDIRECT=http://localhost:3001/api/auth/google/callback

# AI & EXTERNAL INTEGRATIONS
GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

FASTAPI_URL=
```

### 3. Setup Database (Prisma)
Setelah `DATABASE_URL` pada `.env` diatur dengan benar, jalankan perintah berikut untuk mensinkronisasi schema database dan mengisi data master makanan (*seeding*):

```bash
# Melakukan migrasi database (membuat tabel)
npx prisma migrate dev

# Menghasilkan Prisma Client
npx prisma generate

# Menjalankan seeder untuk memasukkan 150 data master makanan
node prisma/seed-foods.js
```

### 4. Menjalankan Server
Untuk mode *development* (otomatis me-restart server saat ada perubahan kode):
```bash
npm run dev
```
Server akan berjalan di: `http://localhost:3001`

---

## 📋 Daftar Endpoint API

Berikut adalah seluruh daftar rute API yang tersedia di backend Cholestify. 

> ⚠️ **Catatan Penting untuk Frontend:**
> Semua request API **wajib** menyertakan `credentials: 'include'` (jika memakai *fetch*) atau `withCredentials: true` (jika memakai *axios*) agar *HTTP-Only Cookie* (yang berisi Token) dapat terkirim secara otomatis. Anda tidak perlu lagi memasang header `Authorization` secara manual.

| Method  | Endpoint                                    | Auth | Deskripsi                                          |
| ------- | ------------------------------------------- | ---- | -------------------------------------------------- |
| `POST`  | `/api/auth/register`                        | ❌   | Registrasi user baru                               |
| `POST`  | `/api/auth/login`                           | ❌   | Login, cookie token di-set otomatis                |
| `POST`  | `/api/auth/refresh`                         | 🍪   | Refresh access token secara otomatis               |
| `POST`  | `/api/auth/logout`                          | 🍪   | Logout, menghapus cookie sesi                      |
| `POST`  | `/api/auth/forgot-password`                 | ❌   | Mengirim email berisi tautan reset password        |
| `POST`  | `/api/auth/reset-password`                  | ❌   | Melakukan reset password via token                 |
| `GET`   | `/api/auth/google`                          | ❌   | Login / Daftar via Google OAuth                    |
| `GET`   | `/api/users/:id`                            | 🍪   | Mengambil data profil user (pribadi)               |
| `PATCH` | `/api/users/:id`                            | 🍪   | Memperbarui profil user                            |
| `GET`   | `/api/health-summary`                       | 🍪   | **Dashboard** — Gabungan Biometric & Lipid Panel   |
| `POST`  | `/api/biometrics`                           | 🍪   | Mengisi tinggi & berat badan (BMI otomatis)        |
| `GET`   | `/api/biometrics/me`                        | 🍪   | Mengambil data Biometrik terakhir user             |
| `PATCH` | `/api/biometrics/`                          | 🍪   | Memperbarui data Biometrik user                    |
| `POST`  | `/api/lipid-panels`                         | 🍪   | Memasukkan data lab kolesterol baru                |
| `GET`   | `/api/lipid-panels/me`                      | 🍪   | Mengambil Riwayat data Lipid (Kolesterol)          |
| `PATCH` | `/api/lipid-panels/`                        | 🍪   | Memperbarui data Kolesterol terbaru                |
| `POST`  | `/api/calculates`                           | ❌   | Hitung target zona detak jantung (tanpa Auth)      |
| `POST`  | `/api/health-goals`                         | 🍪   | Mengatur target kesehatan & mendapat saran         |
| `GET`   | `/api/health-goals/me`                      | 🍪   | Mengambil riwayat target kesehatan pengguna        |
| `POST`  | `/api/daily-trackings`                      | 🍪   | Mencatat asupan kalori & aktivitas olahraga harian |
| `GET`   | `/api/daily-trackings/history`              | 🍪   | Menarik riwayat lengkap pencatatan kalori harian   |
| `GET`   | `/api/foods?page=&limit=&search=&status=`   | 🍪   | **Menu Diet** — Daftar makanan sesuai LDL terakhir |
| `POST`  | `/api/tests/upload`                         | ❌   | *Testing* — Mengunggah gambar ke Cloudinary        |

*(Simbol 🍪 menandakan bahwa endpoint membutuhkan sesi autentikasi yang divalidasi lewat HTTP-Only Cookie).*

---
Untuk melihat detail dari *Request Body*, *Response JSON*, dan parameter dari masing-masing endpoint di atas, silakan baca **[Panduan Detail Endpoint (FRONTEND.md)](./FRONTEND.md)**.
