
import json, numpy as np, cv2, tensorflow as tf, keras
from tensorflow.keras.applications.efficientnet import preprocess_input as efficientnet_preprocess
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Cholestify AI Eye Scan API", 
    description="""
API ini bertugas menerima gambar mata (retina/kornea) dan mendeteksi indikasi penyakit kolesterol tinggi (Arcus Senilis) menggunakan model Deep Learning **EfficientNetB0**.

**Fitur Utama:**
- 🛡️ **OOD Detection**: Secara otomatis memblokir gambar palsu yang bukan mata manusia.
- ✂️ **Auto Preprocessing**: Memotong area mata secara presisi dan meningkatkan kontras warna (CLAHE).
- ⚡ **Fast Inference**: Menghasilkan persentase probabilitas, status, dan rekomendasi dokter.
""",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    contact={
        "name": "Tim Cholestify AI"
    }
)
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

MODEL_PATH           = "models/cholestify_fase3.keras"
INDICES_PATH         = "class_indices.json"
CONFIDENCE_THRESHOLD = 60.0
MAX_FILE_SIZE        = 10 * 1024 * 1024   # 10 MB

class FocalLoss(tf.keras.losses.Loss):
    def __init__(self, gamma=2.0, alpha=0.25, **kwargs):
        super().__init__(**kwargs); self.gamma=gamma; self.alpha=alpha
    def call(self, y_true, y_pred):
        y_pred=tf.clip_by_value(y_pred,1e-7,1-1e-7)
        ce=-tf.reduce_sum(y_true*tf.math.log(y_pred),axis=-1)
        p_t=tf.reduce_sum(y_true*y_pred,axis=-1)
        return self.alpha*tf.pow(1.0-p_t,self.gamma)*ce
    def get_config(self):
        cfg=super().get_config(); cfg.update({"gamma":self.gamma,"alpha":self.alpha}); return cfg

# === Patch Keras 3: buang parameter usang dari SEMUA layer ===
_orig_layer_init = keras.layers.Layer.__init__
def _patched_layer_init(self, *args, **kwargs):
    kwargs.pop('quantization_config', None)
    kwargs.pop('renorm', None)
    kwargs.pop('renorm_clipping', None)
    kwargs.pop('renorm_momentum', None)
    _orig_layer_init(self, *args, **kwargs)
keras.layers.Layer.__init__ = _patched_layer_init

model = tf.keras.models.load_model(MODEL_PATH, custom_objects={"FocalLoss":FocalLoss}, compile=False)
with open(INDICES_PATH, encoding="utf-8") as f: index_to_class = json.load(f)

LABEL_INFO = {
    "normal":      {"status":"Normal",
                    "keterangan":"Tidak ada indikasi endapan lipid.",
                    "rekomendasi":"Pantau rutin setiap 6 bulan."},
    "beresiko":    {"status":"Indikasi Ringan",
                    "keterangan":"Indikasi awal endapan lipid di kornea perifer.",
                    "rekomendasi":"Tindak lanjut 3-6 bulan, monitor pola makan."},
    "kolesterol":  {"status":"Indikasi Kuat",
                    "keterangan":"Endapan lipid signifikan terdeteksi.",
                    "rekomendasi":"Konsultasi dokter segera, lakukan cek lipid panel."},
    "tidak_pasti": {"status":"Tidak Dapat Dianalisis",
                    "keterangan":"Kualitas foto tidak mencukupi.",
                    "rekomendasi":"Ambil ulang foto sesuai panduan."}
}

# ===================================================================
# OOD DETECTION -- 3 lapis filter sebelum model inference
# ===================================================================
def validate_eye_image(img):
    if img is None:
        return False, "File gambar tidak dapat dibaca."
    h, w = img.shape[:2]

    gray    = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray_bl = cv2.GaussianBlur(gray, (5, 5), 0)
    circles = cv2.HoughCircles(
        gray_bl, cv2.HOUGH_GRADIENT, dp=1.2,
        minDist=int(min(h, w) * 0.3),
        param1=50, param2=28,
        minRadius=int(min(h, w) * 0.08),
        maxRadius=int(min(h, w) * 0.55)
    )
    if circles is None:
        return False, (
            "Tidak terdeteksi struktur mata (iris/pupil). "
            "Pastikan foto menampilkan mata dengan jelas, "
            "pencahayaan cukup, dan mata terbuka penuh."
        )

    x, y, r = np.round(circles[0, 0]).astype(int)
    roi     = img[max(0,y-r):min(h,y+r), max(0,x-r):min(w,x+r)]
    if roi.size == 0:
        return False, "Area mata tidak dapat dianalisis."

    hsv        = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    mask_white = cv2.inRange(hsv, np.array([0,  0,   150]), np.array([180, 60,  255]))
    mask_dark  = cv2.inRange(hsv, np.array([0,  0,   0  ]), np.array([180, 255, 120]))
    eye_ratio  = (cv2.countNonZero(mask_white) + cv2.countNonZero(mask_dark)) / (roi.shape[0]*roi.shape[1])
    if eye_ratio < 0.35:
        return False, (
            "Warna dominan tidak sesuai dengan foto mata. "
            "Pastikan gambar adalah foto mata manusia, bukan objek lain."
        )

    ratio = r / min(h, w)
    if ratio < 0.07:
        return False, "Struktur mata terlalu kecil. Dekatkan kamera ke mata (10-15 cm)."
    if ratio > 0.60:
        return False, "Objek bundar terlalu besar, kemungkinan bukan foto mata."

    return True, "OK"

# ===================================================================
# Preprocessing (crop + CLAHE) -- hanya dipanggil jika lolos OOD
# ===================================================================
def preprocess_image(img, target_size=(240,240)):
    h0, w0 = img.shape[:2]
    if max(h0, w0) > 800:
        s = 800/max(h0,w0); img = cv2.resize(img,(int(w0*s),int(h0*s)))
    rgb  = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray_bl = cv2.GaussianBlur(gray, (7, 7), 0)
    h, w = gray.shape
    circles = cv2.HoughCircles(gray_bl, cv2.HOUGH_GRADIENT, 1.2, 100,
                                param1=50, param2=30,
                                minRadius=int(h*0.1), maxRadius=int(h*0.5))
    if circles is not None:
        x,y,r = np.round(circles[0,0]).astype(int); r = int(r*1.1)
        crop  = rgb[max(0,y-r):min(h,y+r), max(0,x-r):min(w,x+r)]
    else:
        ch,cw = int(h*0.8),int(w*0.8); y1,x1 = (h-ch)//2,(w-cw)//2
        crop  = rgb[y1:y1+ch, x1:x1+cw]
    resized = cv2.resize(crop, target_size)
    lab     = cv2.cvtColor(resized, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    clahe   = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    final   = cv2.cvtColor(cv2.merge((clahe.apply(l),a,b)), cv2.COLOR_LAB2RGB)
    return np.expand_dims(efficientnet_preprocess(final.astype(np.float32)), axis=0)

# ===================================================================
# ENDPOINTS
# ===================================================================
@app.get("/api", tags=["General"], summary="Root API", description="Mengecek identitas dan versi server API saat ini.")
def root(): return {"message": "Cholestify EfficientNetB0 API", "version": "1.0.0"}

@app.get("/api/health", tags=["General"], summary="Server Health Check", description="Mengecek status kesiapan server dan status *load* model AI di memori.")
def health(): return {"status": "ok", "model": "EfficientNetB0", "loaded": model is not None}

@app.post(
    "/api/predict",
    tags=["Prediction"],
    summary="Menganalisis Gambar Mata (Upload Foto)",
    description="""
Endpoint ini menerima **file gambar** (JPG, PNG) maksimal 10MB.
Proses yang terjadi di dalam server:
1. **Validasi File**: Pengecekan tipe gambar dan batasan *size*.
2. **Auto-Resize**: Mengkompres ukuran gambar super besar (>1200px) untuk mencegah *Memory Overflow*.
3. **OOD Check**: Validasi matematis bentuk lingkaran dan rasio warna (*Computer Vision*). Jika terdeteksi bukan mata, akan otomatis ditolak (*Bad Request*).
4. **AI Inference**: Prediksi endapan lipid menggunakan *EfficientNetB0*.
""",
    response_description="Hasil prediksi berupa tingkat persentase kolesterol, status, dan saran medis."
)
def predict(file: UploadFile = File(..., description="File gambar mata (retina/kornea). Harus berformat JPG atau PNG dan terang.")):
    # -- Validasi tipe & ukuran file ------------------------------------
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(400, f"Tipe file tidak didukung: {file.content_type}. Gunakan JPG atau PNG.")
    file.file.seek(0, 2); size = file.file.tell(); file.file.seek(0)
    if size > MAX_FILE_SIZE:
        raise HTTPException(400, "File terlalu besar (maksimal 10MB).")

    image_bytes = file.file.read()
    img = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(400, "File tidak dapat dibaca sebagai gambar.")

    # -- Mencegah RAM Lagging dan Timeout dari HoughCircles --
    h_init, w_init = img.shape[:2]
    if max(h_init, w_init) > 800:
        scale = 800 / max(h_init, w_init)
        img = cv2.resize(img, (int(w_init * scale), int(h_init * scale)))

    # -- OOD Check -------------------------------------------------------
    is_valid, reason = validate_eye_image(img)
    if not is_valid:
        return {
            "success":    False,
            "error_code": "INVALID_IMAGE",
            "result": {
                "label":       "gambar_tidak_valid",
                "status":      "Gambar Tidak Sesuai",
                "confidence":  0.0,
                "keterangan":  reason,
                "rekomendasi": (
                    "Panduan foto yang benar: "
                    "(1) foto adalah mata manusia, "
                    "(2) mata terbuka penuh, "
                    "(3) pencahayaan cukup, "
                    "(4) jarak kamera 10-15 cm dari mata."
                )
            }
        }

    # -- Preprocessing & Inferensi ---------------------------------------
    tensor = preprocess_image(img)
    preds  = model.predict(tensor, verbose=0)[0]
    idx    = str(np.argmax(preds))
    lbl    = index_to_class[idx]
    conf   = round(float(np.max(preds)) * 100, 2)
    ok     = conf >= CONFIDENCE_THRESHOLD
    if not ok: lbl = "tidak_pasti"
    info   = LABEL_INFO[lbl]

    res = {
        "success": True,
        "result": {
            "label":        lbl,
            "status":       info["status"],
            "confidence":   conf,
            "is_confident": ok,
            "keterangan":   info["keterangan"],
            "rekomendasi":  info["rekomendasi"],
            "probabilitas": {
                index_to_class[str(i)]: round(float(p)*100, 2)
                for i, p in enumerate(preds)
            }
        }
    }
    if not ok:
        res["result"]["warning"] = (
            f"Confidence {conf}% di bawah threshold {CONFIDENCE_THRESHOLD}%. "
            "Coba foto ulang dengan kondisi lebih baik."
        )
    return res
