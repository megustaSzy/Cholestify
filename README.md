## Setup Environment & Run Streamlit App
```
conda create --name cholestify python=3.9
conda activate cholestify
pip install -r requirements.txt
cd dashboard
streamlit run streamlit_app.py
```

## Struktur Repository
├───analisis data
|   ├───cholestify_cholesterol-notebook.ipynb
|   ├───cholestify_food-table-notebook.ipynb
|   └───cholestify_modelling-notebook.ipynb
├───dashboard
|   └───cholestify_streamlit.py
├───model
|   ├───cholestify_efficientb0.h5
|   └───cholestify_efficientb0.keras
├───data
|   ├───df_cholesterol.csv
|   ├───df_cholesterol_cleaned.csv
|   ├───df_nutrition.csv
|   ├───df_nutrition_cleaned.csv
|   ├───df_food_status_LDL145_HDL42.csv
|   ├───arcus_new.zip
|   ├───roboflow.zip
|   ├───telkom.zip
|   └───ubiris.zip
├───README.md
└───requirements.txt


