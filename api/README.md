# 🩺 Cholestify API Documentation

Base URL: `http://localhost:PORT/api`

---

## 📋 Table of Contents

- [Authentication](#-authentication)
- [Users](#-users)
- [Biometric](#-biometric)
- [Lipid Panel](#-lipid-panel)
- [Heart Rate](#-heart-rate)

---

## 🔐 Authentication

Base path: `/api/auth`

> Semua endpoint di bawah **tidak** memerlukan token (kecuali disebutkan lain).

---

### `POST /api/auth/register`

Mendaftarkan pengguna baru.

**Request Body (JSON):**

| Field       | Type     | Required | Keterangan                                                            |
| ----------- | -------- | -------- | --------------------------------------------------------------------- |
| `nama`      | `string` | ✅ Ya    | Nama lengkap (min 3, max 50 karakter, hanya huruf & spasi)            |
| `email`     | `string` | ✅ Ya    | Format email valid                                                    |
| `password`  | `string` | ✅ Ya    | Min 8 karakter, harus ada huruf besar, huruf kecil, angka, dan simbol |
| `notelp`    | `string` | ✅ Ya    | Nomor telepon (10–13 digit angka)                                     |
| `dob`       | `date`   | ✅ Ya    | Tanggal lahir (format: `YYYY-MM-DD`)                                  |
| `bloodType` | `string` | ✅ Ya    | Golongan darah: `A`, `B`, `AB`, `O`                                   |

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

---

### `POST /api/auth/login`

Login dengan email/nomor telepon dan password.

**Request Body (JSON):**

| Field        | Type     | Required | Keterangan                        |
| ------------ | -------- | -------- | --------------------------------- |
| `identifier` | `string` | ✅ Ya    | Email atau nomor telepon pengguna |
| `password`   | `string` | ✅ Ya    | Password akun                     |

**Contoh Request:**

```json
{
  "identifier": "budi@example.com",
  "password": "Rahasia@123"
}
```

---

### `POST /api/auth/refresh`

Memperbarui access token menggunakan refresh token (dikirim via cookie).

**Request Body:** _Tidak diperlukan_

> Refresh token dibaca otomatis dari HTTP-only cookie.

---

### `POST /api/auth/logout`

Logout dan menghapus sesi pengguna.

**Request Body:** _Tidak diperlukan_

---

### `POST /api/auth/forgot-password`

Mengirim email tautan reset password.

> ⚠️ Endpoint ini dilindungi **rate limiter** untuk mencegah penyalahgunaan.

**Request Body (JSON):**

| Field   | Type     | Required | Keterangan      |
| ------- | -------- | -------- | --------------- |
| `email` | `string` | ✅ Ya    | Email terdaftar |

**Contoh Request:**

```json
{
  "email": "budi@example.com"
}
```

---

### `POST /api/auth/reset-password?token=<TOKEN>`

Reset password menggunakan token yang dikirim ke email.

**Query Parameter:**

| Parameter | Type     | Required | Keterangan                      |
| --------- | -------- | -------- | ------------------------------- |
| `token`   | `string` | ✅ Ya    | Token reset password dari email |

**Request Body (JSON):**

| Field             | Type     | Required | Keterangan                                                                            |
| ----------------- | -------- | -------- | ------------------------------------------------------------------------------------- |
| `password`        | `string` | ✅ Ya    | Password baru (min 8 karakter, harus ada huruf besar, huruf kecil, angka, dan simbol) |
| `confirmPassword` | `string` | ✅ Ya    | Harus sama dengan `password`                                                          |

**Contoh Request:**

```json
{
  "password": "NewRahasia@456",
  "confirmPassword": "NewRahasia@456"
}
```

---

### `GET /api/auth/google`

Redirect ke halaman login Google (OAuth 2.0). Meminta akses `profile` dan `email`.

**Request Body:** _Tidak diperlukan_

---

### `GET /api/auth/google/callback`

Callback URL dari Google setelah autentikasi berhasil.

**Request Body:** _Tidak diperlukan_

> Jika gagal, akan di-redirect ke `FRONTEND_URL/login?error=google_auth_failed`.

---

## 👤 Users

Base path: `/api/users`

> Semua endpoint memerlukan autentikasi via **HTTP-only Cookie** yang di-set otomatis saat login.

---

### `GET /api/users/:id`

Mengambil detail pengguna berdasarkan ID. 🔒 **Owner atau ADMIN**

> 🍪 Token dikirim otomatis melalui **HTTP-only Cookie**, tidak perlu set header manual.

**Path Parameter:**

| Parameter | Type     | Keterangan  |
| --------- | -------- | ----------- |
| `id`      | `string` | ID pengguna |

**Request Body:** _Tidak diperlukan_

---

### `PATCH /api/users/:id`

Memperbarui data pengguna berdasarkan ID. 🔒 **Owner atau ADMIN**

> 🍪 Token dikirim otomatis melalui **HTTP-only Cookie**, tidak perlu set header manual.

**Path Parameter:**

| Parameter | Type     | Keterangan  |
| --------- | -------- | ----------- |
| `id`      | `string` | ID pengguna |

**Request Body (JSON):** _(semua field opsional, kirim hanya yang ingin diperbarui)_

| Field       | Type     | Keterangan                          |
| ----------- | -------- | ----------------------------------- |
| `nama`      | `string` | Nama lengkap baru                   |
| `email`     | `string` | Email baru                          |
| `notelp`    | `string` | Nomor telepon baru                  |
| `dob`       | `date`   | Tanggal lahir baru                  |
| `bloodType` | `string` | Golongan darah: `A`, `B`, `AB`, `O` |

**Contoh Request:**

```json
{
  "nama": "Budi S. Updated",
  "notelp": "08987654321"
}
```

---

## 📊 Biometric

Base path: `/api/biometric`

> Semua endpoint memerlukan autentikasi via **HTTP-only Cookie** yang di-set otomatis saat login.

---

### `GET /api/biometric/:id`

Mengambil data biometric berdasarkan User ID. 🔒 **Owner atau ADMIN**

> 🍪 Token dikirim otomatis melalui **HTTP-only Cookie**, tidak perlu set header manual.

**Path Parameter:**

| Parameter | Type     | Keterangan  |
| --------- | -------- | ----------- |
| `id`      | `string` | ID pengguna |

**Request Body:** _Tidak diperlukan_

---

### `POST /api/biometric`

Membuat data biometric baru untuk pengguna yang sedang login. 🔒 **User terautentikasi**

> 🍪 Token dikirim otomatis melalui **HTTP-only Cookie**, tidak perlu set header manual.

**Request Body (JSON):**

| Field    | Type     | Required | Keterangan                                   |
| -------- | -------- | -------- | -------------------------------------------- |
| `weight` | `number` | ✅ Ya    | Berat badan dalam kg, boleh desimal (contoh: `70.5`)  |
| `height` | `number` | ✅ Ya    | Tinggi badan dalam cm, boleh desimal (contoh: `170.5`) |

> 📊 `bmi` dan `bmiCategory` dihitung otomatis oleh server dari `weight` dan `height`. Tidak perlu dikirim di body.

**Contoh Request:**

```json
{
  "weight": 60,
  "height": 167
}
```

**Contoh Response:**

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
    "bmiCategory": "Normal",
    "createdAt": "2026-05-15T04:00:00.000Z"
  }
}
```

---

### `PATCH /api/biometric/:id`

Memperbarui data biometric berdasarkan User ID. 🔒 **Owner atau ADMIN**

> 🍪 Token dikirim otomatis melalui **HTTP-only Cookie**, tidak perlu set header manual.

**Path Parameter:**

| Parameter | Type     | Keterangan  |
| --------- | -------- | ----------- |
| `id`      | `string` | ID pengguna |

**Request Body (JSON):** _(semua field opsional, kirim hanya yang ingin diperbarui)_

| Field    | Type     | Keterangan                                             |
| -------- | -------- | ------------------------------------------------------ |
| `weight` | `number` | Berat badan dalam kg, boleh desimal (contoh: `68.5`)   |
| `height` | `number` | Tinggi badan dalam cm, boleh desimal (contoh: `165.5`) |

> 📊 `bmi` dan `bmiCategory` akan di-recalculate otomatis jika `weight` atau `height` berubah.

**Contoh Request:**

```json
{
  "weight": 68
}
```

---

## ❤️ Heart Rate

Base path: `/api/heart-rate`

> Endpoint ini **tidak** memerlukan autentikasi (publik).

---

### `POST /api/heart-rate`

Menghitung zone detak jantung target berdasarkan data pengguna.

**Request Body (JSON):**

| Field              | Type     | Required | Keterangan                                                            |
| ------------------ | -------- | -------- | --------------------------------------------------------------------- |
| `dob`              | `date`   | ✅ Ya    | Tanggal lahir (format: `YYYY-MM-DD`, tidak boleh lebih dari hari ini) |
| `gender`           | `string` | ✅ Ya    | Jenis kelamin: `MALE` atau `FEMALE`                                   |
| `restingHeartRate` | `number` | ✅ Ya    | Detak jantung saat istirahat (bpm, min: 30, max: 220)                 |
| `activityLevel`    | `string` | ✅ Ya    | Level aktivitas: `INACTIVE`, `LIGHTLY_ACTIVE`, `ACTIVE`, `ATHLETE`    |

**Contoh Request:**

```json
{
  "dob": "1995-06-15",
  "gender": "MALE",
  "restingHeartRate": 72,
  "activityLevel": "LIGHTLY_ACTIVE"
}
```

---

## 🧪 Lipid Panel

Base path: `/api/lipid-panels`

> Semua endpoint memerlukan autentikasi via **HTTP-only Cookie** yang di-set otomatis saat login.

---

### `GET /api/lipid-panels/:id`

Mengambil data lipid panel berdasarkan User ID. 🔒 **Owner atau ADMIN**

> 🍪 Token dikirim otomatis melalui **HTTP-only Cookie**, tidak perlu set header manual.

**Path Parameter:**

| Parameter | Type     | Keterangan  |
|-----------|----------|-------------|
| `id`      | `string` | ID pengguna |

**Request Body:** _Tidak diperlukan_

---

### `POST /api/lipid-panels`

Membuat data lipid panel baru untuk pengguna yang sedang login. 🔒 **User terautentikasi**

> 🍪 Token dikirim otomatis melalui **HTTP-only Cookie**, tidak perlu set header manual.

**Request Body (JSON):**

| Field              | Type     | Required | Keterangan                                                      |
|--------------------|----------|----------|------------------------------------------------------------------|
| `totalCholesterol` | `number` | ✅ Ya    | Total kolesterol (mg/dL), target < 200 mg/dL                     |
| `triglycerides`    | `number` | ✅ Ya    | Trigliserida (mg/dL), target < 150 mg/dL                         |
| `ldl`              | `number` | ✅ Ya    | LDL / bad cholesterol (mg/dL), target < 100 mg/dL                |
| `hdl`              | `number` | ✅ Ya    | HDL / good cholesterol (mg/dL), target > 40 (pria) / > 50 (wanita) |

**Contoh Request:**

```json
{
  "totalCholesterol": 180,
  "triglycerides": 120,
  "ldl": 90,
  "hdl": 55
}
```

---

### `PATCH /api/lipid-panels/:id`

Memperbarui data lipid panel berdasarkan User ID. 🔒 **Owner atau ADMIN**

> 🍪 Token dikirim otomatis melalui **HTTP-only Cookie**, tidak perlu set header manual.

**Path Parameter:**

| Parameter | Type     | Keterangan  |
|-----------|----------|-------------|
| `id`      | `string` | ID pengguna |

**Request Body (JSON):** _(semua field opsional, kirim hanya yang ingin diperbarui)_

| Field              | Type     | Keterangan                       |
|--------------------|----------|-----------------------------------|
| `totalCholesterol` | `number` | Total kolesterol (mg/dL)          |
| `triglycerides`    | `number` | Trigliserida (mg/dL)              |
| `ldl`              | `number` | LDL / bad cholesterol (mg/dL)     |
| `hdl`              | `number` | HDL / good cholesterol (mg/dL)    |

**Contoh Request:**

```json
{
  "totalCholesterol": 195,
  "hdl": 60
}
```

---

## 🔑 Authorization Levels

| Level            | Keterangan                                                          |
| ---------------- | ------------------------------------------------------------------- |
| 🌐 Public        | Tidak perlu token                                                   |
| 🔒 Authenticated | Token dikirim otomatis via HTTP-only Cookie (user yang sudah login) |
| 👤 Owner/Admin   | Hanya pemilik resource atau user dengan role `ADMIN`                |

---

## 📦 Response Format

Semua response menggunakan format JSON standar berikut:

### ✅ Success (`200` / `201`)

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "metadata": {
    "status": 200
  },
  "data": { ... }
}
```

### ❌ Data Tidak Ditemukan (`404`)

```json
{
  "success": false,
  "message": "Data user tidak ditemukan",
  "metadata": {
    "status": 404
  }
}
```

### ❌ ID / Parameter Tidak Valid (`400`)

```json
{
  "success": false,
  "message": "Parameter tidak valid",
  "metadata": {
    "status": 400
  }
}
```

### ❌ Token Tidak Ditemukan / Tidak Terautentikasi (`401`)

```json
{
  "success": false,
  "message": "Token tidak ditemukan",
  "metadata": {
    "status": 401
  }
}
```

---

## 🍪 Autentikasi via HTTP-only Cookie

API ini menggunakan **HTTP-only Cookie** untuk menyimpan dan mengirim token autentikasi secara otomatis. Frontend **tidak perlu** menyertakan header `Authorization` secara manual.

- Cookie di-set otomatis oleh server saat login berhasil (`POST /api/auth/login`)
- Cookie dikirim otomatis oleh browser pada setiap request berikutnya
- Untuk refresh token, cukup hit `POST /api/auth/refresh` — cookie lama dibaca otomatis
- Saat logout (`POST /api/auth/logout`), cookie akan dihapus oleh server

> ⚠️ Pastikan request dikirim dengan opsi `credentials: 'include'` (fetch) atau `withCredentials: true` (axios) agar cookie ikut terkirim.

