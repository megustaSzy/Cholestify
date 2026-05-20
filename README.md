# 🩸 Cholestify

Cholestify adalah aplikasi manajemen kesehatan dan deteksi kolesterol cerdas yang dirancang untuk memantau, mencegah, dan mengelola kadar kolesterol dalam darah. Aplikasi ini tidak hanya menawarkan pencatatan metrik kesehatan dasar, melainkan juga memanfaatkan teknologi **Analisis Citra Mata (AI)** secara non-invasif untuk mendeteksi potensi risiko kolesterol tinggi dari foto mata, serta memberikan saran medis, rekomendasi makanan, dan penetapan target kesehatan secara dinamis.

Proyek ini dibangun menggunakan **Node.js, Express.js, Prisma ORM, dan PostgreSQL**, serta terintegrasi dengan layanan eksternal **FastAPI** untuk inferensi Machine Learning dan **Cloudinary** untuk penyimpanan gambar.

---

## ✨ Fitur Utama (Berdasarkan Modul Endpoint)

Aplikasi Cholestify menyediakan antarmuka API RESTful yang kaya dan mencakup berbagai aspek manajemen kesehatan pengguna:

### 1. 🔐 Autentikasi & Keamanan (Authentication)

Modul ini mengamankan seluruh akses ke dalam sistem menggunakan token JWT berbasis HTTP-Only Cookie untuk keamanan tingkat tinggi.

- **Email & Password:** Registrasi, login, logout, dan pembaruan token otentikasi.
- **Google OAuth:** Memungkinkan pengguna untuk login/daftar dengan cepat menggunakan akun Google mereka.
- **Recovery:** Fitur "Lupa Password" dan "Reset Password" menggunakan token aman.

### 2. 👤 Manajemen Profil Pengguna (User Profile)

- Mengelola data pribadi pengguna seperti nama lengkap, nomor telepon, tanggal lahir, dan golongan darah. Pengguna dapat memperbarui data ini kapan saja.

### 3. 📸 Pemindaian Mata AI (Eye Scan Prediction)

Ini adalah fitur unggulan Cholestify yang bersifat _non-invasif_.

- **Upload Citra Mata:** Pengguna mengunggah foto mata mereka yang akan langsung diunggah ke _Cloudinary_ melalui _upload stream_ berkecepatan tinggi.
- **Analisis Machine Learning:** URL gambar tersebut kemudian dikirim ke server AI eksternal (FastAPI) untuk dianalisis dan dikembalikan hasilnya (contoh: persentase risiko tinggi/normal) beserta catatan klinisnya.

### 4. 🧪 Pencatatan Kolesterol (Lipid Panel)

- Pengguna dapat menginput hasil tes laboratorium fisik mereka, seperti **Kolesterol Total, LDL, HDL, dan Trigliserida**.
- Menyediakan riwayat kadar lipid sehingga pengguna bisa melihat perkembangan dan fluktuasi kolesterol mereka dari waktu ke waktu.

### 5. 📏 Metrik Tubuh (Biometrics)

- Pencatatan tinggi dan berat badan secara berkala.
- Sistem secara otomatis menghitung nilai **BMI (Body Mass Index)** pengguna setiap kali mereka memperbarui metrik tubuhnya.

### 6. 🎯 Target & Rekomendasi Kesehatan (Health Goals & Recommendations)

- **Penetapan Target (Goals):** Pengguna dapat mengatur target spesifik, seperti target rasio LDL/HDL, batas kalori mingguan, hingga target menit olahraga mingguan.
- **Saran Dinamis:** Aplikasi secara otomatis menarik metrik pengguna (Biometrik dan Lipid) dan menghasilkan rekomendasi spesifik (misal: penyesuaian diet atau peningkatan durasi olahraga) berdasarkan seberapa jauh pengguna dari targetnya.

### 7. 📅 Pencatatan Harian (Daily Tracking)

Memungkinkan pengguna melacak aktivitas harian mereka dan memastikannya selaras dengan Target Mingguan yang ditetapkan.

- Mencatat konsumsi **Kalori, Protein**, serta **Durasi Olahraga** harian.
- Pengguna juga dapat mencatat catatan makanan (_Food Notes_) harian mereka.
- Menyediakan endpoint riwayat (_history_) untuk menampilkan rutinitas historis pengguna.

### 8. 🥗 Rekomendasi Makanan Cerdas (Food Recommendation)

- Fitur ini menyajikan menu diet **150+ master data makanan** yang disesuaikan secara dinamis dengan hasil lab LDL pengguna yang terakhir.
- **Status Makanan:** Makanan diklasifikasikan sebagai `OPTIMAL` (disarankan), `NEUTRAL` (konsumsi wajar), atau `LIMIT` (dihindari). Jika LDL user tinggi, standar rekomendasi akan diperketat.
- **Pagination & Search:** API ini telah dioptimalkan (Production-Ready) dengan sistem _Pagination_ cerdas yang menyertakan filter nama (_Search_) dan filter status.

### 9. 💓 Kalkulator Denyut Jantung (Heart Rate Calculator)

- Menghitung dan memberikan zona detak jantung optimal (misal: _Fat Burn Zone_, _Cardio Zone_) untuk olahraga, menggunakan perhitungan otomatis berdasarkan usia, jenis kelamin, tingkat aktivitas, dan _Resting Heart Rate_.

### 10. 📊 Dashboard (Health Summary)

- Menyajikan ringkasan singkat dalam satu panggilan API (menggabungkan metrik tubuh terkini dan profil lipid terbaru) yang ideal untuk halaman depan aplikasi Frontend.

---

## 🛠️ Tech Stack & Architecture

### Backend (Node.js)
- **Framework:** Node.js, Express.js
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Security:** JWT (JSON Web Tokens), bcryptjs, HTTP-Only Cookies, CORS
- **Cloud Storage:** Cloudinary
- **Data Validation:** Joi
- **Linting & Code Quality:** ESLint, Prettier

### Frontend (Next.js)
- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS / CSS Modules
- **Data Fetching:** Native Fetch API / Axios (dengan konfigurasi `credentials: 'include'`)
- **State Management:** React Hooks, Context API

