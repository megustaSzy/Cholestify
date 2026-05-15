# 🩺 Cholestify API Documentation

Base URL: `http://localhost:PORT/api`

---

## 📋 Table of Contents

- [Authentication](#-authentication)
- [Users](#-users)
- [Biometric](#-biometric)
- [Heart Rate](#-heart-rate)

---

## 🔐 Authentication

Base path: `/api/auth`

> Semua endpoint di bawah **tidak** memerlukan token (kecuali disebutkan lain).

---

### `POST /api/auth/register`

Mendaftarkan pengguna baru.

**Request Body (JSON):**

| Field       | Type     | Required | Keterangan                                              |
|-------------|----------|----------|---------------------------------------------------------|
| `nama`      | `string` | ✅ Ya    | Nama lengkap (min 3, max 50 karakter, hanya huruf & spasi) |
| `email`     | `string` | ✅ Ya    | Format email valid                                      |
| `password`  | `string` | ✅ Ya    | Min 8 karakter, harus ada huruf besar, huruf kecil, angka, dan simbol |
| `notelp`    | `string` | ✅ Ya    | Nomor telepon (10–13 digit angka)                       |
| `dob`       | `date`   | ❌ Opsional | Tanggal lahir (format: `YYYY-MM-DD`)                 |
| `bloodType` | `string` | ❌ Opsional | Golongan darah: `A`, `B`, `AB`, `O`                  |

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

| Field        | Type     | Required | Keterangan                              |
|--------------|----------|----------|-----------------------------------------|
| `identifier` | `string` | ✅ Ya    | Email atau nomor telepon pengguna       |
| `password`   | `string` | ✅ Ya    | Password akun                           |

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

| Field   | Type     | Required | Keterangan        |
|---------|----------|----------|-------------------|
| `email` | `string` | ✅ Ya    | Email terdaftar   |

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

| Parameter | Type     | Required | Keterangan                            |
|-----------|----------|----------|---------------------------------------|
| `token`   | `string` | ✅ Ya    | Token reset password dari email       |

**Request Body (JSON):**

| Field             | Type     | Required | Keterangan                                   |
|-------------------|----------|----------|----------------------------------------------|
| `password`        | `string` | ✅ Ya    | Password baru (min 8 karakter, harus ada huruf besar, huruf kecil, angka, dan simbol) |
| `confirmPassword` | `string` | ✅ Ya    | Harus sama dengan `password`                 |

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

> Semua endpoint memerlukan **Bearer Token** (`Authorization: Bearer <access_token>`).

---

### `POST /api/users`

Membuat pengguna baru. 🔒 **ADMIN only**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body (JSON):** _(mengikuti skema yang sama dengan register)_

| Field       | Type     | Required | Keterangan                                              |
|-------------|----------|----------|---------------------------------------------------------|
| `nama`      | `string` | ✅ Ya    | Nama lengkap pengguna                                   |
| `email`     | `string` | ✅ Ya    | Format email valid                                      |
| `password`  | `string` | ✅ Ya    | Password akun                                           |
| `notelp`    | `string` | ✅ Ya    | Nomor telepon (10–13 digit)                             |
| `dob`       | `date`   | ❌ Opsional | Tanggal lahir                                         |
| `bloodType` | `string` | ❌ Opsional | Golongan darah: `A`, `B`, `AB`, `O`                  |

---

### `GET /api/users`

Mengambil daftar semua pengguna. 🔒 **ADMIN only**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:** _Tidak diperlukan_

---

### `GET /api/users/:id`

Mengambil detail pengguna berdasarkan ID. 🔒 **Owner atau ADMIN**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Path Parameter:**

| Parameter | Type     | Keterangan        |
|-----------|----------|-------------------|
| `id`      | `string` | ID pengguna       |

**Request Body:** _Tidak diperlukan_

---

### `PATCH /api/users/:id`

Memperbarui data pengguna berdasarkan ID. 🔒 **Owner atau ADMIN**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Path Parameter:**

| Parameter | Type     | Keterangan        |
|-----------|----------|-------------------|
| `id`      | `string` | ID pengguna       |

**Request Body (JSON):** _(semua field opsional, kirim hanya yang ingin diperbarui)_

| Field       | Type     | Keterangan                          |
|-------------|----------|-------------------------------------|
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

### `DELETE /api/users/:id`

Menghapus pengguna berdasarkan ID. 🔒 **ADMIN only**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Path Parameter:**

| Parameter | Type     | Keterangan        |
|-----------|----------|-------------------|
| `id`      | `string` | ID pengguna       |

**Request Body:** _Tidak diperlukan_

---

## 📊 Biometric

Base path: `/api/biometric`

> Semua endpoint memerlukan **Bearer Token** (`Authorization: Bearer <access_token>`).

---

### `GET /api/biometric`

Mengambil seluruh data biometric semua pengguna. 🔒 **ADMIN only**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:** _Tidak diperlukan_

---

### `GET /api/biometric/:id`

Mengambil data biometric berdasarkan User ID. 🔒 **Owner atau ADMIN**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Path Parameter:**

| Parameter | Type     | Keterangan  |
|-----------|----------|-------------|
| `id`      | `string` | ID pengguna |

**Request Body:** _Tidak diperlukan_

---

### `POST /api/biometric`

Membuat data biometric baru untuk pengguna yang sedang login. 🔒 **User terautentikasi**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body (JSON):**

> Field mengikuti data biometric yang relevan untuk analisis kolesterol. Sesuaikan dengan skema model `Biometric` di database.

| Field              | Type      | Required | Keterangan                                      |
|--------------------|-----------|----------|-------------------------------------------------|
| `weight`           | `number`  | ✅ Ya    | Berat badan (kg)                                |
| `height`           | `number`  | ✅ Ya    | Tinggi badan (cm)                               |
| `totalCholesterol` | `number`  | ✅ Ya    | Total kolesterol (mg/dL)                        |
| `hdl`              | `number`  | ✅ Ya    | HDL kolesterol (mg/dL)                          |
| `ldl`              | `number`  | ✅ Ya    | LDL kolesterol (mg/dL)                          |
| `triglycerides`    | `number`  | ✅ Ya    | Trigliserida (mg/dL)                            |
| `bloodPressure`    | `string`  | ❌ Opsional | Tekanan darah (contoh: `"120/80"`)           |
| `bloodSugar`       | `number`  | ❌ Opsional | Kadar gula darah (mg/dL)                     |
| `smokingStatus`    | `boolean` | ❌ Opsional | Status merokok (`true` / `false`)            |

**Contoh Request:**
```json
{
  "weight": 70,
  "height": 170,
  "totalCholesterol": 210,
  "hdl": 55,
  "ldl": 130,
  "triglycerides": 150,
  "bloodPressure": "120/80",
  "bloodSugar": 95,
  "smokingStatus": false
}
```

---

### `PATCH /api/biometric/:id`

Memperbarui data biometric berdasarkan User ID. 🔒 **Owner atau ADMIN**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Path Parameter:**

| Parameter | Type     | Keterangan  |
|-----------|----------|-------------|
| `id`      | `string` | ID pengguna |

**Request Body (JSON):** _(semua field opsional, kirim hanya yang ingin diperbarui)_

| Field              | Type      | Keterangan                         |
|--------------------|-----------|------------------------------------|
| `weight`           | `number`  | Berat badan (kg)                   |
| `height`           | `number`  | Tinggi badan (cm)                  |
| `totalCholesterol` | `number`  | Total kolesterol (mg/dL)           |
| `hdl`              | `number`  | HDL kolesterol (mg/dL)             |
| `ldl`              | `number`  | LDL kolesterol (mg/dL)             |
| `triglycerides`    | `number`  | Trigliserida (mg/dL)               |
| `bloodPressure`    | `string`  | Tekanan darah (contoh: `"120/80"`) |
| `bloodSugar`       | `number`  | Kadar gula darah (mg/dL)           |
| `smokingStatus`    | `boolean` | Status merokok (`true` / `false`)  |

**Contoh Request:**
```json
{
  "weight": 68,
  "totalCholesterol": 195
}
```

---

### `DELETE /api/biometric/:id`

Menghapus data biometric berdasarkan User ID. 🔒 **ADMIN only**

**Headers:**

```
Authorization: Bearer <access_token>
```

**Path Parameter:**

| Parameter | Type     | Keterangan  |
|-----------|----------|-------------|
| `id`      | `string` | ID pengguna |

**Request Body:** _Tidak diperlukan_

---

## ❤️ Heart Rate

Base path: `/api/heart-rate`

> Endpoint ini **tidak** memerlukan autentikasi (publik).

---

### `POST /api/heart-rate`

Menghitung zone detak jantung target berdasarkan data pengguna.

**Request Body (JSON):**

| Field              | Type     | Required | Keterangan                                                    |
|--------------------|----------|----------|---------------------------------------------------------------|
| `dob`              | `date`   | ✅ Ya    | Tanggal lahir (format: `YYYY-MM-DD`, tidak boleh lebih dari hari ini) |
| `gender`           | `string` | ✅ Ya    | Jenis kelamin: `MALE` atau `FEMALE`                           |
| `restingHeartRate` | `number` | ✅ Ya    | Detak jantung saat istirahat (bpm, min: 30, max: 220)        |
| `activityLevel`    | `string` | ✅ Ya    | Level aktivitas: `INACTIVE`, `LIGHTLY_ACTIVE`, `ACTIVE`, `ATHLETE` |

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

## 🔑 Authorization Levels

| Level            | Keterangan                                                           |
|------------------|----------------------------------------------------------------------|
| 🌐 Public        | Tidak perlu token                                                    |
| 🔒 Authenticated | Memerlukan Bearer Token (user manapun yang login)                    |
| 👤 Owner/Admin   | Hanya pemilik resource atau user dengan role `ADMIN`                 |
| 🛡️ Admin only   | Hanya user dengan role `ADMIN`                                       |

---

## 📦 Response Format

Semua response menggunakan format JSON. Contoh response sukses:

```json
{
  "status": "success",
  "message": "Data berhasil diambil",
  "data": { ... }
}
```

Contoh response error:

```json
{
  "status": "error",
  "message": "Pesan error yang relevan"
}
```

---

## 🔒 Authentication Header

Untuk endpoint yang memerlukan autentikasi, sertakan header berikut:

```
Authorization: Bearer <access_token>
```

Access token didapat dari response login (`POST /api/auth/login`) atau refresh token (`POST /api/auth/refresh`).
