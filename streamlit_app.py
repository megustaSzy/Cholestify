import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

import plotly.express as px
import plotly.graph_objects as go
from scipy.stats import shapiro, levene, ttest_ind, mannwhitneyu, spearmanr
from scipy import stats

import io
import time
import cv2
import keras
from PIL import Image

# ═══ Konfigurasi Halaman ═════════════════════════════════════════════════════════
st.set_page_config(page_title="Cholestify Dashboard", layout="wide")

# ═══ Konstanta ═══════════════════════════════════════════════════════════════════
ALPHA           = 0.05
MAX_DIM         = 800
MAX_FILE_SIZE   = 10 * 1024 * 1024

CAT_ORDER       = ["Normal", "Berisiko", "Kolesterol"]
IMG_SIZE        = (240, 240)
MODEL_PATH      = "model/cholestify_efficientb0_final.h5"
CLASS_NAMES     = ["normal", "beresiko", "kolesterol"]

C_NORMAL        = "#22C55E"
C_BERISIKO      = "#F59E0B"
C_KOLESTEROL    = "#EF4444"

# ═══ CSS ═════════════════════════════════════════════════════════════════════════
st.markdown("""
<style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 800;
        color: #1e293b;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        font-size: 1rem;
        color: #64748b;
        margin-bottom: 1.5rem;
    }
    [data-testid="metric-container"] {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1rem 1.2rem;
    }
    [data-testid="stMetricLabel"] { font-size: 0.8rem; color: #64748b; }
    [data-testid="stMetricValue"] { font-size: 1.8rem; color: #1e293b; }
    .stTabs [data-baseweb="tab-list"] { gap: 6px; }
    .stTabs [data-baseweb="tab"] {
        border-radius: 8px 8px 0 0;
        padding: 8px 20px;
        font-weight: 600;
        font-size: 0.88rem;
    }
    .insight-box {
        background: #f0f9ff;
        border-left: 4px solid #0ea5e9;
        border-radius: 0 8px 8px 0;
        padding: 0.9rem 1.1rem;
        margin-top: 0.8rem;
        font-size: 0.9rem;
        color: #0c4a6e;
        line-height: 1.65;
    }
    .insight-box strong { color: #0369a1; }
    .stat-badge {
        display: inline-block;
        background: #dcfce7;
        color: #166534;
        border-radius: 6px;
        padding: 2px 8px;
        font-size: 0.8rem;
        font-weight: 600;
        margin: 2px;
    }
    .stat-badge.red    { background: #fee2e2; color: #991b1b; }
    .stat-badge.yellow { background: #fef9c3; color: #854d0e; }
    .stat-badge.blue   { background: #dbeafe; color: #1e40af; }
</style>
""", unsafe_allow_html=True)


# ═══ Custom Keras Layers ═══════════════════════════════════════════════════════════════
@keras.saving.register_keras_serializable(package="compat")
class CompatBatchNorm(keras.layers.BatchNormalization):
    """Buang parameter renorm* yang dihapus di Keras 3."""
    def __init__(self, **kwargs):
        kwargs.pop("renorm", None)
        kwargs.pop("renorm_clipping", None)
        kwargs.pop("renorm_momentum", None)
        super().__init__(**kwargs)

    def get_config(self):
        return super().get_config()


@keras.saving.register_keras_serializable(package="compat")
class CompatInputLayer(keras.layers.InputLayer):
    def __init__(self, **kwargs):
        kwargs.pop("optional", None)
        batch_shape = kwargs.pop("batch_shape", None)
        input_shape = kwargs.pop("input_shape", None)
        given_shape = kwargs.pop("shape", None)

        if given_shape is not None:
            final_shape = given_shape
        elif input_shape is not None:
            final_shape = input_shape
        elif batch_shape is not None:
            final_shape = batch_shape[1:]
        else:
            final_shape = list(IMG_SIZE) + [3]

        kwargs["shape"] = final_shape
        super().__init__(**kwargs)

    def get_config(self):
        return super().get_config()


@keras.saving.register_keras_serializable(package="compat")
class CompatDense(keras.layers.Dense):
    def __init__(self, **kwargs):
        kwargs.pop("quantization_config", None)
        super().__init__(**kwargs)

    def get_config(self):
        return super().get_config()


CUSTOM_OBJECTS = {
    "BatchNormalization": CompatBatchNorm,
    "InputLayer":        CompatInputLayer,
    "Dense":             CompatDense,
}


# ═══ Loaders ════════════════════════════════════════════════════════════════════════
@st.cache_data(show_spinner="Memuat data...")
def load_data() -> tuple[pd.DataFrame, pd.DataFrame]:
    """Load kedua dataset CSV. Mengembalikan (df_cholesterol, df_nutrition)."""
    try:
        df_cholesterol = pd.read_csv("data/cholesterol_clean.csv")
        df_nutrition   = pd.read_csv("data/nutrition.csv")
        return df_cholesterol, df_nutrition
    except FileNotFoundError as e:
        st.error(f"❌ File data tidak ditemukan: {e}")
        st.stop()


@st.cache_resource(show_spinner="Memuat model...")
def load_model(path: str):
    """Load model Keras dengan custom objects. Mengembalikan (model, error_str | None)."""
    try:
        model = keras.saving.load_model(
            path,
            custom_objects=CUSTOM_OBJECTS,
            compile=False,
        )
        return model, None
    except Exception as e:
        return None, str(e)


# ═══ Helper ════════════════════════════════════════════════════════════════════════
def ab_test_totchol(group_a: pd.Series, group_b: pd.Series):
    """Pilih uji statistik yang tepat. Mengembalikan (test_name, stat, p_value)."""
    def is_normal(s):
        if len(s) <= 5000:
            return shapiro(s)[1] > ALPHA
        return stats.kstest(s, "norm", args=(s.mean(), s.std()))[1] > ALPHA

    if is_normal(group_a) and is_normal(group_b):
        equal_var = levene(group_a, group_b)[1] > ALPHA
        stat, p   = ttest_ind(group_a, group_b, equal_var=equal_var)
        name      = "Independent t-test" if equal_var else "Welch's t-test"
    else:
        stat, p = mannwhitneyu(group_a, group_b, alternative="two-sided")
        name    = "Mann-Whitney U"

    return name, stat, p

def process_eye_image(
    image_input,
    target_size: tuple[int, int] = IMG_SIZE,
    clip_limit: float = 2.0,
) -> tuple:
    """
    Proses gambar mata untuk prediksi kolesterol.

    Parameters
    ----------
    image_input : file-like object (st.file_uploader) atau numpy array RGB uint8
    target_size : (width, height) output
    clip_limit  : nilai CLAHE clip limit

    Returns
    -------
    (processed_rgb, original_rgb, crop_method, debug_info | error_str)
    """
    if isinstance(image_input, np.ndarray):
        rgb_original = image_input.copy()
    else:
        image_input.seek(0)
        file_bytes   = np.frombuffer(image_input.read(), np.uint8)
        bgr          = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if bgr is None:
            return None, None, None, "Gagal membaca gambar"
        rgb_original = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)

    img    = rgb_original.copy()
    h0, w0 = img.shape[:2]

    if max(h0, w0) > MAX_DIM:
        scale = MAX_DIM / max(h0, w0)
        img   = cv2.resize(img, (int(w0 * scale), int(h0 * scale)), interpolation=cv2.INTER_AREA)

    gray         = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    h, w         = gray.shape
    circles      = cv2.HoughCircles(
        gray, cv2.HOUGH_GRADIENT, 1.2, 100,
        param1=50, param2=30,
        minRadius=int(h * 0.1),
        maxRadius=int(h * 0.5),
    )

    debug_info = {}
    if circles is not None:
        x, y, r = np.round(circles[0, 0]).astype(int)
        r        = int(r * 1.1)
        crop     = img[max(0, y - r):min(h, y + r), max(0, x - r):min(w, x + r)]
        method   = "Hough Circle"
        debug_info["circle"] = (int(x), int(y), int(r))
    else:
        ch, cw = int(h * 0.8), int(w * 0.8)
        y1, x1 = (h - ch) // 2, (w - cw) // 2
        crop   = img[y1:y1 + ch, x1:x1 + cw]
        method = "Center Crop"

    if crop.size == 0:
        return None, rgb_original, None, "Crop kosong — coba gambar lain"

    resized = cv2.resize(crop, target_size, interpolation=cv2.INTER_AREA)

    # CLAHE pada channel L
    lab         = cv2.cvtColor(resized, cv2.COLOR_RGB2LAB)
    l, a, b     = cv2.split(lab)
    clahe       = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(8, 8))
    final       = cv2.cvtColor(cv2.merge((clahe.apply(l), a, b)), cv2.COLOR_LAB2RGB)

    return final, rgb_original, method, debug_info


def prepare_input(processed_img: np.ndarray) -> np.ndarray:
    """
    Kirim nilai [0, 255] sebagai float32.
    Layer Rescaling di dalam model (scale=1/255) yang akan menormalisasi.
    """
    arr = processed_img.astype(np.float32)
    return np.expand_dims(arr, axis=0)  # (1, H, W, 3)


def predict(model, img_array: np.ndarray, class_names: list[str]) -> dict[str, float]:
    """Mengembalikan dict {class_name: probability}."""
    probs = model.predict(img_array, verbose=0)[0]
    return {class_names[i]: float(probs[i]) for i in range(len(class_names))}


def show_comparison(original_rgb: np.ndarray, processed_rgb: np.ndarray, method: str):
    """Tampilkan gambar asli vs processed secara berdampingan."""
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].imshow(original_rgb)
    axes[0].set_title("Gambar Asli", fontsize=13)
    axes[0].axis("off")
    axes[1].imshow(processed_rgb)
    axes[1].set_title(
        f"Processed {processed_rgb.shape[1]}×{processed_rgb.shape[0]}\n({method})",
        fontsize=13,
    )
    axes[1].axis("off")
    plt.tight_layout()
    return fig


# ═══ Session State Init ═════════════════════════════════════════════════════════
if "page" not in st.session_state:
    st.session_state.page = "📊 Cholesterol Data"

if "prediction_history" not in st.session_state:
    st.session_state.prediction_history = []


# ═══ Sidebar ════════════════════════════════════════════════════════════════════
with st.sidebar:
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("### Menu")

    pages = ["📊 Cholesterol Data", "🍔 Food Table", "🔍 Prediction"]
    for page in pages:
        is_active = st.session_state.page == page
        if st.button(page, use_container_width=True, type="primary" if is_active else "secondary"):
            st.session_state.page = page
            st.rerun()

    st.markdown("---")
    st.info("💡 **Tips:** Gunakan halaman 'Prediction' untuk simulasi risiko kolesterol.")


# ═══ Load Data ═════════════════════════════════════════════════════════════════
df_cholesterol, df_nutrition = load_data()


# ════════════════════════════════════════════════════════════════════════════════
# HALAMAN 1: Cholesterol Data
# ════════════════════════════════════════════════════════════════════════════════
if st.session_state.page == "📊 Cholesterol Data":
    st.title("Cholesterol Dashboard")
    st.markdown("Dashboard ini menampilkan tren data terkait dataset kolesterol.")

    tab1, tab2, tab3, tab4, tab5, tab6, tab7 = st.tabs([
        "📊 Overview & EDA",
        "1️⃣ · Prevalensi",
        "2️⃣ · Gender",
        "3️⃣ · Usia",
        "4️⃣ · Hipertensi & Obesitas",
        "5️⃣ · Merokok",
        "6️⃣ · Korelasi Spearman",
    ])

    # TAB 1 · OVERVIEW & EDA
    with tab1:
        st.subheader("📋 Struktur & Distribusi Data")
        # KPI cards
        n_total    = len(df_cholesterol)
        n_kolesterol = (df_cholesterol["catChol"] == "Kolesterol").sum()
        n_berisiko   = (df_cholesterol["catChol"] == "Berisiko").sum()
        n_normal     = (df_cholesterol["catChol"] == "Normal").sum()

        col_left, col_right = st.columns(2)

        with col_left:
            st.markdown("#### Statistik Deskriptif")
            num_cols = ["age", "sysBP", "diaBP", "BMI", "heartRate", "glucose", "totChol"]
            st.dataframe(
                df_cholesterol[num_cols].describe().round(2).T
                .rename(columns={"count": "n", "mean": "mean", "std": "std",
                                "min": "min", "25%": "Q1", "50%": "median",
                                "75%": "Q3", "max": "max"}),
                use_container_width=True, height=290,
            )

        with col_right:
            st.markdown("#### Distribusi Fitur Kategorik")
            cat_cols = ["male", "currentSmoker", "prevalentHyp", "diabetes", "prevalentStroke"]
            cat_labels = {
                "male": "Gender (1=Laki-laki)",
                "currentSmoker": "Perokok",
                "prevalentHyp": "Hipertensi",
                "diabetes": "Diabetes",
                "prevalentStroke": "Stroke",
            }
            rows = []
            for c in cat_cols:
                vc = df_cholesterol[c].value_counts()
                for v, cnt in vc.items():
                    rows.append({"Variabel": cat_labels[c], "Nilai": int(v),
                                "Jumlah": cnt, "Proporsi (%)": f"{cnt/n_total*100:.1f}%"})
            st.dataframe(pd.DataFrame(rows), use_container_width=True, height=290, hide_index=True)

        st.divider()

        # Distribution histograms
        st.markdown("#### Distribusi Variabel Numerik")
        hist_col = st.selectbox("Pilih variabel:", num_cols, index=6)
        fig_hist = px.histogram(
            df_cholesterol, x=hist_col, nbins=30,
            color_discrete_sequence=["#3b82f6"],
            labels={hist_col: hist_col},
            title=f"Distribusi {hist_col}",
            template="plotly_white",
        )
        fig_hist.update_traces(marker_line_color="white", marker_line_width=0.8)
        fig_hist.update_layout(height=360, margin=dict(t=50, b=20))
        st.plotly_chart(fig_hist, use_container_width=True)

        st.divider()

        # Pearson heatmap
        st.markdown("#### Heatmap Korelasi Pearson")
        exclude = ["catChol", "age_group", "bmi_category", "smoking_intensity",
                "glucose_risk", "smoker_x_age"]
        num_for_corr = [c for c in df_cholesterol.columns
                        if c not in exclude and df_cholesterol[c].dtype in ["int64", "float64"]]
        corr_mtx = df_cholesterol[num_for_corr].corr()

        fig_heat = go.Figure(go.Heatmap(
            z=corr_mtx.values.round(2),
            x=corr_mtx.columns.tolist(),
            y=corr_mtx.columns.tolist(),
            colorscale="RdBu_r",
            zmid=0,
            text=corr_mtx.values.round(2),
            texttemplate="%{text}",
            textfont={"size": 8},
            hoverongaps=False,
        ))
        fig_heat.update_layout(
            height=560, margin=dict(t=30, b=20),
            xaxis=dict(tickfont=dict(size=9)),
            yaxis=dict(tickfont=dict(size=9)),
            template="plotly_white",
        )
        st.plotly_chart(fig_heat, use_container_width=True)

        st.markdown("""
        <div class="insight-box">
        <strong>Sumber data:</strong><br>
        <a href="https://www.kaggle.com/datasets/yukeshmarudhasalam/framingham"> Yukesh Marudhasalam - Cholesterol Dataset - <em>Kaggle</em></a>.
        </div>
        """, unsafe_allow_html=True)


    # TAB 2 · PB1 · PREVALENSI
    with tab2:
        st.subheader("PB1 · Seberapa banyak pasien dengan kolesterol tinggi?")

        counts = df_cholesterol["catChol"].value_counts().reindex(CAT_ORDER).fillna(0)

        col1, col2 = st.columns([1, 1])

        with col1:
            fig_pie = go.Figure(go.Pie(
                labels=CAT_ORDER,
                values=counts.values,
                marker_colors=[C_NORMAL, C_BERISIKO, C_KOLESTEROL],
                hole=0.45,
                textinfo="label+percent",
                textfont_size=13,
                hovertemplate="<b>%{label}</b><br>Jumlah: %{value:,}<br>Proporsi: %{percent}<extra></extra>",
            ))
            fig_pie.update_layout(
                title="Proporsi Kategori Kolesterol",
                showlegend=True,
                height=380,
                template="plotly_white",
                margin=dict(t=60, b=20),
            )
            st.plotly_chart(fig_pie, use_container_width=True)

        with col2:
            st.markdown("#### Ringkasan Jumlah")
            for cat, color_hex, bg in zip(
                CAT_ORDER,
                [C_NORMAL, C_BERISIKO, C_KOLESTEROL],
                ["#dcfce7", "#fef9c3", "#fee2e2"],
            ):
                cnt = int(counts[cat])
                pct = cnt / n_total * 100 if n_total else 0
                st.markdown(f"""
                <div style="background:{bg};border-radius:10px;padding:14px 18px;margin-bottom:10px;">
                    <span style="font-size:1.1rem;font-weight:700;color:#1e293b;">{cat}</span><br>
                    <span style="font-size:1.8rem;font-weight:800;color:{color_hex};">{cnt:,}</span>
                    <span style="color:#64748b;font-size:0.9rem;"> pasien &nbsp;·&nbsp; {pct:.1f}%</span>
                </div>
                """, unsafe_allow_html=True)

        st.markdown("""
        <div class="insight-box">
        <strong>Key Insights:</strong><br>
        • Kategori terbanyak adalah <strong>Kolesterol (≥ 240 mg/dL)</strong> — hampir <strong>4 dari 5</strong> pasien memiliki kadar kolesterol di atas batas normal.<br>
        • Hanya <strong>21.2%</strong> pasien yang berada dalam rentang normal (< 200 mg/dL).<br>
        • Kondisi ini mengindikasikan prevalensi kolesterol yang sangat signifikan pada populasi dataset ini.
        </div>
        """, unsafe_allow_html=True)


    # TAB 3 · PB2 · GENDER
    with tab3:
        st.subheader("PB2 · Perbedaan risiko kolesterol antara laki-laki dan perempuan")

        # Pivot
        pivot_g = (
            df_cholesterol.groupby("male")["catChol"]
            .value_counts(normalize=True).mul(100).rename("Pct")
            .reset_index()
        )
        pivot_g["Gender"] = pivot_g["male"].map({0: "Perempuan", 1: "Laki-laki"})
        pivot_g_wide = (
            pivot_g.pivot(index="Gender", columns="catChol", values="Pct")
            .reindex(columns=CAT_ORDER).fillna(0).round(2)
        )
        pivot_g_cnt = (
            df_cholesterol.groupby("male")["catChol"]
            .value_counts().rename("Cnt").reset_index()
        )
        pivot_g_cnt["Gender"] = pivot_g_cnt["male"].map({0: "Perempuan", 1: "Laki-laki"})
        pivot_g_cnt_wide = (
            pivot_g_cnt.pivot(index="Gender", columns="catChol", values="Cnt")
            .reindex(columns=CAT_ORDER).fillna(0).astype(int)
        )

        col1, col2 = st.columns(2)

        with col1:
            fig_bar_g = go.Figure()
            for cat, color in zip(CAT_ORDER, [C_NORMAL, C_BERISIKO, C_KOLESTEROL]):
                fig_bar_g.add_trace(go.Bar(
                    name=cat,
                    x=pivot_g_wide.index.tolist(),
                    y=pivot_g_cnt_wide[cat].values,
                    marker_color=color,
                    text=pivot_g_cnt_wide[cat].values,
                    textposition="outside",
                ))
            fig_bar_g.update_layout(
                barmode="group",
                title="Frekuensi catChol per Gender",
                yaxis_title="Jumlah Pasien",
                template="plotly_white",
                height=380,
                legend=dict(orientation="h", y=1.12),
                margin=dict(t=70, b=20),
            )
            st.plotly_chart(fig_bar_g, use_container_width=True)

        with col2:
            fig_bar_g2 = go.Figure()
            for cat, color in zip(CAT_ORDER, [C_NORMAL, C_BERISIKO, C_KOLESTEROL]):
                fig_bar_g2.add_trace(go.Bar(
                    name=cat,
                    x=pivot_g_wide.index.tolist(),
                    y=pivot_g_wide[cat].values,
                    marker_color=color,
                    text=[f"{v:.1f}%" for v in pivot_g_wide[cat].values],
                    textposition="inside",
                    textfont_color="white",
                ))
            fig_bar_g2.update_layout(
                barmode="stack",
                title="Proporsi (%) catChol per Gender",
                yaxis_title="Proporsi (%)",
                template="plotly_white",
                height=380,
                legend=dict(orientation="h", y=1.12),
                margin=dict(t=70, b=20),
            )
            st.plotly_chart(fig_bar_g2, use_container_width=True)

        # A/B Testing
        st.markdown("#### 🧪 A/B Testing – totChol: Perempuan vs Laki-laki")
        perempuan = df_cholesterol[df_cholesterol["male"] == 0]["totChol"].dropna()
        laki_laki = df_cholesterol[df_cholesterol["male"] == 1]["totChol"].dropna()

        if len(perempuan) > 1 and len(laki_laki) > 1:
            test_name, stat, p_val = ab_test_totchol(perempuan, laki_laki)

            ab1, ab2, ab3, ab4 = st.columns(4)
            ab1.metric("Metode Uji",         test_name)
            ab2.metric("Mean Perempuan",     f"{perempuan.mean():.2f}")
            ab3.metric("Mean Laki-laki",     f"{laki_laki.mean():.2f}")
            ab4.metric("p-value",            f"{p_val:.4f}",
                    delta="Tolak H₀ ✅" if p_val < ALPHA else "Gagal Tolak H₀",
                    delta_color="normal" if p_val < ALPHA else "off")

            verdict = "**Tolak H₀** — ada perbedaan signifikan rata-rata totChol antar gender." \
                    if p_val < ALPHA else \
                    "**Gagal Tolak H₀** — tidak ada perbedaan signifikan."
            st.info(f"α = {ALPHA} | {verdict}")
        else:
            st.warning("Data tidak cukup untuk A/B Testing dengan filter saat ini.")

        st.markdown("""
        <div class="insight-box">
        <strong>Key Insights:</strong><br>
        • <strong>Perempuan</strong> mayoritas berada di kategori kolesterol (≈ 46%), distribusi condong ke risiko tinggi.<br>
        • <strong>Laki-laki</strong> memiliki pola lebih merata antara kategori <em>Berisiko</em> (39.99%) dan <em>Kolesterol</em> (38.77%) hampir seimbang.<br>
        • A/B Testing (α = 0.05) membuktikan perbedaan rata-rata totChol antar gender <strong>signifikan secara statistik</strong>.
        </div>
        """, unsafe_allow_html=True)


    # TAB 4 · PB3 · USIA
    with tab4:
        st.subheader("PB3 · Apakah kelompok usia tertentu lebih rentan kolesterol?")

        age_order = ["< 35", "35-55", "> 55"]
        pivot_age = (
            df_cholesterol.groupby("age_group", observed=True)["catChol"]
            .value_counts(normalize=True).mul(100).rename("Proporsi")
            .reset_index()
        )
        pivot_age_wide = (
            pivot_age.pivot(index="age_group", columns="catChol", values="Proporsi")
            .reindex(index=age_order, columns=CAT_ORDER).fillna(0)
        )

        col1, col2 = st.columns([3, 2])

        with col1:
            fig_stacked = go.Figure()
            for cat, color in zip(CAT_ORDER, [C_NORMAL, C_BERISIKO, C_KOLESTEROL]):
                vals = [pivot_age_wide.loc[ag, cat] if ag in pivot_age_wide.index else 0
                        for ag in age_order]
                fig_stacked.add_trace(go.Bar(
                    name=cat, x=age_order, y=vals,
                    marker_color=color,
                    text=[f"{v:.1f}%" for v in vals],
                    textposition="inside",
                    textfont_color="white",
                ))
            fig_stacked.update_layout(
                barmode="stack",
                title="Proporsi catChol per Kelompok Usia",
                xaxis_title="Kelompok Usia",
                yaxis_title="Proporsi (%)",
                template="plotly_white",
                height=400,
                legend=dict(orientation="h", y=1.12),
                margin=dict(t=70, b=20),
            )
            st.plotly_chart(fig_stacked, use_container_width=True)

        with col2:
            age_mean = (
                df_cholesterol.groupby("age_group", observed=True)["totChol"]
                .mean().reindex(age_order).round(1).reset_index()
            )
            age_mean.columns = ["Kelompok Usia", "Mean totChol (mg/dL)"]
            fig_line = px.bar(
                age_mean, x="Kelompok Usia", y="Mean totChol (mg/dL)",
                color="Mean totChol (mg/dL)",
                color_continuous_scale=["#22C55E", "#F59E0B", "#EF4444"],
                text="Mean totChol (mg/dL)",
                template="plotly_white",
                height=400,
            )
            fig_line.update_traces(textposition="outside")
            fig_line.update_layout(
                title="Rata-rata totChol per Kelompok Usia",
                coloraxis_showscale=False, 
                margin=dict(t=70, b=20)
            )
            st.plotly_chart(fig_line, use_container_width=True)

        # Scatter age vs totChol
        st.markdown("#### Scatter: Usia vs Total Kolesterol")
        fig_scatter = px.scatter(
            df_cholesterol.sample(min(1500, len(df_cholesterol)), random_state=1),
            x="age", y="totChol", color="catChol",
            color_discrete_map={
                "Normal": C_NORMAL,
                "Berisiko": C_BERISIKO,
                "Kolesterol": C_KOLESTEROL,
            },
            trendline="ols",
            labels={"age": "Usia (tahun)", "totChol": "Total Kolesterol (mg/dL)"},
            template="plotly_white",
            height=380,
            opacity=0.55,
        )
        fig_scatter.update_layout(margin=dict(t=40, b=20))
        st.plotly_chart(fig_scatter, use_container_width=True)

        st.markdown("""
        <div class="insight-box">
        <strong>Key Insights:</strong><br>
        • Kelompok <strong>&lt; 35 tahun</strong>: 66.67% normal (kelompok paling sehat). Hanya 8.33% yang termasuk kategori kolesterol.<br>
        • Kelompok <strong>35–55 tahun</strong>: terjadi pergeseran signifikan dengan proporsi normal turun ke ≈ 24%, kolesterol naik ke ≈ 38%.<br>
        • Kelompok <strong>&gt; 55 tahun</strong>: &gt; sebagian besar (55.64%) berada di kategori kolesterol, kelompok dengan risiko tertinggi.<br>
        • Tren linier positif antara usia dan totChol terlihat jelas (Spearman r ≈ 0.29).
        </div>
        """, unsafe_allow_html=True)


    # TAB 5 · PB4 · HIPERTENSI & OBESITAS
    with tab5:
        st.subheader("PB4 · Apakah hipertensi dan obesitas memperburuk risiko kolesterol?")

        # Chart 1 – Stacked bar by highBP
        pivot_bp = (
            df_cholesterol.groupby("highBP")["catChol"]
            .value_counts(normalize=True).mul(100).rename("Pct")
            .reset_index()
        )
        pivot_bp["Hipertensi"] = pivot_bp["highBP"].map({0: "Tanpa Hipertensi", 1: "Hipertensi"})
        pivot_bp_wide = (
            pivot_bp.pivot(index="Hipertensi", columns="catChol", values="Pct")
            .reindex(columns=CAT_ORDER)
        )

        col1, col2 = st.columns(2)

        with col1:
            fig_bp = go.Figure()
            for cat, color in zip(CAT_ORDER, [C_NORMAL, C_BERISIKO, C_KOLESTEROL]):
                idx = ["Tanpa Hipertensi", "Hipertensi"]
                vals = [pivot_bp_wide.loc[i, cat] if i in pivot_bp_wide.index else 0 for i in idx]
                fig_bp.add_trace(go.Bar(
                    name=cat, x=idx, y=vals,
                    marker_color=color,
                    text=[f"{v:.1f}%" for v in vals],
                    textposition="inside",
                    textfont_color="white",
                ))
            fig_bp.update_layout(
                barmode="stack",
                title="Proporsi catChol per Status Hipertensi",
                yaxis_title="Proporsi (%)",
                template="plotly_white",
                height=360,
                legend=dict(orientation="h", y=1.12),
                margin=dict(t=70, b=20),
            )
            st.plotly_chart(fig_bp, use_container_width=True)

        with col2:
            # Heatmap BP × BMI
            bmi_order = ["Underweight", "Normal", "Overweight", "Obese"]
            heatmap_data = (
                df_cholesterol.groupby(["highBP", "bmi_category"], observed=True)["totChol"]
                .mean().unstack()
                .reindex(columns=bmi_order)
                .round(1)
            )
            heatmap_data.index = ["Tanpa Hipertensi", "Hipertensi"]

            fig_hm = go.Figure(go.Heatmap(
                z=heatmap_data.values,
                x=heatmap_data.columns.tolist(),
                y=heatmap_data.index.tolist(),
                colorscale="RdYlGn_r",
                text=heatmap_data.values,
                texttemplate="%{text:.1f}",
                textfont={"size": 13},
                hoverongaps=False,
                colorbar=dict(title="Mean totChol"),
            ))
            fig_hm.update_layout(
                title="Rata-rata totChol: Hipertensi × BMI Category",
                xaxis_title="BMI Category",
                template="plotly_white",
                height=360,
                margin=dict(t=60, b=20),
            )
            st.plotly_chart(fig_hm, use_container_width=True)

        # Chart 3 – Obesitas × Hipertensi
        st.markdown("#### Kombinasi Obesitas & Hipertensi")
        pivot_oxh = (
            df_cholesterol.groupby("obese_x_hyp")["catChol"]
            .value_counts(normalize=True).mul(100).rename("Pct")
            .reset_index()
        )
        pivot_oxh["Grup"] = pivot_oxh["obese_x_hyp"].map({
            0: "Tidak Obesitas\n& Tidak HT",
            1: "Obesitas\n& Hipertensi",
        })
        pivot_oxh_kol = (
            pivot_oxh[pivot_oxh["catChol"] == "Kolesterol"]
            .set_index("Grup")["Pct"]
        )

        fig_combo = go.Figure(go.Bar(
            x=pivot_oxh_kol.index.tolist(),
            y=pivot_oxh_kol.values,
            marker_color=["#f59e0b", "#ef4444"],
            text=[f"{v:.1f}%" for v in pivot_oxh_kol.values],
            textposition="outside",
            width=0.4,
        ))
        fig_combo.update_layout(
            title="% Pasien Kolesterol: Kombinasi Obesitas & Hipertensi",
            yaxis_title="Proporsi Kolesterol (%)",
            template="plotly_white",
            height=360,
            margin=dict(t=60, b=20),
        )
        st.plotly_chart(fig_combo, use_container_width=True)

        st.markdown("""
        <div class="insight-box">
        <strong>Key Insights:</strong><br>
        • Penderita <strong>hipertensi</strong> memiliki proporsi kolesterol lebih besar (≈ 52% vs 38%) daripada yang tidak ada riwayat hipertensi.<br>
        • <strong>Heatmap</strong>: Kombinasi terburuk adalah <em>Hipertensi + Overweight</em> (mean totChol ≈ 247 mg/dL); terbaik adalah <em>Tanpa Hipertensi + Normal BMI</em> (≈ 227 mg/dL).<br>
        • Individu dengan <strong>obesitas sekaligus hipertensi</strong> memiliki proporsi kolesterol hingga <strong>55.7%</strong>, jauh lebih tinggi dibanding kelompok tanpa kedua kondisi tersebut.
        </div>
        """, unsafe_allow_html=True)


    # TAB 6 · PB5 · MEROKOK
    with tab6:
        st.subheader("PB5 · Perbedaan risiko kolesterol antara perokok dan non-perokok")

        pivot_smoke_age = (
            df_cholesterol.groupby(["age_group", "currentSmoker"], observed=True)["totChol"]
            .mean().unstack()
        )
        pivot_smoke_age.index = pd.CategoricalIndex(
            pivot_smoke_age.index, categories=["< 35", "35-55", "> 55"], ordered=True
        )
        pivot_smoke_age = pivot_smoke_age.sort_index()
        pivot_smoke_age.columns = ["Non-Smoker", "Smoker"]

        col1, col2 = st.columns(2)

        with col1:
            x_idx = pivot_smoke_age.index.astype(str).tolist()
            fig_smoke = go.Figure()
            for col_name, color in [("Non-Smoker", "#2ecc71"), ("Smoker", "#e74c3c")]:
                if col_name in pivot_smoke_age.columns:
                    fig_smoke.add_trace(go.Bar(
                        name=col_name,
                        x=x_idx,
                        y=pivot_smoke_age[col_name].values,
                        marker_color=color,
                        text=[f"{v:.1f}" for v in pivot_smoke_age[col_name].values],
                        textposition="outside",
                    ))
            fig_smoke.update_layout(
                barmode="group",
                title="Rata-rata totChol per Kelompok Usia",
                xaxis_title="Kelompok Usia",
                yaxis_title="Rata-rata totChol (mg/dL)",
                template="plotly_white",
                height=380,
                legend=dict(orientation="h", y=1.12),
                margin=dict(t=80, b=20),
            )
            st.plotly_chart(fig_smoke, use_container_width=True)

        with col2:
            # Age distribution by smoker status
            age_ns = df_cholesterol[df_cholesterol["currentSmoker"] == 0]["age"]
            age_s  = df_cholesterol[df_cholesterol["currentSmoker"] == 1]["age"]

            fig_age_dist = go.Figure()
            fig_age_dist.add_trace(go.Histogram(
                x=age_ns, name=f"Non-Smoker (mean={age_ns.mean():.1f})",
                marker_color="#2ecc71", opacity=0.65, nbinsx=30,
            ))
            fig_age_dist.add_trace(go.Histogram(
                x=age_s, name=f"Smoker (mean={age_s.mean():.1f})",
                marker_color="#e74c3c", opacity=0.65, nbinsx=30,
            ))
            fig_age_dist.add_vline(x=age_ns.mean(), line_dash="dash",
                                line_color="#27ae60", annotation_text="Mean NS")
            fig_age_dist.add_vline(x=age_s.mean(), line_dash="dash",
                                line_color="#c0392b", annotation_text="Mean S")
            fig_age_dist.update_layout(
                barmode="overlay",
                title="Distribusi Usia: Smoker vs Non-Smoker",
                xaxis_title="Usia",
                yaxis_title="Frekuensi",
                template="plotly_white",
                height=380,
                legend=dict(orientation="h", y=1.12),
                margin=dict(t=80, b=20),
            )
            st.plotly_chart(fig_age_dist, use_container_width=True)

        

        st.markdown("""
        <div class="insight-box">
        <strong>Key Insights:</strong><br>
        • Tidak terlihat perbedaan signifikan rata-rata totChol antara perokok dan non-perokok <em>dalam kelompok usia yang sama</em>.<br>
        • <strong>Confounding variable terungkap</strong>: perokok pada dataset ini rata-rata <em>lebih muda</em> dibanding non-perokok, sehingga secara keseluruhan kolesterol perokok tampak lebih rendah.<br>
        • Efek merokok terhadap kolesterol tidak dapat disimpulkan secara kausal dari observasi ini tanpa mengontrol variabel usia terlebih dahulu.
        </div>
        """, unsafe_allow_html=True)


    # TAB 7 · PB6 · SPEARMAN CORRELATION
    with tab7:
        st.subheader("PB6 · Faktor yang paling kuat berhubungan dengan total kolesterol")

        exclude_cols = ["catChol", "age_group", "bmi_category", "smoking_intensity",
                        "glucose_risk", "totChol"]
        numeric_cols = [c for c in df_cholesterol.columns
                        if c not in exclude_cols and df_cholesterol[c].dtype in ["int64", "float64"]]

        label_map = {
            "age": "Usia", "sysBP": "sysBP", "diaBP": "diaBP",
            "pulse_pressure": "Pulse Pressure", "bp_ratio": "BP Ratio",
            "BMI": "BMI", "heartRate": "Heart Rate", "glucose": "Glucose",
            "cigsPerDay": "Cigs/Day", "male": "Gender (Male)",
            "currentSmoker": "Merokok", "BPMeds": "BP Meds",
            "prevalentStroke": "Stroke", "prevalentHyp": "Hipertensi",
            "diabetes": "Diabetes", "highBP": "High BP",
            "hyp_x_diabetes": "Hipertensi×Diabetes",
            "smoker_x_age": "Smoker×Usia", "obese_x_hyp": "Obesitas×HT",
        }

        spearman_results = {}
        for col in numeric_cols:
            r, p = spearmanr(df_cholesterol[col], df_cholesterol["totChol"], nan_policy="omit")
            spearman_results[label_map.get(col, col)] = {"r": r, "p": p}

        spearman_df = pd.DataFrame(spearman_results).T.reset_index()
        spearman_df.columns = ["Faktor", "Spearman r", "p-value"]
        spearman_df["abs_r"] = spearman_df["Spearman r"].abs()
        spearman_df = spearman_df.nlargest(15, "abs_r").sort_values("Spearman r")

        fig_spearman = go.Figure(go.Bar(
            x=spearman_df["Spearman r"],
            y=spearman_df["Faktor"],
            orientation="h",
            marker_color=["#EF4444" if v >= 0 else "#3B82F6"
                        for v in spearman_df["Spearman r"]],
            text=[f"r = {v:.3f}" for v in spearman_df["Spearman r"]],
            textposition="outside",
            hovertemplate="<b>%{y}</b><br>Spearman r: %{x:.3f}<extra></extra>",
        ))
        fig_spearman.add_vline(x=0, line_width=1, line_color="black")
        fig_spearman.add_vline(x=0.3,  line_dash="dot", line_color="gray",
                            annotation_text="r=0.3", annotation_position="top right")
        fig_spearman.add_vline(x=-0.3, line_dash="dot", line_color="gray",
                            annotation_text="r=-0.3", annotation_position="top left")
        fig_spearman.update_layout(
            title="Rangkuman Kekuatan Faktor Risiko (Top 15 Spearman Correlation vs totChol)",
            xaxis_title="Spearman r",
            template="plotly_white",
            height=520,
            margin=dict(t=60, b=20, l=180),
        )
        st.plotly_chart(fig_spearman, use_container_width=True)

        # Table
        st.markdown("#### Tabel Lengkap Spearman Correlation")
        display_df = (
            spearman_df[["Faktor", "Spearman r", "p-value"]]
            .sort_values("Spearman r", ascending=False)
            .reset_index(drop=True)
        )
        display_df["Spearman r"] = display_df["Spearman r"].round(4)
        display_df["p-value"]    = display_df["p-value"].apply(lambda x: f"{x:.4f}")
        display_df["Interpretasi"] = display_df["Spearman r"].apply(
            lambda r: "🔴 Lemah-Sedang Positif" if r >= 0.2
            else ("🟡 Lemah Positif" if r > 0
                else ("🔵 Lemah Negatif" if r > -0.2
                        else "🟣 Lemah-Sedang Negatif"))
        )
        st.dataframe(display_df, use_container_width=True, hide_index=True, height=460)

        st.markdown("""
        <div class="insight-box">
        <strong>Key Insights:</strong><br>
        • <strong>Usia</strong> (r ≈ 0.29) adalah faktor paling dominan, semakin tua semakin tinggi pula risiko kolesterol.<br>
        • Variabel <strong>kardiovaskular</strong> (<code>sysBP</code>, <code>diaBP</code>, <code>Pulse Pressure</code>, <code>High BP</code>, <code>Hipertensi</code>) mendominasi daftar korelasi positif.<br>
        • <strong>Gender laki-laki</strong> berkorelasi <em>negatif</em>, sementara perempuan cenderung memiliki totChol lebih tinggi.<br>
        • Semua nilai r < 0.30, mengonfirmasi bahwa kolesterol bersifat <strong>multifaktorial</strong> dan tidak bisa dijelaskan oleh satu faktor tunggal.
        </div>
        """, unsafe_allow_html=True)

# ════════════════════════════════════════════════════════════════════════════════
# HALAMAN 2: Food Table
# ════════════════════════════════════════════════════════════════════════════════
elif st.session_state.page == "🍔 Food Table":
    st.title("Food Table Dashboard")
    st.markdown("Dashboard ini menampilkan tren data terkait pantangan makanan bagi penderita kolesterol.")
    st.dataframe(df_nutrition, use_container_width=True)


# ════════════════════════════════════════════════════════════════════════════════
# HALAMAN 3: Prediction
# ════════════════════════════════════════════════════════════════════════════════
elif st.session_state.page == "🔍 Prediction":
    st.title("Prediksi Risiko Kolesterol")
    st.markdown("Masukkan gambar mata untuk memprediksi tingkat risiko kolesterol secara real-time.")

    col1, col2, col3 = st.columns(3)
    with col1:
        clip_limit = st.slider("CLAHE Clip Limit", 1.0, 4.0, 2.0, 0.5)
    with col2:
        target_w = st.number_input("Target Width",  value=IMG_SIZE[0], step=8)
    with col3:
        target_h = st.number_input("Target Height", value=IMG_SIZE[1], step=8)
    target_size = (int(target_w), int(target_h))

    # Load model
    model, model_err = load_model(MODEL_PATH)

    if model:
        st.success("✅ Model berhasil dimuat")
        with st.expander("Info model"):
            buf = io.StringIO()
            model.summary(print_fn=lambda x: buf.write(x + "\n"))
            st.code(buf.getvalue(), language="text")
    else:
        st.warning(f"⚠️ Model tidak dimuat: {model_err}")

    # Upload gambar
    uploaded_files = st.file_uploader(
        "Upload gambar mata (JPG / PNG)",
        type=["jpg", "jpeg", "png"],
        accept_multiple_files=True,
    )

    if not uploaded_files:
        st.info("📂 Belum ada gambar diupload")

    for uploaded_file in uploaded_files:
        # Validasi ukuran file
        if uploaded_file.size > MAX_FILE_SIZE:
            st.warning(f"⚠️ `{uploaded_file.name}` melebihi batas 10 MB — dilewati.")
            continue

        st.markdown(f"---\n### 🖼️ `{uploaded_file.name}`")
        col_img, col_result = st.columns([1.3, 1], gap="large")

        with st.spinner("Memproses gambar…"):
            processed, original, method, debug = process_eye_image(
                uploaded_file,
                target_size=target_size,
                clip_limit=clip_limit,
            )

        if processed is None:
            st.error(f"❌ {debug}")
            continue

        with col_img:
            fig = show_comparison(original, processed, method)
            st.pyplot(fig, use_container_width=True)
            plt.close(fig)

            badge = "🟢" if method == "Hough Circle" else "🟡"
            st.caption(f"{badge} Crop method: **{method}**")
            if isinstance(debug, dict) and "circle" in debug:
                x, y, r = debug["circle"]
                st.caption(f"Lingkaran — pusat ({x}, {y}), radius {r}px")


        with col_result:
            st.subheader("📊 Hasil Prediksi")
            img_array = prepare_input(processed)

            if model:
                with st.spinner("Inferensi…"):
                    t0      = time.time()
                    results = predict(model, img_array, CLASS_NAMES)
                    elapsed = time.time() - t0

                top_class = max(results, key=results.get)
                top_conf  = results[top_class]

                badge_map = {"normal": "🟢", "beresiko": "🟡", "kolesterol": "🔴"}
                badge     = badge_map.get(top_class.lower(), "⚪")
                st.metric("Prediksi", f"{badge} {top_class}", f"{top_conf:.1%} confidence")
                st.caption(
                    f"Waktu inferensi: {elapsed * 1000:.1f} ms  |  "
                    f"Params — clip_limit={clip_limit}, size={target_size}"
                )

                st.markdown("**Distribusi probabilitas:**")
                for cls, conf in sorted(results.items(), key=lambda x: -x[1]):
                    b = badge_map.get(cls.lower(), "⚪")
                    st.progress(conf, text=f"{b} {cls}: {conf:.1%}")

            else:
                st.info("Model tidak dimuat — shape tensor input:")
                st.code(
                    f"shape = {img_array.shape}  # (batch, H, W, C)\n"
                    f"dtype = {img_array.dtype}\n"
                    f"range = [{img_array.min():.1f}, {img_array.max():.1f}]"
                )

            # Download hasil preprocessing
            buf = io.BytesIO()
            Image.fromarray(processed).save(buf, format="PNG")
            st.download_button(
                "⬇️ Download Processed Image",
                data=buf.getvalue(),
                file_name=f"processed_{uploaded_file.name}",
                mime="image/png",
            )
