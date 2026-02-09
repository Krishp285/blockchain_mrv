# BlueCarb ML Microservice

Purpose
- Adds explainable ML modules to BlueCarb-MRV without changing the MRV workflow.
- Runs as a standalone Python microservice (FastAPI) that the React frontend calls via REST.

Why ML is needed here
- Co2 prediction improves accuracy of credit quantification before minting.
- Restoration classification provides evidence-based checks on satellite derived signals.
- Risk scoring helps reviewers prioritize suspicious submissions without replacing them.

Architecture (ASCII)

[NGO Upload UI] --> [ML API /predict/co2] --------> [Validation Dashboard]
                       |                                |
                       +--> [ML API /classify/restoration]
                       |                                |
                       +--> [ML API /score/risk] --------+
                       |
                 [Model Training Pipeline]
                       |
          Dummy_datasets_SIH25038.xlsx
                       |
           training_dataset.csv + model pkls

Project layout
backend-ml/
├── app.py
├── ml/
│   ├── co2_prediction.py
│   ├── restoration_classifier.py
│   ├── risk_scoring.py
│   └── train_models.py
├── models/
├── data/
│   └── training_dataset.csv
├── logs/
│   └── predictions.log
├── requirements.txt
└── README.md

Setup
1) Create and activate a Python environment
2) Install dependencies
   pip install -r requirements.txt
3) Train models (creates models/*.pkl and data/training_dataset.csv)
   python -m ml.train_models

Dataset
- The training pipeline uses Dummy_datasets_SIH25038.xlsx at the project root.
- You can override the dataset path with BLUECARB_DATASET_PATH.
- training_dataset.csv stores three subsets with a module column:
  - co2_prediction
  - restoration_classification
  - risk_scoring

API Endpoints
POST /predict/co2
Input
{
  "area_restored_ha": 75,
  "ecosystem_type": "mangrove",
  "time_since_restoration_months": 18,
  "vegetation_density_index": 0.82,
  "coastal_zone_type": "Tidal"
}

Output
{
  "predicted_co2_tons_per_year": 21.7,
  "feature_importance": [
    {"feature": "area", "importance": 0.41}
  ],
  "explanation": "..."
}

POST /classify/restoration
Input
{
  "ndvi_change": 0.42,
  "vegetation_cover_percent": 68,
  "time_interval_months": 12,
  "area_consistency_score": 0.92
}

Output
{
  "restoration_status": "PARTIAL",
  "confidence_score": 0.78,
  "feature_importance": [
    {"feature": "ndvi", "importance": 0.38}
  ],
  "explanation": "..."
}

POST /score/risk
Input
{
  "image_authenticity_score": 0.86,
  "satellite_confidence_score": 0.72,
  "ngo_historical_acceptance_rate": 0.8,
  "upload_frequency": 4,
  "location_sensitivity": 0.55
}

Output
{
  "risk_level": "LOW",
  "review_priority": "AUTO",
  "confidence_score": 0.81,
  "feature_importance": [
    {"feature": "image", "importance": 0.33}
  ],
  "explanation": "..."
}

Explainability
- Feature importance is computed from trained models and returned with each prediction.
- Explanations summarize top drivers to support audit and reviewer decisions.

Run the API
- From backend-ml directory:
  uvicorn app:app --reload --port 8000

Environment variables
- ALLOWED_ORIGINS: comma-separated list of allowed CORS origins (default is "*").
- BLUECARB_DATASET_PATH: path to Dummy_datasets_SIH25038.xlsx.

Frontend integration
- Set VITE_ML_API_URL to the ML service URL (default http://localhost:8000).

Audit logging
- All predictions are logged to logs/predictions.log with request and response payloads.
