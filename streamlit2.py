import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from scipy.stats import shapiro, levene, ttest_ind, mannwhitneyu, spearmanr
from scipy import stats

# ── Page config ────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Dashboard Analisis Kolesterol",
    page_icon="🫀",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ─────────────────────────────────────────────────────────────────
st.markdown("""
<style>
    /* Main header */
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

    /* Metric cards */
    [data-testid="metric-container"] {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1rem 1.2rem;
    }
    [data-testid="stMetricLabel"] { font-size: 0.8rem; color: #64748b; }
    [data-testid="stMetricValue"] { font-size: 1.8rem; color: #1e293b; }

    /* Tab styling */
    .stTabs [data-baseweb="tab-list"] { gap: 6px; }
    .stTabs [data-baseweb="tab"] {
        border-radius: 8px 8px 0 0;
        padding: 8px 20px;
        font-weight: 600;
        font-size: 0.88rem;
    }

    /* Insight box */
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

    /* Stat box */
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
    .stat-badge.red { background: #fee2e2; color: #991b1b; }
    .stat-badge.yellow { background: #fef9c3; color: #854d0e; }
    .stat-badge.blue { background: #dbeafe; color: #1e40af; }
</style>
""", unsafe_allow_html=True)

# ── Colour palette ─────────────────────────────────────────────────────────────
C_NORMAL    = "#22C55E"
C_BERISIKO  = "#F59E0B"
C_KOLESTEROL = "#EF4444"
ALPHA = 0.05

# ── Data generation (reproduces notebook logic on synthetic data) ───────────────
df = pd.read_csv("data/df_eda.csv")
cat_order = ["Normal", "Berisiko", "Kolesterol"]

# ── Helpers ────────────────────────────────────────────────────────────────────
def ab_test_totchol(group_a: pd.Series, group_b: pd.Series):
    """Returns (test_name, stat, p_value)."""
    normal_a = shapiro(group_a)[1] > ALPHA if len(group_a) <= 5000 else \
               stats.kstest(group_a, "norm", args=(group_a.mean(), group_a.std()))[1] > ALPHA
    normal_b = shapiro(group_b)[1] > ALPHA if len(group_b) <= 5000 else \
               stats.kstest(group_b, "norm", args=(group_b.mean(), group_b.std()))[1] > ALPHA

    if normal_a and normal_b:
        var_same = levene(group_a, group_b)[1] > ALPHA
        if var_same:
            stat, p = ttest_ind(group_a, group_b, equal_var=True)
            return "Independent t-test", stat, p
        else:
            stat, p = ttest_ind(group_a, group_b, equal_var=False)
            return "Welch's t-test", stat, p
    else:
        stat, p = mannwhitneyu(group_a, group_b, alternative="two-sided")
        return "Mann-Whitney U", stat, p

df_f = df.copy()

# ══════════════════════════════════════════════════════════════════════════════
# HEADER
# ══════════════════════════════════════════════════════════════════════════════
st.markdown('<p class="main-title">🫀 Dashboard Analisis Risiko Kolesterol</p>', unsafe_allow_html=True)
st.markdown('<p class="sub-title">Exploratory & Explanatory Analysis · Framingham Heart Study</p>', unsafe_allow_html=True)



st.divider()

# ══════════════════════════════════════════════════════════════════════════════
# TABS
# ══════════════════════════════════════════════════════════════════════════════
tab1, tab2, tab3, tab4, tab5, tab6, tab7 = st.tabs([
    "📊 Overview & EDA",
    "🥧 PB1 · Prevalensi",
    "⚧️ PB2 · Gender",
    "👴 PB3 · Usia",
    "🩺 PB4 · Hipertensi & Obesitas",
    "🚬 PB5 · Merokok",
    "🔗 PB6 · Korelasi Spearman",
])


# TAB 1 · OVERVIEW & EDA
with tab1:
    st.subheader("📋 Struktur & Distribusi Data")
    # KPI cards
    n_total    = len(df_f)
    n_kolesterol = (df_f["catChol"] == "Kolesterol").sum()
    n_berisiko   = (df_f["catChol"] == "Berisiko").sum()
    n_normal     = (df_f["catChol"] == "Normal").sum()

    col_left, col_right = st.columns(2)

    with col_left:
        st.markdown("#### Statistik Deskriptif")
        num_cols = ["age", "sysBP", "diaBP", "BMI", "heartRate", "glucose", "totChol"]
        st.dataframe(
            df_f[num_cols].describe().round(2).T
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
            vc = df_f[c].value_counts()
            for v, cnt in vc.items():
                rows.append({"Variabel": cat_labels[c], "Nilai": int(v),
                             "Jumlah": cnt, "Proporsi (%)": f"{cnt/n_total*100:.1f}%"})
        st.dataframe(pd.DataFrame(rows), use_container_width=True, height=290, hide_index=True)

    st.divider()

    # Distribution histograms
    st.markdown("#### Distribusi Variabel Numerik")
    hist_col = st.selectbox("Pilih variabel:", num_cols, index=6)
    fig_hist = px.histogram(
        df_f, x=hist_col, nbins=30,
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
    num_for_corr = [c for c in df_f.columns
                    if c not in exclude and df_f[c].dtype in ["int64", "float64"]]
    corr_mtx = df_f[num_for_corr].corr()

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
    <strong>Key Insights:</strong><br>
    • Variabel yang berkorelasi <strong>positif</strong> terhadap <code>totChol</code>: <code>prevalentHyp</code>, <code>age</code>, <code>sysBP</code>, <code>diaBP</code>, <code>BMI</code>, <code>heartRate</code> — dengan <code>age</code> tertinggi (r ≈ 0.27).<br>
    • Variabel yang berkorelasi <strong>negatif</strong>: <code>male</code>, <code>currentSmoker</code>, <code>cigsPerDay</code>, <code>glucose</code>, <code>diabetes</code> — semua sangat lemah (r < −0.08).<br>
    • Tidak ada variabel yang berkorelasi <strong>kuat</strong> (r < 0.30), mengindikasikan kolesterol bersifat <em>multifaktorial</em>.
    </div>
    """, unsafe_allow_html=True)


# TAB 2 · PB1 · PREVALENSI
with tab2:
    st.subheader("PB1 · Seberapa banyak pasien dengan kolesterol tinggi?")

    counts = df_f["catChol"].value_counts().reindex(cat_order).fillna(0)

    col1, col2 = st.columns([1, 1])

    with col1:
        fig_pie = go.Figure(go.Pie(
            labels=cat_order,
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
            cat_order,
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
        df_f.groupby("male")["catChol"]
        .value_counts(normalize=True).mul(100).rename("Pct")
        .reset_index()
    )
    pivot_g["Gender"] = pivot_g["male"].map({0: "Perempuan", 1: "Laki-laki"})
    pivot_g_wide = (
        pivot_g.pivot(index="Gender", columns="catChol", values="Pct")
        .reindex(columns=cat_order).fillna(0).round(2)
    )
    pivot_g_cnt = (
        df_f.groupby("male")["catChol"]
        .value_counts().rename("Cnt").reset_index()
    )
    pivot_g_cnt["Gender"] = pivot_g_cnt["male"].map({0: "Perempuan", 1: "Laki-laki"})
    pivot_g_cnt_wide = (
        pivot_g_cnt.pivot(index="Gender", columns="catChol", values="Cnt")
        .reindex(columns=cat_order).fillna(0).astype(int)
    )

    col1, col2 = st.columns(2)

    with col1:
        fig_bar_g = go.Figure()
        for cat, color in zip(cat_order, [C_NORMAL, C_BERISIKO, C_KOLESTEROL]):
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
        for cat, color in zip(cat_order, [C_NORMAL, C_BERISIKO, C_KOLESTEROL]):
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
    perempuan = df_f[df_f["male"] == 0]["totChol"].dropna()
    laki_laki = df_f[df_f["male"] == 1]["totChol"].dropna()

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
    • <strong>Perempuan</strong> mayoritas berada di kategori kolesterol (≈ 46%) — distribusi condong ke risiko tinggi.<br>
    • <strong>Laki-laki</strong> memiliki pola lebih merata antara kategori <em>Berisiko</em> dan <em>Kolesterol</em>.<br>
    • A/B Testing (α = 0.05) membuktikan perbedaan rata-rata totChol antar gender <strong>signifikan secara statistik</strong>.
    </div>
    """, unsafe_allow_html=True)


# TAB 4 · PB3 · USIA
with tab4:
    st.subheader("PB3 · Apakah kelompok usia tertentu lebih rentan kolesterol?")

    age_order = ["< 35", "35-55", "> 55"]
    pivot_age = (
        df_f.groupby("age_group", observed=True)["catChol"]
        .value_counts(normalize=True).mul(100).rename("Proporsi")
        .reset_index()
    )
    pivot_age_wide = (
        pivot_age.pivot(index="age_group", columns="catChol", values="Proporsi")
        .reindex(index=age_order, columns=cat_order).fillna(0)
    )

    col1, col2 = st.columns([3, 2])

    with col1:
        fig_stacked = go.Figure()
        for cat, color in zip(cat_order, [C_NORMAL, C_BERISIKO, C_KOLESTEROL]):
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
        st.markdown("#### Rata-rata totChol per Kelompok Usia")
        age_mean = (
            df_f.groupby("age_group", observed=True)["totChol"]
            .mean().reindex(age_order).round(1).reset_index()
        )
        age_mean.columns = ["Kelompok Usia", "Mean totChol (mg/dL)"]
        fig_line = px.bar(
            age_mean, x="Kelompok Usia", y="Mean totChol (mg/dL)",
            color="Mean totChol (mg/dL)",
            color_continuous_scale=["#22C55E", "#F59E0B", "#EF4444"],
            text="Mean totChol (mg/dL)",
            template="plotly_white",
            height=340,
        )
        fig_line.update_traces(textposition="outside")
        fig_line.update_layout(coloraxis_showscale=False, margin=dict(t=30, b=20))
        st.plotly_chart(fig_line, use_container_width=True)

    # Scatter age vs totChol
    st.markdown("#### Scatter: Usia vs Total Kolesterol")
    fig_scatter = px.scatter(
        df_f.sample(min(1500, len(df_f)), random_state=1),
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
    • Kelompok <strong>&lt; 35 tahun</strong>: 66.67% normal — kelompok paling sehat.<br>
    • Kelompok <strong>35–55 tahun</strong>: pergeseran signifikan — normal turun ke ≈ 24%, kolesterol naik ke ≈ 38%.<br>
    • Kelompok <strong>&gt; 55 tahun</strong>: &gt; 55% berada di kategori kolesterol — risiko tertinggi.<br>
    • Tren linier positif antara usia dan totChol terlihat jelas (Spearman r ≈ 0.29).
    </div>
    """, unsafe_allow_html=True)


# TAB 5 · PB4 · HIPERTENSI & OBESITAS
with tab5:
    st.subheader("PB4 · Apakah hipertensi dan obesitas memperburuk risiko kolesterol?")

    # Chart 1 – Stacked bar by highBP
    pivot_bp = (
        df_f.groupby("highBP")["catChol"]
        .value_counts(normalize=True).mul(100).rename("Pct")
        .reset_index()
    )
    pivot_bp["Hipertensi"] = pivot_bp["highBP"].map({0: "Tanpa Hipertensi", 1: "Hipertensi"})
    pivot_bp_wide = (
        pivot_bp.pivot(index="Hipertensi", columns="catChol", values="Pct")
        .reindex(columns=cat_order).fillna(0)
    )

    col1, col2 = st.columns(2)

    with col1:
        fig_bp = go.Figure()
        for cat, color in zip(cat_order, [C_NORMAL, C_BERISIKO, C_KOLESTEROL]):
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
            df_f.groupby(["highBP", "bmi_category"], observed=True)["totChol"]
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
        df_f.groupby("obese_x_hyp")["catChol"]
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
    • Penderita <strong>hipertensi</strong> memiliki proporsi kolesterol lebih besar (≈ 52% vs 38%).<br>
    • <strong>Heatmap</strong>: Kombinasi terburuk adalah <em>Hipertensi + Overweight</em> (mean totChol ≈ 247 mg/dL); terbaik adalah <em>Tanpa Hipertensi + Normal BMI</em> (≈ 227 mg/dL).<br>
    • Individu dengan <strong>obesitas sekaligus hipertensi</strong> memiliki proporsi kolesterol hingga <strong>55.7%</strong> — jauh di atas kelompok tanpa kedua kondisi tersebut.
    </div>
    """, unsafe_allow_html=True)


# TAB 6 · PB5 · MEROKOK
with tab6:
    st.subheader("PB5 · Perbedaan risiko kolesterol antara perokok dan non-perokok")

    pivot_smoke_age = (
        df_f.groupby(["age_group", "currentSmoker"], observed=True)["totChol"]
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
            title="Rata-rata totChol per Kelompok Usia<br>(dikontrol per usia)",
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
        age_ns = df_f[df_f["currentSmoker"] == 0]["age"]
        age_s  = df_f[df_f["currentSmoker"] == 1]["age"]

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
            title="Distribusi Usia: Smoker vs Non-Smoker<br>(Perokok lebih muda → confounding variable)",
            xaxis_title="Usia",
            yaxis_title="Frekuensi",
            template="plotly_white",
            height=380,
            legend=dict(orientation="h", y=1.12),
            margin=dict(t=80, b=20),
        )
        st.plotly_chart(fig_age_dist, use_container_width=True)

    # Distribusi catChol per smoking intensity
    st.markdown("#### Intensitas Merokok vs Kategori Kolesterol")
    smoke_int_order = ["None", "Light", "Moderate", "Heavy"]
    pivot_si = (
        df_f.groupby("smoking_intensity", observed=True)["catChol"]
        .value_counts(normalize=True).mul(100).rename("Pct")
        .reset_index()
    )
    pivot_si_wide = (
        pivot_si.pivot(index="smoking_intensity", columns="catChol", values="Pct")
        .reindex(index=smoke_int_order, columns=cat_order).fillna(0)
    )

    fig_si = go.Figure()
    for cat, color in zip(cat_order, [C_NORMAL, C_BERISIKO, C_KOLESTEROL]):
        vals = [pivot_si_wide.loc[s, cat] if s in pivot_si_wide.index else 0
                for s in smoke_int_order]
        fig_si.add_trace(go.Bar(
            name=cat, x=smoke_int_order, y=vals,
            marker_color=color,
            text=[f"{v:.1f}%" for v in vals],
            textposition="inside",
            textfont_color="white",
        ))
    fig_si.update_layout(
        barmode="stack",
        title="Proporsi catChol per Intensitas Merokok",
        xaxis_title="Intensitas Merokok",
        yaxis_title="Proporsi (%)",
        template="plotly_white",
        height=360,
        legend=dict(orientation="h", y=1.12),
        margin=dict(t=70, b=20),
    )
    st.plotly_chart(fig_si, use_container_width=True)

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
    numeric_cols = [c for c in df_f.columns
                    if c not in exclude_cols and df_f[c].dtype in ["int64", "float64"]]

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
        r, p = spearmanr(df_f[col], df_f["totChol"], nan_policy="omit")
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
    • <strong>Usia</strong> (r ≈ 0.29) adalah faktor paling dominan — semakin tua, semakin tinggi kolesterol.<br>
    • Variabel <strong>kardiovaskular</strong> (<code>sysBP</code>, <code>diaBP</code>, <code>Pulse Pressure</code>, <code>High BP</code>, <code>Hipertensi</code>) mendominasi daftar korelasi positif.<br>
    • <strong>Gender laki-laki</strong> berkorelasi <em>negatif</em> — perempuan cenderung memiliki totChol lebih tinggi.<br>
    • Semua nilai r < 0.30, mengonfirmasi bahwa kolesterol bersifat <strong>multifaktorial</strong> dan tidak bisa dijelaskan oleh satu faktor tunggal.
    </div>
    """, unsafe_allow_html=True)

# ── Footer ──────────────────────────────────────────────────────────────────
st.divider()
st.caption("📊 Dashboard Analisis Kolesterol")