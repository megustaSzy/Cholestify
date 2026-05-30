## Setup Environment & Run Streamlit App
```
conda create --name cholestify python=3.9
conda activate cholestify
pip install -r requirements.txt
cd dashboard
streamlit run streamlit_app.py
```

## Struktur Repository
├───analisis data<br>
|   ├───cholestify_cholesterol-notebook.ipynb<br>
|   └───cholestify_food-table-notebook.ipynb<br>
├───dashboard<br>
|   └───cholestify_streamlit.py<br>
├───model<br>
|   ├───cholestify_efficientb0.h5<br>
|   └───cholestify_efficientb0.keras<br>
├───data<br>
|   ├───df_cholesterol.csv<br>
|   ├───df_cholesterol_cleaned.csv<br>
|   ├───df_nutrition.csv<br>
|   ├───df_nutrition_cleaned.csv<br>
|   └───df_food_status_LDL145_HDL42.csv<br>
├───README.md<br>
└───requirements.txt<br>


