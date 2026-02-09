from __future__ import annotations

import json
import logging
import os
from pathlib import Path
from typing import Any, Dict, List

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ml.co2_prediction import CO2_FEATURES, co2_explanation
from ml.restoration_classifier import RESTORATION_FEATURES, restoration_explanation
from ml.risk_scoring import RISK_FEATURES, risk_explanation

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
LOG_DIR = BASE_DIR / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(
    filename=LOG_DIR / "predictions.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="BlueCarb ML Service", version="1.0.0")

origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [origin.strip() for origin in origins_env.split(",") if origin.strip()]
if not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class CO2PredictionRequest(BaseModel):
    area_restored_ha: float = Field(..., ge=0)
    ecosystem_type: str
    time_since_restoration_months: float = Field(..., ge=0)
    vegetation_density_index: float = Field(..., ge=0)
    coastal_zone_type: str


class RestorationClassificationRequest(BaseModel):
    ndvi_change: float = Field(..., ge=-1, le=1)
    vegetation_cover_percent: float = Field(..., ge=0, le=100)
    time_interval_months: float = Field(..., ge=0)
    area_consistency_score: float = Field(..., ge=0, le=1)


class RiskScoringRequest(BaseModel):
    image_authenticity_score: float = Field(..., ge=0, le=1)
    satellite_confidence_score: float = Field(..., ge=0, le=1)
    ngo_historical_acceptance_rate: float = Field(..., ge=0, le=1)
    upload_frequency: float = Field(..., ge=0)
    location_sensitivity: float = Field(..., ge=0, le=1)


class ModelBundle(BaseModel):
    pipeline: Any
    feature_importance: Dict[str, float]
    classes: List[str] | None = None

    class Config:
        arbitrary_types_allowed = True


CO2_MODEL_PATH = MODELS_DIR / "co2_model.pkl"
RESTORATION_MODEL_PATH = MODELS_DIR / "restoration_model.pkl"
RISK_MODEL_PATH = MODELS_DIR / "risk_model.pkl"


def load_model_bundle(path: Path) -> ModelBundle:
    if not path.exists():
        raise FileNotFoundError(f"Missing model file: {path}")
    bundle = joblib.load(path)
    return ModelBundle(**bundle)


co2_model_bundle = load_model_bundle(CO2_MODEL_PATH)
restoration_model_bundle = load_model_bundle(RESTORATION_MODEL_PATH)
risk_model_bundle = load_model_bundle(RISK_MODEL_PATH)


def log_prediction(endpoint: str, payload: Dict[str, Any], response: Dict[str, Any]) -> None:
    logger.info(json.dumps({"endpoint": endpoint, "payload": payload, "response": response}))


def top_feature_importance(feature_importance: Dict[str, float], limit: int = 3) -> List[Dict[str, float]]:
    sorted_items = sorted(feature_importance.items(), key=lambda item: item[1], reverse=True)
    return [{"feature": name, "importance": round(score, 4)} for name, score in sorted_items[:limit]]


@app.post("/predict/co2")
async def predict_co2(payload: CO2PredictionRequest) -> Dict[str, Any]:
    payload_dict = payload.model_dump()
    features = {feature: payload_dict[feature] for feature in CO2_FEATURES}
    feature_frame = pd.DataFrame([features])
    prediction = co2_model_bundle.pipeline.predict(feature_frame)[0]

    feature_importance = top_feature_importance(co2_model_bundle.feature_importance)
    explanation = co2_explanation(payload_dict, feature_importance)

    response = {
        "predicted_co2_tons_per_year": round(float(prediction), 2),
        "feature_importance": feature_importance,
        "explanation": explanation,
    }

    log_prediction("/predict/co2", payload_dict, response)
    return response


@app.post("/classify/restoration")
async def classify_restoration(payload: RestorationClassificationRequest) -> Dict[str, Any]:
    features = [payload.model_dump()[feature] for feature in RESTORATION_FEATURES]
    proba = restoration_model_bundle.pipeline.predict_proba([features])[0]
    class_index = int(np.argmax(proba))
    predicted_class = restoration_model_bundle.classes[class_index]

    feature_importance = top_feature_importance(restoration_model_bundle.feature_importance)
    explanation = restoration_explanation(payload.model_dump(), feature_importance, predicted_class)

    response = {
        "restoration_status": predicted_class,
        "confidence_score": round(float(proba[class_index]), 4),
        "feature_importance": feature_importance,
        "explanation": explanation,
    }

    log_prediction("/classify/restoration", payload.model_dump(), response)
    return response


@app.post("/score/risk")
async def score_risk(payload: RiskScoringRequest) -> Dict[str, Any]:
    features = [payload.model_dump()[feature] for feature in RISK_FEATURES]
    proba = risk_model_bundle.pipeline.predict_proba([features])[0]
    class_index = int(np.argmax(proba))
    predicted_class = risk_model_bundle.classes[class_index]

    feature_importance = top_feature_importance(risk_model_bundle.feature_importance)
    explanation = risk_explanation(payload.model_dump(), feature_importance, predicted_class)

    review_priority = "AUTO" if predicted_class == "LOW" else "MANUAL"

    response = {
        "risk_level": predicted_class,
        "review_priority": review_priority,
        "confidence_score": round(float(proba[class_index]), 4),
        "feature_importance": feature_importance,
        "explanation": explanation,
    }

    log_prediction("/score/risk", payload.model_dump(), response)
    return response
