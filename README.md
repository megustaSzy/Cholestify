# 🩸 Cholestify

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5-000000?logo=express&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?logo=tensorflow&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?logo=opensourceinitiative&logoColor=white)

**AI-Powered Cholesterol Health Management Platform**

🌐 **Live Demo:** [cholestify.vercel.app](https://cholestify.vercel.app)

Cholestify adalah platform manajemen kesehatan kolesterol berbasis kecerdasan buatan yang membantu pengguna memantau, melakukan deteksi dini, dan mengelola kadar kolesterol secara menyeluruh. Aplikasi ini memanfaatkan teknologi **Computer Vision** untuk mendeteksi potensi risiko kolesterol tinggi (Arcus Senilis) secara **non-invasif** melalui analisis citra mata, serta menyediakan rekomendasi diet, pelacakan aktivitas harian, dan laporan kesehatan komprehensif.

> **Problem yang Diselesaikan:** Pemeriksaan kolesterol konvensional memerlukan pengambilan sampel darah yang invasif dan mahal. Cholestify hadir sebagai solusi awal deteksi dini yang cepat, murah, dan mudah diakses oleh siapa saja hanya dengan foto mata.

---

## ✨ Features

### Core Features

- **Pemindaian Mata AI (Eye Scan Prediction)** — Deteksi indikasi kolesterol tinggi dari foto mata menggunakan model Deep Learning EfficientNetB0 dengan OOD (Out-of-Distribution) Detection 3 lapis
- **Pencatatan Kolesterol (Lipid Panel Tracking)** — Pencatatan hasil laboratorium (Kolesterol Total, LDL, HDL, Trigliserida) dengan riwayat lengkap
- **Rekomendasi Makanan Cerdas (Food Recommendation)** — 100 master data makanan yang diklasifikasikan secara dinamis (OPTIMAL / NEUTRAL / LIMIT) berdasarkan kadar LDL pengguna
- **Target Kesehatan & Pencatatan Harian (Health Goals & Daily Tracking)** — Penetapan target kesehatan mingguan dan pelacakan kalori, protein, serta durasi olahraga harian
- **Rekomendasi Kesehatan AI** — Saran diet dan aktivitas yang di-generate secara otomatis oleh Google Gemini AI berdasarkan data lipidnya
- **Kalkulator Metrik Tubuh (Biometric Calculator)** — Pencatatan tinggi & berat badan dengan kalkulasi BMI otomatis
- **Kalkulator Denyut Jantung (Heart Rate Zone Calculator)** — Penghitungan zona detak jantung optimal berdasarkan usia, gender, dan tingkat aktivitas

### Authentication & Security

- **Multi-Auth** — Login via Email/Password
- **JWT + HTTP-Only Cookies** — Token-based authentication dengan refresh token rotation
- **Password Recovery** — Sistem lupa & reset password berbasis token via email (SMTP)

### User Experience

- **Responsive Dashboard** — Health Summary yang menggabungkan metrik tubuh dan profil lipid terbaru
- **PDF Report Generation** — Laporan kesehatan lengkap yang dapat diunduh
- **Real-time Progress** — WebSocket (Socket.io) untuk tracking progress AI Scan secara live
- **Swagger API Docs** — Dokumentasi API interaktif dan lengkap
- **Pagination & Search** — Semua endpoint list mendukung pagination, filter, dan pencarian

---

## 🛠️ Tech Stack

### Frontend (`/web`)

| Technology       | Purpose                      |
| ---------------- | ---------------------------- |
| Next.js 16       | React Framework (App Router) |
| TypeScript       | Type Safety                  |
| Tailwind CSS 4   | Utility-First Styling        |
| ShadCN UI        | Component Library            |
| SWR              | Data Fetching & Caching      |
| Socket.io Client | Real-time WebSocket          |
| Zod              | Form Validation              |
| Lucide React     | Icon Library                 |

### Backend (`/api`)

| Technology          | Purpose                  |
| ------------------- | ------------------------ |
| Node.js 20          | Runtime Environment      |
| Express.js 5        | Web Framework            |
| Prisma ORM 7        | Database ORM & Migration |
| PostgreSQL          | Relational Database      |
| Socket.io           | WebSocket Server         |
| Passport.js         | OAuth Authentication     |
| JSON Web Token      | Token-based Auth         |
| Joi                 | Request Validation       |
| Multer + Cloudinary | Image Upload & Storage   |
| PDFKit              | PDF Report Generation    |
| Nodemailer          | Email Service (SMTP)     |
| Swagger (OpenAPI)   | API Documentation        |
| Helmet + CORS       | Security Headers         |
| Express Rate Limit  | API Rate Limiting        |

### AI Service (`/ai-service`)

| Technology         | Purpose                             |
| ------------------ | ----------------------------------- |
| Python 3.10        | Runtime Environment                 |
| FastAPI            | High-Performance API Framework      |
| TensorFlow / Keras | Deep Learning Inference             |
| EfficientNetB0     | CNN Model Architecture              |
| OpenCV             | Image Preprocessing & OOD Detection |
| NumPy              | Numerical Computation               |

### External Services

| Service          | Purpose                          |
| ---------------- | -------------------------------- |
| NeonConsole      | Managed PostgreSQL Database      |
| Cloudinary       | Cloud Image Storage              |
| Google Gemini AI | Health Recommendation Generation |

### DevOps & Deployment

| Tool                    | Purpose                         |
| ----------------------- | ------------------------------- |
| GitHub Actions          | CI/CD Pipeline                  |
| PM2                     | Node.js Process Manager         |
| Nginx                   | Reverse Proxy & SSL Termination |
| Certbot (Let's Encrypt) | Free SSL Certificate            |
| Docker                  | AI Service Containerization     |
| Hugging Face Spaces     | AI Service Hosting              |

---

## 📦 Installation

### Prerequisites

- Node.js >= 20.x
- Python >= 3.10
- PostgreSQL (atau NeonConsole)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/megustaSzy/Cholestify.git
cd Cholestify
```

### 2. Backend Setup (`/api`)

```bash
cd api

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env sesuai konfigurasi (lihat bagian Environment Variables)
nano .env

# Generate Prisma Client
npx prisma generate

# Migrasi database
npx prisma migrate dev

# Seed admin user
npx prisma db seed

# Seed dummy user (opsional)
node prisma/user-seed.js

# Jalankan development server
npm run dev
```

Backend akan berjalan di `http://localhost:3001`

### 3. Frontend Setup (`/web`)

```bash
cd web

# Install dependencies
npm install

# Buat file .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### 4. AI Service Setup (`/ai-service`)

```bash
cd ai-service

# Buat virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Jalankan server
uvicorn main:app --host 0.0.0.0 --port 7860 --reload
```

AI Service akan berjalan di `http://localhost:7860`

### 5. Environment Variables

#### Backend (`/api/.env`)

```env
NODE_ENV=development
PORT=3001

# Database (NeonConsole / Local PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Authentication
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Admin Seed
ADMIN_EMAIL=admin@cholestify.com
ADMIN_PASSWORD=your_admin_password
ADMIN_NOTELP=081234567890

# Cookie
COOKIE_SECURE=false

# SMTP (Email Service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Cholestify <noreply@cholestify.com>

# Frontend URL (for CORS & OAuth callback)
FRONTEND_URL=http://localhost:3000

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# FastAPI AI Service URL
FASTAPI_URL=http://localhost:7860
```

#### Frontend (`/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📡 API Documentation

Dokumentasi API interaktif tersedia melalui Swagger UI setelah server berjalan:

```
http://localhost:3001/api-docs
```

### API Endpoints

#### Authentication

| Method | Endpoint                    | Description                 |
| ------ | --------------------------- | --------------------------- |
| `POST` | `/api/auth/register`        | Register user baru          |
| `POST` | `/api/auth/login`           | Login user                  |
| `POST` | `/api/auth/logout`          | Logout user                 |
| `POST` | `/api/auth/refresh`         | Refresh access token        |
| `POST` | `/api/auth/forgot-password` | Kirim email reset password  |
| `POST` | `/api/auth/reset-password`  | Reset password dengan token |
| `GET`  | `/api/auth/me`              | Get data sesi user saat ini |

#### User Profile

| Method   | Endpoint                | Description                            |
| -------- | ----------------------- | -------------------------------------- |
| `GET`    | `/api/users/me`         | Get profil user yang login             |
| `PATCH`  | `/api/users/me`         | Update profil user (termasuk avatar)   |
| `POST`   | `/api/users`            | Buat user baru *(Admin)*               |
| `GET`    | `/api/users`            | Get semua data user *(Admin)*          |
| `PATCH`  | `/api/users/:id`        | Update profil user tertentu *(Admin)*  |
| `DELETE` | `/api/users/:id`        | Hapus user tertentu *(Admin)*          |
| `DELETE` | `/api/users/:id/avatar` | Hapus avatar user tertentu *(Admin)*   |

#### AI Eye Screening

| Method | Endpoint                        | Description                            |
| ------ | ------------------------------- | -------------------------------------- |
| `POST` | `/api/screenings`               | Upload foto mata & analisis AI         |
| `GET`  | `/api/screenings/me`            | Riwayat scan mata user                 |
| `GET`  | `/api/screenings/me/export/pdf` | Download riwayat scan dalam format PDF |

#### Lipid Panel

| Method   | Endpoint                          | Description                               |
| -------- | --------------------------------- | ----------------------------------------- |
| `POST`   | `/api/lipid-panels`               | Input hasil lab kolesterol                |
| `GET`    | `/api/lipid-panels/me`            | Riwayat lipid panel user                  |
| `GET`    | `/api/lipid-panels/me/export/pdf` | Download riwayat lipid dalam format PDF   |
| `GET`    | `/api/lipid-panels`               | Get semua histori lipid panel *(Admin)*   |
| `PATCH`  | `/api/lipid-panels/:id`           | Update data lipid panel spesifik *(Admin)*|
| `DELETE` | `/api/lipid-panels/:id`           | Hapus data lipid panel spesifik *(Admin)* |

#### Biometrics

| Method   | Endpoint              | Description                               |
| -------- | --------------------- | ----------------------------------------- |
| `POST`   | `/api/biometrics`     | Input biometrik pertama kali              |
| `GET`    | `/api/biometrics/me`  | Get biometrik terkini user                |
| `PATCH`  | `/api/biometrics`     | Update tinggi & berat badan               |
| `GET`    | `/api/biometrics`     | Get semua data biometrik global *(Admin)* |
| `DELETE` | `/api/biometrics/:id` | Hapus data biometrik spesifik *(Admin)*   |

#### Health Goals & Daily Tracking

| Method | Endpoint                      | Description                           |
| ------ | ----------------------------- | ------------------------------------- |
| `POST` | `/api/health-goals`           | Buat target kesehatan baru            |
| `GET`  | `/api/health-goals/me`        | Get target aktif user                 |
| `GET`  | `/api/health-goals/progress`  | Get progress terhadap target saat ini |
| `POST` | `/api/daily-tracking`         | Catat aktivitas harian (kalori, dll)  |
| `GET`  | `/api/daily-tracking/history` | Riwayat aktivitas harian user         |

#### Health Recommendations

| Method | Endpoint                               | Description                      |
| ------ | -------------------------------------- | -------------------------------- |
| `GET`  | `/api/health-recommendations/overview` | Get overview rekomendasi terbaru |
| `GET`  | `/api/health-recommendations/me`       | Riwayat rekomendasi AI           |

#### Food Recommendation

| Method | Endpoint            | Description                                       |
| ------ | ------------------- | ------------------------------------------------- |
| `GET`  | `/api/foods/public` | List master makanan public (tanpa login)          |
| `GET`  | `/api/foods`        | List makanan terklasifikasi berdasar profil lipid |

#### Heart Rate Calculator

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| `POST` | `/api/heart-rate` | Hitung zona detak jantung |

#### Dashboard

| Method | Endpoint              | Description                             |
| ------ | --------------------- | --------------------------------------- |
| `GET`  | `/api/health-summary` | Get ringkasan kesehatan untuk dashboard |

### AI Service Endpoints

| Method | Endpoint       | Description                        |
| ------ | -------------- | ---------------------------------- |
| `GET`  | `/api`         | Root API (version info)            |
| `GET`  | `/api/health`  | Health check & model status        |
| `POST` | `/api/predict` | Analisis gambar mata (upload file) |

---

## 🏗️ Architecture / System Design

### System Architecture

```mermaid
flowchart TB
    subgraph Client["📱 Client Layer"]
        UI["Next.js 16 (React + TypeScript)\nTailwind CSS · ShadCN UI · SWR"]
    end

    subgraph Proxy["🛡️ Reverse Proxy Layer"]
        Nginx["Nginx\n(SSL Termination + WebSocket Support)"]
    end

    subgraph Backend["⚙️ Application Layer"]
        API["Express.js 5 + Socket.io\n(Managed by PM2)"]
    end

    subgraph External["☁️ External Services & Database"]
        DB[("Neon PostgreSQL\n(Database)")]
        Cloudinary["Cloudinary\n(Image Storage)"]
        Gemini["Google Gemini AI\n(Health Advice)"]
        AI["FastAPI\n(Eye Scan AI)"]
    end

    UI -- "HTTPS / WSS" --> Nginx
    Nginx -- "HTTP (localhost:3001)" --> API
    API --> DB
    API --> Cloudinary
    API --> Gemini
    API --> AI
```

### AI Eye Scan Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Next.js (Client)
    participant Backend as Express.js (API)
    participant Cloud as Cloudinary
    participant AI as FastAPI (AI Service)
    participant DB as Neon PostgreSQL

    User->>Frontend: Upload Foto Mata
    Frontend->>Backend: POST /api/screenings (Image File)

    Backend->>Cloud: 1. Upload Stream
    Cloud-->>Backend: Return Image URL

    Backend->>AI: 2. Send Image URL (Inference Request)
    Note right of AI: - File Validation<br/>- Auto-Resize<br/>- OOD Detection (3 lapis)<br/>- Preprocessing (CLAHE)<br/>- EfficientNetB0 Inference
    AI-->>Backend: Return Prediction Result

    Backend->>DB: 3. Simpan Hasil Scan

    Backend-->>Frontend: 4. Real-time Progress (WebSocket)
    Frontend-->>User: Tampilkan Hasil Prediksi
```

### Database Schema (ERD)

```mermaid
erDiagram
    User ||--o{ Token : "has"
    User ||--o{ PasswordResetToken : "has"
    User ||--o| Biometric : "has"
    User ||--o{ LipidPanel : "records"
    User ||--o{ Screening : "performs"
    User ||--o{ HealthGoal : "sets"
    User ||--o{ HealthRecommendation : "receives"
    User ||--o{ DailyTracking : "tracks"

    LipidPanel ||--o{ HealthRecommendation : "triggers"
    HealthGoal ||--o{ DailyTracking : "contains"

    Food ||--o{ FoodClassification : "classified as"
```

---

## 🚀 Deployment

### Production Architecture

| Layer             | Service                | Platform                     |
| ----------------- | ---------------------- | ---------------------------- |
| **Frontend**      | Next.js                | Vercel                       |
| **Backend**       | Express.js + Socket.io | Ubuntu VPS + PM2 + Nginx     |
| **Database**      | PostgreSQL             | NeonConsole (Managed)        |
| **AI Service**    | FastAPI + TensorFlow   | Hugging Face Spaces (Docker) |
| **Image Storage** | Cloud Storage          | Cloudinary                   |
| **CI/CD**         | Auto-deploy on push    | GitHub Actions               |

### Backend VPS Stack

- **OS:** Ubuntu 22.04 LTS
- **Runtime:** Node.js 20 (tanpa Docker)
- **Process Manager:** PM2 (auto-restart & startup on reboot)
- **Reverse Proxy:** Nginx (SSL termination + WebSocket support)
- **SSL:** Let's Encrypt (Certbot, auto-renew setiap 90 hari)
- **Firewall:** UFW (allow SSH + Nginx Full)

### AI Service Deployment

AI Service di-deploy ke **Hugging Face Spaces** menggunakan Docker:

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```

---

## 🔒 Security Notes

### Authentication & Authorization

- **JWT (JSON Web Tokens)** digunakan untuk autentikasi, disimpan di dalam **HTTP-Only Cookies** (tidak bisa diakses oleh JavaScript di browser)
- **Access Token** memiliki masa berlaku pendek (15 menit), sedangkan **Refresh Token** berlaku 7 hari
- **Refresh Token Rotation** — Setiap kali access token di-refresh, refresh token lama diinvalidasi

### Data Protection

- **Password Hashing** menggunakan bcryptjs dengan salt rounds 10
- **Environment Variables** tidak pernah di-commit ke repository (`.env` ada di `.gitignore`)
- **Rate Limiting** diterapkan secara global dan per-endpoint berat (Screening & Lipid Panel: max 5 req/menit)
- **Helmet.js** untuk HTTP security headers (XSS Protection, Content Security Policy, dll.)
- **CORS** dikonfigurasi ketat hanya mengizinkan Frontend URL yang terdaftar

### Network Security

- **HTTPS** di-enforce melalui Nginx + Let's Encrypt SSL
- **COOKIE_SECURE=true** di production agar cookies hanya dikirim melalui HTTPS
- **Nginx Reverse Proxy** menyembunyikan port internal (3001) dari akses publik
- **UFW Firewall** hanya membuka port SSH dan Nginx (80/443)

---

## ⚙️ DevOps / CI-CD

### GitHub Actions Pipeline

Auto-deployment di-trigger setiap kali ada push ke branch `main` yang menyentuh folder `api/`:

```yaml
name: Deploy Cholestify API
on:
  push:
    branches: [main]
    paths: ["api/**"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1.2.2
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/Cholestify
            git pull origin main
            cd api
            npm install --production
            npx prisma generate
            pm2 restart cholestify-api
```

### Deployment Pipeline Flow

```
Developer Push → GitHub → GitHub Actions → SSH to VPS →
  git pull → npm install → prisma generate → pm2 restart
```

### PM2 Process Management

```bash
pm2 start src/server.js --name "cholestify-api"  # Start
pm2 restart cholestify-api                        # Restart
pm2 logs cholestify-api                           # View logs
pm2 monit                                         # Monitor CPU/RAM
pm2 startup && pm2 save                           # Auto-start on reboot
```

### Nginx Reverse Proxy

Nginx meneruskan request dari port 80/443 ke aplikasi Node.js di port 3001, dengan dukungan penuh untuk WebSocket (Socket.io):

```nginx
server {
    listen 443 ssl;
    server_name api-cholestify.my.id;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📁 Project Structure

```
Cholestify/
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD GitHub Actions
│
├── api/                         # Backend (Node.js + Express)
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── seed.js              # Admin seeder
│   │   └── user-seed.js         # User seeder
│   ├── src/
│   │   ├── config/              # Passport, etc.
│   │   ├── constants/           # Role, status constants
│   │   ├── controllers/         # Route handlers
│   │   ├── docs/                # Swagger configuration
│   │   ├── exceptions/          # Custom error classes
│   │   ├── lib/                 # Prisma client singleton
│   │   ├── middlewares/         # Auth, role, rate-limit, upload
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # Business logic layer
│   │   ├── utils/               # Helper functions
│   │   ├── validations/         # Joi schemas
│   │   ├── index.js             # Express app configuration
│   │   └── server.js            # HTTP + WebSocket server
│   ├── .env.example
│   └── package.json
│
├── web/                         # Frontend (Next.js + TypeScript)
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── calculator-hdr/
│   │   │   ├── food-directory/
│   │   │   └── user/
│   │   │       ├── dashboard/
│   │   │       ├── scan-mata/
│   │   │       ├── metric/
│   │   │       ├── list-makanan/
│   │   │       ├── riwayat/
│   │   │       ├── laporan/
│   │   │       └── profile/
│   │   ├── components/          # Reusable UI components
│   │   ├── hooks/               # Custom React hooks
│   │   └── lib/                 # Utilities & types
│   └── package.json
│
├── ai-service/                  # AI Service (Python + FastAPI)
│   ├── models/                  # Trained ML model (.keras)
│   ├── main.py                  # FastAPI app + prediction logic
│   ├── class_indices.json       # Class label mapping
│   ├── requirements.txt
│   └── Dockerfile
│
└── README.md
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👥 Author / Credits

### Development Team

| Role                   | Name                                   |
| ---------------------- | -------------------------------------- |
| **Backend Developer**  | Raditya Ahmad                          |
| **Frontend Developer** | Deni Himawan                           |
| **AI Engineer**        | Mohd. Musyaffa Alief Athallah          |
| **AI Engineer**        | Kaisya Anindya Callista Putri Kusyanto |
| **Data Scientist**     | Vini Emeralda                          |
| **Data Scientist**     | Muhammad Fajar Azriel                  |

### Built With

- [Dicoding Indonesia](https://www.dicoding.com/) — DBS Foundation Coding Camp 2025
- [Express.js](https://expressjs.com/) — Fast, unopinionated web framework
- [Next.js](https://nextjs.org/) — The React Framework
- [FastAPI](https://fastapi.tiangolo.com/) — Modern Python web framework
- [Prisma](https://www.prisma.io/) — Next-generation ORM
- [TensorFlow](https://www.tensorflow.org/) — Machine Learning platform

---

<div align="center">

**Cholestify** — _Your AI Health Companion_ 🩸

[🌐 Live Demo](https://cholestify.vercel.app) · [Report Bug](https://github.com/megustaSzy/Cholestify/issues) · [Request Feature](https://github.com/megustaSzy/Cholestify/issues)

</div>
