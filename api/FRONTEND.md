# 📱 Cholestify — Dokumentasi API untuk Frontend

Base URL: `http://localhost:3001`

> ⚠️ Semua request **wajib** menyertakan `credentials: 'include'` (fetch) atau `withCredentials: true` (axios) agar cookie otomatis ikut terkirim.

---

## 📋 Daftar Endpoint

| Method  | Endpoint                    | Auth | Deskripsi                                          |
| ------- | --------------------------- | ---- | -------------------------------------------------- |
| `POST`  | `/api/auth/register`        | ❌   | Registrasi user baru                               |
| `POST`  | `/api/auth/login`           | ❌   | Login, cookie di-set otomatis                      |
| `POST`  | `/api/auth/refresh`         | 🍪   | Refresh access token                               |
| `POST`  | `/api/auth/logout`          | 🍪   | Logout, cookie dihapus                             |
| `POST`  | `/api/auth/forgot-password` | ❌   | Kirim email reset password                         |
| `POST`  | `/api/auth/reset-password`  | ❌   | Reset password via token query                     |
| `GET`   | `/api/auth/google`          | ❌   | Login via Google OAuth                             |
| `GET`   | `/api/users/:id`            | 🍪   | Ambil profil user                                  |
| `PATCH` | `/api/users/:id`            | 🍪   | Update profil user                                 |
| `GET`   | `/api/health-summary`       | 🍪   | **Dashboard** — Biometric + Lipid Panel (1 hit)    |
| `POST`  | `/api/biometrics`           | 🍪   | Input tinggi & berat badan (BMI dihitung otomatis) |
| `GET`   | `/api/biometrics/:id`       | 🍪   | Ambil Biometrics user                              |
| `PATCH` | `/api/biometrics/:id`       | 🍪   | Update biometric                                   |
| `POST`  | `/api/lipids`               | 🍪   | Input data kolesterol                              |
| `GET`   | `/api/lipids/:id`           | 🍪   | Ambil Lipids user                                  |
| `PATCH` | `/api/lipids/:id`           | 🍪   | Update data kolesterol                             |
| `POST`  | `/api/calculates`           | ❌   | Hitung zone detak jantung                          |

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
      "triglycerides": 120,
      "ldl": 90,
      "hdl": 55
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

### Get Biometric by User ID

**Endpoint:** `GET /api/biometrics/:id`

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
    "bmiCategory": "Normal",
    "createdAt": "2026-05-15T04:00:00.000Z",
    "updatedAt": "2026-05-15T04:00:00.000Z"
  }
}
```

---

### Update Biometric

**Endpoint:** `PATCH /api/biometrics/:id`

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

**Endpoint:** `POST /api/lipids`

**Request Body (JSON):**

| Field              | Type     | Required | Keterangan                     |
| ------------------ | -------- | -------- | ------------------------------ |
| `totalCholesterol` | `number` | ✅ Ya    | Total kolesterol (mg/dL)       |
| `triglycerides`    | `number` | ✅ Ya    | Trigliserida (mg/dL)           |
| `ldl`              | `number` | ✅ Ya    | LDL / bad cholesterol (mg/dL)  |
| `hdl`              | `number` | ✅ Ya    | HDL / good cholesterol (mg/dL) |

**Contoh Request:**

```json
{
  "totalCholesterol": 180,
  "triglycerides": 120,
  "ldl": 90,
  "hdl": 55
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

### Get Lipid Panel by User ID

**Endpoint:** `GET /api/lipids/:id`

**Response (200):**

```json
{
  "success": true,
  "message": "Data Lipid Panel berhasil ditemukan",
  "metadata": { "status": 200 },
  "data": {
    "id": 1,
    "totalCholesterol": 180,
    "triglycerides": 120,
    "ldl": 90,
    "hdl": 55,
    "createdAt": "2026-05-15T04:00:00.000Z",
    "updatedAt": "2026-05-15T04:00:00.000Z"
  }
}
```

---

### Update Lipid Panel

**Endpoint:** `PATCH /api/lipids/:id`

**Request Body (JSON):** _(semua field opsional)_

| Field              | Type     | Keterangan                     |
| ------------------ | -------- | ------------------------------ |
| `totalCholesterol` | `number` | Total kolesterol (mg/dL)       |
| `triglycerides`    | `number` | Trigliserida (mg/dL)           |
| `ldl`              | `number` | LDL / bad cholesterol (mg/dL)  |
| `hdl`              | `number` | HDL / good cholesterol (mg/dL) |

**Contoh Request:**

```json
{
  "totalCholesterol": 190
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
```

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
