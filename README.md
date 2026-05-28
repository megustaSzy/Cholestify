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

Cholestify adalah platform manajemen kesehatan kolesterol berbasis kecerdasan buatan yang membantu pengguna memantau, mendeteksi, dan mengelola kadar kolesterol secara menyeluruh. Aplikasi ini memanfaatkan teknologi **Computer Vision** untuk mendeteksi potensi risiko kolesterol tinggi (Arcus Senilis) secara **non-invasif** melalui analisis citra mata, serta menyediakan rekomendasi diet, pelacakan aktivitas harian, dan laporan kesehatan komprehensif.

> **Problem yang Diselesaikan:** Pemeriksaan kolesterol konvensional memerlukan pengambilan sampel darah yang invasif dan mahal. Cholestify hadir sebagai solusi awal deteksi dini yang cepat, murah, dan mudah diakses oleh siapa saja hanya dengan foto mata.

---

## ✨ Features

### Core Features
- **AI Eye Scan Prediction** — Deteksi indikasi kolesterol tinggi dari foto mata menggunakan model Deep Learning EfficientNetB0 dengan OOD (Out-of-Distribution) Detection 3 lapis
- **Lipid Panel Tracking** — Pencatatan hasil laboratorium (Kolesterol Total, LDL, HDL, Trigliserida) dengan riwayat lengkap
- **Smart Food Recommendation** — 150+ master data makanan yang diklasifikasikan secara dinamis (OPTIMAL / NEUTRAL / LIMIT) berdasarkan kadar LDL pengguna
- **Health Goals & Daily Tracking** — Penetapan target kesehatan mingguan dan pelacakan kalori, protein, serta durasi olahraga harian
- **AI Health Recommendations** — Saran diet dan aktivitas yang di-generate secara otomatis oleh Google Gemini AI berdasarkan profil kesehatan pengguna
- **Biometric Calculator** — Pencatatan tinggi & berat badan dengan kalkulasi BMI otomatis
- **Heart Rate Zone Calculator** — Penghitungan zona detak jantung optimal berdasarkan usia, gender, dan tingkat aktivitas

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
| Technology | Purpose |
|---|---|
| Next.js 16 | React Framework (App Router) |
| TypeScript | Type Safety |
| Tailwind CSS 4 | Utility-First Styling |
| ShadCN UI | Component Library |
| SWR | Data Fetching & Caching |
| Socket.io Client | Real-time WebSocket |
| Zod | Form Validation |
| Lucide React | Icon Library |

### Backend (`/api`)
| Technology | Purpose |
|---|---|
| Node.js 20 | Runtime Environment |
| Express.js 5 | Web Framework |
| Prisma ORM 7 | Database ORM & Migration |
| PostgreSQL | Relational Database |
| Socket.io | WebSocket Server |
| Passport.js | OAuth Authentication |
| JSON Web Token | Token-based Auth |
| Joi | Request Validation |
| Multer + Cloudinary | Image Upload & Storage |
| PDFKit | PDF Report Generation |
| Nodemailer | Email Service (SMTP) |
| Swagger (OpenAPI) | API Documentation |
| Helmet + CORS | Security Headers |
| Express Rate Limit | API Rate Limiting |

### AI Service (`/ai-service`)
| Technology | Purpose |
|---|---|
| Python 3.10 | Runtime Environment |
| FastAPI | High-Performance API Framework |
| TensorFlow / Keras | Deep Learning Inference |
| EfficientNetB0 | CNN Model Architecture |
| OpenCV | Image Preprocessing & OOD Detection |
| NumPy | Numerical Computation |

### External Services
| Service | Purpose |
|---|---|
| NeonConsole | Managed PostgreSQL Database |
| Cloudinary | Cloud Image Storage |
| Google Gemini AI | Health Recommendation Generation |
| Google OAuth 2.0 | Social Authentication |

### DevOps & Deployment
| Tool | Purpose |
|---|---|
| GitHub Actions | CI/CD Pipeline |
| PM2 | Node.js Process Manager |
| Nginx | Reverse Proxy & SSL Termination |
| Certbot (Let's Encrypt) | Free SSL Certificate |
| Docker | AI Service Containerization |
| Hugging Face Spaces | AI Service Hosting |

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

# Database (Supabase / Local PostgreSQL)
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

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT=http://localhost:3001/api/auth/google/callback

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
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register user baru |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout user |
| `POST` | `/api/auth/refresh-token` | Refresh access token |
| `POST` | `/api/auth/forgot-password` | Kirim email reset password |
| `POST` | `/api/auth/reset-password` | Reset password dengan token |
| `GET` | `/api/auth/google` | Login via Google OAuth |
| `GET` | `/api/auth/google/callback` | Google OAuth callback |

#### User Management
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/me` | Get profil user yang login |
| `PUT` | `/api/users/me` | Update profil user |
| `GET` | `/api/users` | Get semua user (Admin) |
| `GET` | `/api/users/:id` | Get user by ID (Admin) |
| `DELETE` | `/api/users/:id` | Hapus user (Admin) |

#### AI Eye Screening
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/screenings` | Upload foto mata & analisis AI |
| `GET` | `/api/screenings/me` | Riwayat scan user |
| `GET` | `/api/screenings/:id` | Detail hasil scan |

#### Lipid Panel
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/lipid-panels` | Input hasil lab kolesterol |
| `GET` | `/api/lipid-panels/me` | Riwayat lipid panel user |
| `GET` | `/api/lipid-panels/:id` | Detail lipid panel |
| `PUT` | `/api/lipid-panels/:id` | Update lipid panel |

#### Biometrics
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/biometrics` | Input / update tinggi & berat badan |
| `GET` | `/api/biometrics/me` | Get biometrik user |

#### Health Goals & Daily Tracking
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/health-goals` | Buat target kesehatan |
| `GET` | `/api/health-goals/me` | Get target aktif user |
| `PUT` | `/api/health-goals/:id` | Update target |
| `POST` | `/api/daily-tracking` | Catat aktivitas harian |
| `GET` | `/api/daily-tracking/me` | Riwayat aktivitas harian |

#### Health Recommendations
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health-recommendations/me` | Get rekomendasi AI terbaru |
| `POST` | `/api/health-recommendations` | Generate rekomendasi manual |

#### Food Recommendation
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/foods` | List makanan dengan klasifikasi dinamis |
| `GET` | `/api/foods/:id` | Detail makanan |

#### Heart Rate Calculator
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/heart-rate/calculate` | Hitung zona detak jantung |

#### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health-summary/me` | Get ringkasan kesehatan |

### AI Service Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api` | Root API (version info) |
| `GET` | `/api/health` | Health check & model status |
| `POST` | `/api/predict` | Analisis gambar mata (upload file) |

---

## 🏗️ Architecture / System Design

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                                                                 │
│   ┌──────────────────────────────────────────────────────┐      │
│   │              Next.js 16 (React + TypeScript)         │      │
│   │     Tailwind CSS · ShadCN UI · SWR · Socket.io       │      │
│   └──────────────────────┬───────────────────────────────┘      │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTPS / WSS
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                     REVERSE PROXY LAYER                          │
│                                                                  │
│   ┌────────────────────────────────────────────────────────┐     │
│   │        Nginx (SSL Termination + Load Balancing)        │     │
│   └──────────────────────┬─────────────────────────────────┘     │
└──────────────────────────┼──────────────────────────────────────-┘
                           │ HTTP (localhost:3001)
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│                                                                  │
│   ┌────────────────────────────────────────────────────────┐     │
│   │       Express.js 5 + Socket.io (Managed by PM2)       │     │
│   │                                                        │     │
│   │  Auth · Users · Screenings · Lipid Panel · Biometric  │     │
│   │  Health Goals · Daily Tracking · Food · Heart Rate     │     │
│   │  Health Recommendations · Dashboard · Reports (PDF)    │     │
│   └───────┬──────────┬──────────┬──────────┬───────────────┘     │
│           │          │          │          │                      │
│           ▼          ▼          ▼          ▼                      │
│     ┌─────────┐ ┌────────┐ ┌────────┐ ┌──────────┐              │
│     │Supabase │ │Cloudi- │ │Gemini  │ │ FastAPI  │              │
│     │PostgreSQL│ │nary    │ │   AI   │ │AI Service│              │
│     │(Database)│ │(Images)│ │(Advice)│ │(Eye Scan)│              │
│     └─────────┘ └────────┘ └────────┘ └──────────┘              │
└──────────────────────────────────────────────────────────────────┘
```

### AI Eye Scan Flow

```
User Upload Foto Mata
       │
       ▼
  [Express.js API]
       │
       ├── 1. Upload ke Cloudinary (mendapat Image URL)
       │
       ├── 2. Kirim Image URL ke FastAPI AI Service
       │       │
       │       ├── File Validation (type & size)
       │       ├── Auto-Resize (jika > 1200px)
       │       ├── OOD Detection 3 lapis:
       │       │     ├── Hough Circle Detection (iris/pupil)
       │       │     ├── Color Ratio Analysis (HSV)
       │       │     └── Size Ratio Validation
       │       ├── Preprocessing (Crop + CLAHE Enhancement)
       │       └── EfficientNetB0 Inference
       │
       ├── 3. Simpan hasil ke PostgreSQL
       │
       └── 4. Kirim progress real-time via WebSocket
              │
              ▼
        [Frontend menerima hasil scan]
```

### Database Schema (ERD)

```
User ──┬── Token (Refresh Token)
       ├── PasswordResetToken
       ├── Biometric (1:1)
       ├── LipidPanel (1:N) ──── HealthRecommendation (1:N)
       ├── Screening (1:N)
       ├── HealthGoal (1:N) ──── DailyTracking (1:N)
       └── HealthRecommendation (1:N)

Food ──── FoodClassification (1:N, by LDL Group)
```

---

## 🚀 Deployment

### Production Architecture

| Layer | Service | Platform |
|---|---|---|
| **Frontend** | Next.js | Vercel |
| **Backend** | Express.js + Socket.io | Ubuntu VPS + PM2 + Nginx |
| **Database** | PostgreSQL | NeonConsole (Managed) |
| **AI Service** | FastAPI + TensorFlow | Hugging Face Spaces (Docker) |
| **Image Storage** | Cloud Storage | Cloudinary |
| **CI/CD** | Auto-deploy on push | GitHub Actions |

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
- **Role-Based Access Control (RBAC)** — Endpoint admin dilindungi oleh middleware role check

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

### OAuth Implementation
- **Google OAuth 2.0** diimplementasikan via Passport.js
- Client ID & Secret disimpan di environment variables
- Callback URL dikonfigurasi per-environment (development vs production)

---

## ⚙️ DevOps / CI-CD

### GitHub Actions Pipeline

Auto-deployment di-trigger setiap kali ada push ke branch `main` yang menyentuh folder `api/`:

```yaml
name: Deploy Cholestify API
on:
  push:
    branches: [main]
    paths: ['api/**']

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

| Role | Name |
|---|---|
| **Backend Developer** | Raditya Ahmad |
| **Frontend Developer** | Deni Himawan |
| **AI Engineer** | Mohd. Musyaffa Alief Athallah |
| **AI Engineer** | Kaisya Anindya Callista Putri Kusyanto |
| **Data Scientist** | Vini Emeralda |
| **Data Scientist** | Muhammad Fajar Azriel |

### Built With
- [Dicoding Indonesia](https://www.dicoding.com/) — DBS Foundation Coding Camp 2025
- [Express.js](https://expressjs.com/) — Fast, unopinionated web framework
- [Next.js](https://nextjs.org/) — The React Framework
- [FastAPI](https://fastapi.tiangolo.com/) — Modern Python web framework
- [Prisma](https://www.prisma.io/) — Next-generation ORM
- [TensorFlow](https://www.tensorflow.org/) — Machine Learning platform

---

<div align="center">

**Cholestify** — *Your AI Health Companion* 🩸

[🌐 Live Demo](https://cholestify.vercel.app) · [Report Bug](https://github.com/megustaSzy/Cholestify/issues) · [Request Feature](https://github.com/megustaSzy/Cholestify/issues)

</div>
