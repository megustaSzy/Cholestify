# 📱 Cholestify — Dokumentasi API untuk Frontend

Base URL: `http://localhost:3001`

> ⚠️ Semua request **wajib** menyertakan `credentials: 'include'` (fetch) atau `withCredentials: true` (axios) agar cookie otomatis ikut terkirim.

---

## 📋 Daftar Endpoint

| Method  | Endpoint                                  | Auth | Deskripsi                                           |
| ------- | ----------------------------------------- | ---- | --------------------------------------------------- |
| `POST`  | `/api/auth/register`                      | ❌   | Registrasi user baru                                |
| `POST`  | `/api/auth/login`                         | ❌   | Login, cookie di-set otomatis                       |
| `POST`  | `/api/auth/refresh`                       | 🍪   | Refresh access token                                |
| `POST`  | `/api/auth/logout`                        | 🍪   | Logout, cookie dihapus                              |
| `POST`  | `/api/auth/forgot-password`               | ❌   | Kirim email reset password                          |
| `POST`  | `/api/auth/reset-password`                | ❌   | Reset password via token query                      |
| `GET`   | `/api/auth/google`                        | ❌   | Login via Google OAuth                              |
| `GET`   | `/api/users/:id`                          | 🍪   | Ambil profil user                                   |
| `PATCH` | `/api/users/:id`                          | 🍪   | Update profil user                                  |
| `GET`   | `/api/health-summary`                     | 🍪   | **Dashboard** — Biometric + Latest Lipid Panel      |
| `POST`  | `/api/biometrics`                         | 🍪   | Input tinggi & berat badan (BMI dihitung otomatis)  |
| `GET`   | `/api/biometrics/me`                      | 🍪   | Ambil Biometrics user (pribadi)                     |
| `PATCH` | `/api/biometrics/`                        | 🍪   | Update biometric user (pribadi)                     |
| `POST`  | `/api/lipid-panels`                       | 🍪   | Input data kolesterol baru                          |
| `GET`   | `/api/lipid-panels/me`                    | 🍪   | Ambil Riwayat Lipids user (pribadi)                 |
| `GET`   | `/api/lipid-panels/me/export/pdf`         | 🍪   | Download PDF riwayat lipid panel (blob)             |
| `POST`  | `/api/calculates`                         | ❌   | Hitung zone detak jantung                           |
| `POST`  | `/api/health-goals`                       | 🍪   | Input target kesehatan dan dapatkan saran           |
| `GET`   | `/api/health-goals/me`                    | 🍪   | Ambil riwayat target kesehatan                      |
| `GET`   | `/api/health-recommendations/overview`    | 🍪   | **Widget Overview** — Lipid Panel & Saran Terbaru   |
| `GET`   | `/api/health-recommendations/me`          | 🍪   | Ambil riwayat saran kesehatan saja                  |
| `POST`  | `/api/daily-trackings`                    | 🍪   | Catat aktivitas & kalori harian                     |
| `GET`   | `/api/daily-trackings/history`            | 🍪   | Ambil riwayat pencatatan harian                     |
| `GET`   | `/api/foods/public`                       | ❌   | **Public Foods** — Daftar kalori makanan tanpa auth |
| `GET`   | `/api/foods?page=&limit=&search=&status=` | 🍪   | **Rekomendasi Makanan** — Menu diet sesuai LDL      |
| `POST`  | `/api/screenings`                         | 🍪   | **AI Eye Scan** — Analisis gambar retina mata       |
| `GET`   | `/api/screenings/me`                      | 🍪   | Ambil riwayat hasil scan mata (pribadi)             |
| `GET`   | `/api/screenings/me/export/pdf`           | 🍪   | Download PDF hasil scan mata (blob)                 |
| `POST`  | `/api/tests/upload`                       | ❌   | _Testing_ — Upload gambar ke Cloudinary             |

> 🍪 = Token dikirim otomatis via HTTP-only Cookie, **tidak perlu set header manual**.

---

## 🔐 Auth

### Register

**Endpoint:** `POST /api/auth/register`

**Request Body (JSON):**

| Field       | Type     | Required | Keterangan                                             |
| ----------- | -------- | -------- | ------------------------------------------------------ |
| `nama`      | `string` | ✅ Ya    | Nama lengkap user                                      |
| `email`     | `string` | ✅ Ya    | Email aktif                                            |
| `password`  | `string` | ✅ Ya    | Minimal 8 karakter (huruf besar, kecil, angka, simbol) |
| `notelp`    | `string` | ✅ Ya    | Nomor telepon (10-13 digit)                            |
| `dob`       | `string` | ❌ Tidak | Tanggal lahir (format: `YYYY-MM-DD`)                   |
| `bloodType` | `string` | ❌ Tidak | Golongan darah: `A`, `B`, `AB`, `O`                    |

**Contoh Request:**

```json
{
  "nama": "Budi Santoso",
  "email": "budi@example.com",
  "password": "Rahasia@123",
  "notelp": "08123456789",
  "dob": "1995-06-15",
  "bloodType": "O"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "metadata": { "status": 201 },
  "data": { "id": 1, "nama": "Budi Santoso", ... }
}
```

---

### Login

**Endpoint:** `POST /api/auth/login`

**Request Body (JSON):**

| Field        | Type     | Required | Keterangan               |
| ------------ | -------- | -------- | ------------------------ |
| `identifier` | `string` | ✅ Ya    | Email atau nomor telepon |
| `password`   | `string` | ✅ Ya    | Password user            |

**Contoh Request:**

```json
{
  "identifier": "budi@example.com",
  "password": "Rahasia@123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login berhasil",
  "metadata": { "status": 200 }
}
```

---

## 📊 Dashboard — Health Summary

**Endpoint:** `GET /api/health-summary`

**Response (200):**

```json
{
  "success": true,
  "message": "Data health summary berhasil diambil",
  "metadata": { "status": 200 },
  "data": {
    "biometrics": {
      "height": 167,
      "weight": 60,
      "bmi": 23.4,
      "bmiCategory": "Normal"
    },
    "lipidPanel": {
      "totalCholesterol": 180,
      "ldl": 90,
      "hdl": 55,
      "triglycerides": 140,
      "date": "2024-05-16T10:00:00.000Z"
    },
    "recommendation": {
      "dietaryAdvice": "Profil lipid Anda berada di rentang optimal. Pertahankan pola makan gizi seimbang yang Anda jalankan saat ini untuk menjaga kesehatan jantung jangka panjang.",
      "activityAdvice": "Pertahankan rutinitas aktivitas fisik Anda saat ini untuk menjaga tingkat kolesterol dan metabolisme tubuh tetap sehat dan stabil.",
      "generatedAt": "2024-05-16T10:00:00.000Z"
    }
  }
}
```

---

## 🏋️ Biometric

### Create Biometric

**Endpoint:** `POST /api/biometrics`

**Request Body (JSON):**

| Field    | Type     | Required | Keterangan                       |
| -------- | -------- | -------- | -------------------------------- |
| `height` | `number` | ✅ Ya    | Tinggi badan (cm), boleh desimal |
| `weight` | `number` | ✅ Ya    | Berat badan (kg), boleh desimal  |

**Contoh Request:**

```json
{
  "height": 167,
  "weight": 60
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Data Biometric berhasil ditambahkan",
  "metadata": { "status": 201 },
  "data": {
    "id": 1,
    "height": 167,
    "weight": 60,
    "bmi": 21.5,
    "bmiCategory": "Normal"
  }
}
```

### Get My Biometric

**Endpoint:** `GET /api/biometrics/me`

**Response (200):**

```json
{
  "success": true,
  "message": "Data Biometric berhasil ditemukan",
  "metadata": { "status": 200 },
  "data": {
    "id": 1,
    "height": 167,
    "weight": 60,
    "bmi": 21.5,
    "bmiCategory": "Normal"
  }
}
```

---

### Update My Biometric

**Endpoint:** `PATCH /api/biometrics/`

**Request Body (JSON):** _(semua field opsional)_

| Field    | Type     | Keterangan        |
| -------- | -------- | ----------------- |
| `height` | `number` | Tinggi badan (cm) |
| `weight` | `number` | Berat badan (kg)  |

**Contoh Request:**

```json
{
  "weight": 68
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Data berhasil diperbarui",
  "metadata": { "status": 200 },
  "data": { ... }
}
```

---

## 🧪 Lipid Panel

### Create Lipid Panel

**Endpoint:** `POST /api/lipid-panels`

**Request Body (JSON):**

| Field              | Type     | Required | Keterangan                          |
| ------------------ | -------- | -------- | ----------------------------------- |
| `totalCholesterol` | `number` | ✅ Ya    | Total kolesterol (mg/dL)            |
| `ldl`              | `number` | ✅ Ya    | LDL / bad cholesterol (mg/dL)       |
| `hdl`              | `number` | ✅ Ya    | HDL / good cholesterol (mg/dL)      |
| `triglycerides`    | `number` | ✅ Ya    | Trigliserida (mg/dL)                |
| `date`             | `string` | ❌ Tidak | Tanggal pengecekan (default: `now`) |

**Contoh Request:**

```json
{
  "totalCholesterol": 180,
  "ldl": 90,
  "hdl": 55,
  "triglycerides": 140,
  "date": "2024-05-16"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Data Lipid Panel berhasil ditambahkan",
  "metadata": { "status": 201 },
  "data": { ... }
}
```

---

### Get My Lipid Panel History

**Endpoint:** `GET /api/lipid-panels/me`

**Response (200):**

```json
{
  "success": true,
  "message": "Data Lipid Panel berhasil ditemukan",
  "metadata": { "status": 200 },
  "data": [
    {
      "id": 2,
      "date": "2024-05-16T00:00:00.000Z",
      "totalCholesterol": 180,
      "ldl": 90,
      "hdl": 55,
      "createdAt": "...",
      "updatedAt": "..."
    },
    {
      "id": 1,
      "date": "2024-05-01T00:00:00.000Z",
      "totalCholesterol": 210,
      "ldl": 110,
      "hdl": 45,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### Download My Lipid Panel History PDF

**Endpoint:** `GET /api/lipid-panels/me/export/pdf`

**Deskripsi:** Mengunduh seluruh riwayat pemeriksaan Lipid Panel milik user dalam bentuk file **PDF** yang diformat khusus.

> ⚠️ **PENTING UNTUK FRONTEND**: Karena _response_ dari API ini berupa _Binary File_ (bukan JSON), pastikan kamu menggunakan parameter `responseType: "blob"` saat me-_request_ dengan Axios, lalu mengonversinya menjadi URL unduhan menggunakan `URL.createObjectURL`.

**Contoh Implementasi Axios di React:**

```javascript
const handleDownloadPDF = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/lipid-panels/me/export/pdf",
      {
        withCredentials: true,
        responseType: "blob", // WAJIB ADA
      },
    );

    // Konversi blob ke URL dan trigger fungsi download browser
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Riwayat_Lipid.pdf");
    document.body.appendChild(link);
    link.click();

    // Bersihkan memori URL
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Gagal download laporan", error);
  }
};
```

---

````

---

## ❤️ Kalkulator Detak Jantung

**Endpoint:** `POST /api/calculates`

**Request Body (JSON):**

| Field              | Type     | Required | Keterangan                                        |
| ------------------ | -------- | -------- | ------------------------------------------------- |
| `dob`              | `string` | ✅ Ya    | Tanggal lahir (`YYYY-MM-DD`)                      |
| `gender`           | `string` | ✅ Ya    | `MALE` atau `FEMALE`                              |
| `restingHeartRate` | `number` | ✅ Ya    | Detak jantung istirahat (bpm, 30-220)             |
| `activityLevel`    | `string` | ✅ Ya    | `INACTIVE`, `LIGHTLY_ACTIVE`, `ACTIVE`, `ATHLETE` |

**Contoh Request:**

```json
{
  "dob": "1995-06-15",
  "gender": "MALE",
  "restingHeartRate": 72,
  "activityLevel": "LIGHTLY_ACTIVE"
}
````

**Response (200):**

```json
{
  "success": true,
  "message": "Data detak jantung berhasil dihitung",
  "metadata": { "status": 200 },
  "data": { ... }
}
```

---

## 🎯 Health Goals (Saran Kesehatan)

### Create Target & Dapatkan Saran

**Endpoint:** `POST /api/health-goals`

**Request Body (JSON):**

| Field                  | Type     | Required | Keterangan                                |
| ---------------------- | -------- | -------- | ----------------------------------------- |
| `targetLdlHdlRatio`    | `number` | ✅ Ya    | Target rasio LDL/HDL (misal: 2.5)         |
| `targetWeeklyCalories` | `number` | ✅ Ya    | Target kalori per minggu (misal: 14000)   |
| `targetExerciseMins`   | `number` | ✅ Ya    | Target olahraga menit/minggu (misal: 150) |

**Contoh Request:**

```json
{
  "targetLdlHdlRatio": 2.5,
  "targetWeeklyCalories": 14000,
  "targetExerciseMins": 150
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Health goal dan saran kesehatan berhasil dibuat",
  "metadata": { "status": 201 },
  "data": {
    "id": 1,
    "userId": 1,
    "targetLdlHdlRatio": 2.5,
    "targetWeeklyCalories": 14000,
    "targetExerciseMins": 150,
    "createdAt": "2026-05-16T10:00:00.000Z"
  }
}
```

---

### Get My Health Goals History

**Endpoint:** `GET /api/health-goals/me`

**Response (200):**

```json
{
  "success": true,
  "message": "Riwayat health goal berhasil diambil",
  "metadata": { "status": 200 },
  "data": [
    {
      "id": 2,
      "targetLdlHdlRatio": 2.5,
      "targetWeeklyCalories": 14000,
      "targetExerciseMins": 150,
      "createdAt": "2026-05-16T10:00:00.000Z"
    }
  ]
}
```

---

## 👤 Profil User

### Update Profil

**Endpoint:** `PATCH /api/users/:id`

**Request Body (JSON):** _(semua field opsional)_

| Field       | Type     | Keterangan                          |
| ----------- | -------- | ----------------------------------- |
| `nama`      | `string` | Nama lengkap                        |
| `email`     | `string` | Email baru                          |
| `notelp`    | `string` | Nomor telepon baru                  |
| `dob`       | `string` | Tanggal lahir (`YYYY-MM-DD`)        |
| `bloodType` | `string` | Golongan darah: `A`, `B`, `AB`, `O` |

**Contoh Request:**

```json
{
  "nama": "Budi Updated",
  "notelp": "08987654321"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Data berhasil diperbarui",
  "metadata": { "status": 200 },
  "data": { ... }
}
```

---

## 💡 Health Recommendation (Otomatis)

### Get Overview Widget

**Endpoint:** `GET /api/health-recommendations/overview`

**Deskripsi:** Mengambil data saran kesehatan terbaru beserta hasil lab kolesterol referensinya yang ter-generate secara otomatis setiap kali input Lipid Panel. Cocok untuk ditampilkan di UI Overview.

**Response (200):**

```json
{
  "success": true,
  "message": "Data overview berhasil diambil",
  "metadata": { "status": 200 },
  "data": {
    "lipidPanel": {
      "totalCholesterol": 210,
      "ldl": 145,
      "hdl": 45,
      "date": "2023-10-24T00:00:00.000Z"
    },
    "recommendation": {
      "dietaryAdvice": "Batasi asupan makanan berlemak tinggi, gorengan, dan bersantan. Mulailah mengganti camilan manis dengan buah segar...",
      "activityAdvice": "Yuk, tingkatkan aktivitas fisik Anda! Mulailah dengan menambahkan 20 hingga 30 menit olahraga ringan...",
      "generatedAt": "2023-10-24T10:00:00.000Z"
    }
  }
}
```

---

### Get My Recommendations History

**Endpoint:** `GET /api/health-recommendations/me`

**Deskripsi:** Mengambil semua riwayat saran kesehatan milik user yang digenerate oleh sistem, murni hanya rekomendasi tanpa dicampur dengan riwayat angka Lipid Panel-nya.

**Response (200):**

```json
{
  "success": true,
  "message": "Data saran kesehatan berhasil diambil",
  "metadata": { "status": 200 },
  "data": [
    {
      "id": 2,
      "dietaryAdvice": "Batasi asupan makanan berlemak tinggi, gorengan, dan bersantan...",
      "activityAdvice": "Yuk, tingkatkan aktivitas fisik Anda! Mulailah dengan menambahkan 20 hingga 30 menit...",
      "generatedAt": "2023-10-24T10:00:00.000Z"
    }
  ]
}
```

---

## 📅 Daily Tracking API

Berisi endpoint untuk mencatat dan mengambil riwayat aktivitas harian pengguna.

### Create Daily Tracking

**Endpoint:** `POST /api/daily-trackings`

**Deskripsi:** Menyimpan data kalori, protein, durasi olahraga, dan catatan makanan untuk hari ini.

**Body Request:**

```json
{
  "calories": 2000,
  "protein": 60,
  "exerciseMins": 45,
  "foodNotes": "Ayam bakar dan sayur"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Daily tracking berhasil ditambahkan",
  "metadata": { "status": 201 },
  "data": {
    "id": 1,
    "date": "2026-05-18T09:59:09.853Z",
    "calories": 2000,
    "protein": 60,
    "exerciseMins": 45,
    "foodNotes": "Ayam bakar dan sayur",
    "createdAt": "2026-05-18T09:59:09.854Z"
  }
}
```

---

### Get My Daily Tracking History

**Endpoint:** `GET /api/daily-trackings/history`

**Deskripsi:** Mengambil semua riwayat pencatatan harian milik user yang sedang login beserta target goals pada saat itu.

**Response (200):**

```json
{
  "success": true,
  "message": "Riwayat daily tracking berhasil diambil",
  "metadata": { "status": 200 },
  "data": [
    {
      "id": 1,
      "date": "2026-05-18T09:59:09.853Z",
      "calories": 2000,
      "protein": 60,
      "exerciseMins": 45,
      "foodNotes": "Ayam bakar dan sayur",
      "healthGoal": {
        "targetWeeklyCalories": 15000,
        "targetExerciseMins": 150
      }
    }
  ]
}
```

---

## 🥗 Food Recommendation API

## 🍎 Food Recommendations

### Get Public Food List (No Auth)

**Endpoint:** `GET /api/foods/public`

**Query Parameters (Opsional):**

- `page` (number): Halaman (default: 1)
- `limit` (number): Jumlah data (default: 10)
- `search` (string): Mencari makanan berdasarkan nama (contoh: "ayam")

**Contoh Request:** `GET /api/foods/public?page=1&limit=10&search=ayam`

**Deskripsi:** Mengambil daftar makanan publik (ID, nama, kalori, protein, lemak) tanpa rekomendasi status. Endpoint ini terbuka bebas tanpa token.

**Response (200):**

```json
{
  "success": true,
  "message": "Data makanan publik berhasil diambil",
  "metadata": {
    "page": 1,
    "limit": 10,
    "totalItems": 150,
    "totalPages": 15,
    "prev": null,
    "next": "?page=2&limit=10"
  },
  "data": [
    {
      "id": 1,
      "name": "Ampas Tahu",
      "calories": 414,
      "proteins": 26.6,
      "fat": 18.3
    }
  ]
}
```

---

### Get Food Recommendation List (Paginated & Filtered)

**Endpoint:** `GET /api/foods`

**Query Parameters (Opsional):**

- `page` (number): Halaman yang ingin diambil (default: 1)
- `limit` (number): Jumlah data per halaman (default: 10)
- `search` (string): Mencari makanan berdasarkan nama (contoh: "ayam")
- `status` (string): Filter berdasarkan status makanan (`OPTIMAL`, `NEUTRAL`, `LIMIT`)

**Contoh Request:** `GET /api/foods?page=1&limit=10&search=ayam&status=OPTIMAL`

**Deskripsi:** Mengambil daftar makanan master beserta klasifikasinya (`OPTIMAL`, `NEUTRAL`, `LIMIT`) yang ditentukan secara dinamis berdasarkan nilai LDL terakhir pengguna.

**Skenario Pengujian Frontend (Best Practices):**

- **Awal Buka:** `GET /api/foods?page=1&limit=10`
- **Pencarian Kata:** `GET /api/foods?page=1&limit=10&search=susu` _(setiap user mengetik pencarian baru, paksa reset ke `page=1`)_.
- **Pindah Halaman:** Gunakan nilai `next` di JSON `metadata`. URL `next` otomatis mengingat query pencarianmu (contoh: `?page=2&limit=10&search=susu`). Jika `next` bernilai `null`, data sudah habis.
- **Filter Tab Kategori:** `GET /api/foods?page=1&limit=10&status=OPTIMAL` _(setiap pindah tab, paksa reset ke `page=1`)_.
- **Kombinasi Pencarian & Tab:** `GET /api/foods?page=1&limit=10&search=daging&status=LIMIT`

**Response (200):**

```json
{
  "success": true,
  "message": "Data daftar makanan berhasil diambil",
  "metadata": {
    "status": 200,
    "ldlGroup": "NORMAL",
    "page": 1,
    "limit": 10,
    "totalItems": 150,
    "totalPages": 15,
    "prev": null,
    "next": "?page=2&limit=10"
  },
  "data": [
    {
      "id": 1,
      "name": "Ampas Tahu",
      "calories": 414,
      "proteins": 26.6,
      "fat": 18.3,
      "status": "LIMIT",
      "isRecommended": false
    },
    {
      "id": 2,
      "name": "Oats (Steel-cut)",
      "calories": 150,
      "proteins": 4,
      "fat": 0.3,
      "status": "OPTIMAL",
      "isRecommended": true
    }
  ]
}
```

---

## 👁️ AI Eye Scan (Screening)

### Upload & Analyze Eye Image

**Endpoint:** `POST /api/screenings`

**Headers:** `Content-Type: multipart/form-data`

**Request Body (FormData):**
| Field | Type | Required | Keterangan |
| ---------- | ------ | -------- | -------------------------------------------------------------------------- |
| `image` | `file` | ✅ Ya | Gambar mata (JPG/PNG). Maksimal 10MB. |
| `socketId` | `string`| ❌ Tidak | ID dari koneksi `Socket.io` untuk menerima _real-time progress tracking_. |

**Contoh Response (201 Created):**

```json
{
  "success": true,
  "message": "Screening berhasil",
  "metadata": { "status": 201 },
  "data": {
    "id": 1,
    "userId": 6,
    "imageUrl": "https://res.cloudinary.com/.../image.jpg",
    "result": "INDIKASI_KUAT",
    "confidence": 88.79,
    "description": "Endapan lipid signifikan terdeteksi.",
    "recommendation": "Konsultasi dokter segera, lakukan cek lipid panel.",
    "probabilities": {
      "normal": 9.05,
      "beresiko": 2.16,
      "kolesterol": 88.79
    },
    "createdAt": "2026-05-22T17:20:10.278Z"
  }
}
```

**Contoh Response Gagal / OOD (400 Bad Request):**
_(Jika gambar bukan mata atau buram)_

```json
{
  "success": false,
  "message": "Tidak terdeteksi struktur mata (iris/pupil). Pastikan foto menampilkan mata dengan jelas...",
  "recommendation": "Ambil ulang foto sesuai panduan."
}
```

---

### 🔌 Panduan Pemasangan Socket.io di Frontend (React)

Untuk menampilkan _loading progress bar_ secara _real-time_ saat gambar mata sedang diunggah dan diproses oleh AI (Backend -> FastAPI Hugging Face -> Backend -> Frontend), kamu perlu memasang Socket.io Client.

**1. Install library di React:**

```bash
npm install socket.io-client
```

**2. Contoh Kode Komponen React:**

```javascript
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

// Ganti URL dengan Base URL backend-mu
const socket = io("http://localhost:3001", {
  withCredentials: true,
});

const EyeScanForm = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Menangkap event "scan_progress" dari server Node.js
    socket.on("scan_progress", (data) => {
      setProgress(data.progress); // Angka persentase 0-100
      setLoadingText(data.message); // Teks status (Upload, Sedang Menganalisis, dll)
    });

    // Cleanup saat komponen ditutup
    return () => {
      socket.off("scan_progress");
    };
  }, []);

  const handleScan = async () => {
    if (!file) return alert("Pilih gambar terlebih dahulu!");

    setIsScanning(true);
    setProgress(0);
    setLoadingText("Memulai...");

    const formData = new FormData();
    formData.append("image", file); // ⚠️ Pastikan namanya "image"

    // 💡 SANGAT PENTING: Masukkan ID koneksi soket agar server tahu ke user mana ia harus mengirim progress
    formData.append("socketId", socket.id);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/screenings",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }, // ⚠️ Jangan lupa header multipart
        },
      );

      console.log("Hasil AI:", response.data);
      alert("Selesai! Hasil: " + response.data.data.result);

      // Jika berhasil, progress paksa ke 100% dan ganti teks
      setProgress(100);
      setLoadingText("Selesai!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal melakukan scan");
      setLoadingText("Gagal.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
      />
      <button onClick={handleScan} disabled={isScanning}>
        {isScanning ? "Memproses AI..." : "Mulai Scan Mata"}
      </button>

      {/* Tampilan Progress Bar Sederhana */}
      {isScanning && (
        <div style={{ marginTop: 20 }}>
          <p>Status: {loadingText}</p>
          <progress value={progress} max="100" style={{ width: "100%" }} />
          <span>{progress}%</span>
        </div>
      )}
    </div>
  );
};

export default EyeScanForm;
```

---

### Get My Screening History

**Endpoint:** `GET /api/screenings/me`

**Response (200):**

```json
{
  "success": true,
  "message": "Data Screening berhasil ditemukan",
  "metadata": { "status": 200 },
  "data": [
    {
      "id": 1,
      "imageUrl": "https://res.cloudinary.com/.../image.jpg",
      "result": "INDIKASI_KUAT",
      "confidence": 88.79,
      "description": "Endapan lipid signifikan terdeteksi.",
      "recommendation": "Konsultasi dokter segera, lakukan cek lipid panel.",
      "probabilities": {
        "normal": 9.05,
        "beresiko": 2.16,
        "kolesterol": 88.79
      },
      "createdAt": "2026-05-22T17:20:10.278Z"
    }
  ]
```

---

### Download My Screening History PDF

**Endpoint:** `GET /api/screenings/me/export/pdf`

**Deskripsi:** Mengunduh seluruh riwayat deteksi mata AI milik user dalam bentuk file **PDF**.

Sama seperti riwayat Lipid Panel, _endpoint_ ini juga me-return _Binary File_ (PDF). Jangan lupa gunakan kode implementasi pengunduhan _blob_ yang sama seperti pada dokumentasi PDF Lipid Panel (gunakan `responseType: "blob"`).

---

## ❌ Error Response

### 400 — Bad Request

```json
{
  "success": false,
  "message": "Parameter tidak valid",
  "metadata": { "status": 400 }
}
```

### 401 — Unauthorized

```json
{
  "success": false,
  "message": "Token tidak ditemukan",
  "metadata": { "status": 401 }
}
```

### 404 — Not Found

```json
{
  "success": false,
  "message": "Data tidak ditemukan",
  "metadata": { "status": 404 }
}
```

### 409 — Conflict

```json
{
  "success": false,
  "message": "Data sudah ada untuk user ini",
  "metadata": { "status": 409 }
}
```
