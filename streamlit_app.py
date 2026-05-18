import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from tensorflow import keras
from PIL import Image

# --- HELPERS ---

# Konfigurasi Halaman
st.set_page_config(page_title="Cholestify Dashboard", layout="wide")

# --- LOAD DATA ---
# @st.cache_data
# def load_data():
#     df = pd.read_csv('data/df.csv')
#     return df
# df = load_data()
# data dummy
df = sns.load_dataset("tips")

# --- LOAD MODEL & ENCODERS ---
@st.cache_resource
def load_model():
    try:
        model = keras.models.load_model('dashboard/cholestify_finetuned_model.keras', compile=False)
        return model
    except FileNotFoundError:
        st.error("File 'cholestify_finetuned_model.keras' tidak ditemukan.")

# --- INITIALIZE SESSION STATE ---
# Ini untuk menyimpan halaman yang sedang aktif agar tidak hilang saat klik tombol lain
if 'page' not in st.session_state:
    st.session_state.page = "📊 Cholesterol Data"

# --- SIDEBAR NAVIGATION ---
with st.sidebar:
    ## logo
    # st.markdown(
    #     """
    #     <div style="display: flex; justify-content: center;">
    #         <img src="https://www.dicoding.com/blog/wp-content/uploads/2014/12/dicoding-header-logo.png" width="200">
    #     </div>
    #     """,
    #     unsafe_allow_html=True
    # )
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    st.markdown("### Menu")
    
    # Tombol pertama: Visualisasi Dataset Kolesterol
    if st.button("📊 Cholesterol Data", use_container_width=True, 
                 type="primary" if st.session_state.page == "📊 Cholesterol Data" else "secondary"):
        st.session_state.page = "📊 Cholesterol Data"
        st.rerun()
    
    # Tombol kedua: Visualisasi Food Table
    if st.button("🍔 Food Table", use_container_width=True, 
                 type="primary" if st.session_state.page == "🍔 Food Table" else "secondary"):
        st.session_state.page = "🍔 Food Table"
        st.rerun()

    # Tombol ketiga: Prediksi Cholestify (fitur utama)
    if st.button("🔍 Prediction", use_container_width=True,
                 type="primary" if st.session_state.page == "🔍 Prediction" else "secondary"):
        st.session_state.page = "🔍 Prediction"
        st.rerun()

    st.markdown("---")
    st.info("💡 **Tips:** Gunakan halaman 'Prediction' untuk simulasi risiko Kolesterol.")

# --- RENDER HALAMAN BERDASARKAN PILIHAN SIDEBAR ---

if st.session_state.page == "📊 Cholesterol Data":
    st.title("Cholesterol Dashboard")
    st.markdown("Dashboard ini menampilkan tren data terkait dataset kolesterol.")

    st.write(df)

elif st.session_state.page == "🍔 Food Table":
    st.title("Food Table Dashboard")
    st.markdown("Dashboard ini menampilkan tren data terkait pantangan makanan bagi penderita kolesterol.")

    st.write(df)

elif st.session_state.page == "🔍 Prediction":
    st.title("Prediksi Risiko Kolesterol")
    st.markdown("Masukkan gambar mata untuk memprediksi tingkat risiko kolesterol secara real-time.")
    
    uploaded_file = st.file_uploader(
        "Upload gambar (JPG)",
        type=['jpg', 'jpeg', 'png']
    )

    if uploaded_file:
        image = Image.open(uploaded_file).convert("RGB")
        st.image(image, caption="Uploaded Image", use_container_width=True)