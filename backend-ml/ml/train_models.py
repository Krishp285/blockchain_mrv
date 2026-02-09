from __future__ import annotations

import os
from pathlib import Path
from typing import Dict, List, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from ml.co2_prediction import CO2_FEATURES
from ml.restoration_classifier import RESTORATION_FEATURES
from ml.risk_scoring import RISK_FEATURES

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)

DEFAULT_DATASET_PATH = BASE_DIR.parent / "Dummy_datasets_SIH25038.xlsx"


def load_source_data(dataset_path: Path) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    blue = pd.read_excel(dataset_path, sheet_name="Blue carbon_dummy_datasets ")
    plantation = pd.read_excel(dataset_path, sheet_name="Plantation Details")
    mrv = pd.read_excel(dataset_path, sheet_name="mrv_datasets")
    return blue, plantation, mrv


def build_co2_dataset(blue: pd.DataFrame, plantation: pd.DataFrame) -> pd.DataFrame:
    merged = pd.merge(blue, plantation, on="site_id", how="inner")

    merged["measurement_date"] = pd.to_datetime(merged["measurement_date"])
    merged["plantation_date"] = pd.to_datetime(merged["plantation_date"])

    merged["time_since_restoration_months"] = (
        (merged["measurement_date"] - merged["plantation_date"]).dt.days / 30.0
    ).clip(lower=0)

    merged["vegetation_density_index"] = (
        (merged["survival_percentage"] / 100.0) * (merged["biodiversity_index"] / 10.0)
    ).fillna(0.6)

    merged["ecosystem_type"] = "mangrove"
    merged["coastal_zone_type"] = merged["hydrology_status"].fillna("Unknown")

    merged["predicted_co2_tons_per_year"] = (
        merged["annual_sequestration_tco2e_ha_yr"] * merged["area_restored_ha"]
    )

    co2_df = merged[
        CO2_FEATURES + ["predicted_co2_tons_per_year", "site_id"]
    ].copy()

    return co2_df


def augment_co2_dataset(co2_df: pd.DataFrame, rng: np.random.Generator, target_size: int = 200) -> pd.DataFrame:
    if len(co2_df) == 0:
        raise ValueError("CO2 dataset is empty")

    samples = co2_df.sample(n=target_size, replace=True, random_state=42).reset_index(drop=True)

    for col in ["area_restored_ha", "time_since_restoration_months", "vegetation_density_index"]:
        noise = rng.normal(0, 0.08, size=len(samples))
        samples[col] = (samples[col] * (1 + noise)).clip(lower=0)

    samples["predicted_co2_tons_per_year"] = (
        samples["predicted_co2_tons_per_year"] * (1 + rng.normal(0, 0.1, size=len(samples)))
    ).clip(lower=0)

    wetland_rows = samples.sample(n=max(20, len(samples) // 5), random_state=7).copy()
    wetland_rows["ecosystem_type"] = "wetland"
    wetland_rows["predicted_co2_tons_per_year"] = wetland_rows["predicted_co2_tons_per_year"] * 0.8
    wetland_rows["vegetation_density_index"] = wetland_rows["vegetation_density_index"] * 0.9

    augmented = pd.concat([samples, wetland_rows], ignore_index=True)
    return augmented


def build_restoration_dataset(co2_df: pd.DataFrame, rng: np.random.Generator) -> pd.DataFrame:
    base = co2_df.copy()

    base["ndvi_change"] = (
        (base["vegetation_density_index"] * 0.6) + rng.normal(0, 0.05, size=len(base))
    ).clip(0, 1)
    base["vegetation_cover_percent"] = (
        (base["vegetation_density_index"] * 100) + rng.normal(0, 6, size=len(base))
    ).clip(0, 100)
    base["time_interval_months"] = base["time_since_restoration_months"].clip(1, 48)
    base["area_consistency_score"] = (
        0.75 + (base["vegetation_density_index"] * 0.2) + rng.normal(0, 0.05, size=len(base))
    ).clip(0, 1)

    conditions = [
        (base["ndvi_change"] < 0.25) | (base["vegetation_cover_percent"] < 40),
        (base["ndvi_change"].between(0.25, 0.55)) | (base["vegetation_cover_percent"].between(40, 70)),
    ]
    choices = ["NO_RESTORATION", "PARTIAL"]
    base["restoration_status"] = np.select(conditions, choices, default="SUCCESSFUL")

    return base[RESTORATION_FEATURES + ["restoration_status"]].copy()


def build_risk_dataset(mrv: pd.DataFrame, rng: np.random.Generator) -> pd.DataFrame:
    df = mrv.copy()

    df["image_authenticity_score"] = (df["data_quality_score"] / 10.0).clip(0, 1)

    gps_accuracy = df["gps_accuracy_meters"].fillna(df["gps_accuracy_meters"].median())
    df["satellite_confidence_score"] = (1 / (1 + (gps_accuracy / 10))).clip(0, 1)

    df["ngo_historical_acceptance_rate"] = (
        0.6 + ((df["data_quality_score"] - df["data_quality_score"].min()) / 20)
    ).clip(0, 1)

    df["upload_frequency"] = (
        1 + rng.integers(1, 8, size=len(df))
    )

    df["location_sensitivity"] = (
        rng.uniform(0.3, 0.9, size=len(df))
    )

    risk_score = (
        (1 - df["image_authenticity_score"]) * 0.35
        + (1 - df["satellite_confidence_score"]) * 0.25
        + (1 - df["ngo_historical_acceptance_rate"]) * 0.2
        + (df["location_sensitivity"]) * 0.2
    )

    df["risk_level"] = pd.cut(
        risk_score,
        bins=[-0.01, 0.35, 0.6, 1.0],
        labels=["LOW", "MEDIUM", "HIGH"],
    )

    return df[RISK_FEATURES + ["risk_level"]].copy()


def aggregate_feature_importance(feature_names: List[str], importances: np.ndarray) -> Dict[str, float]:
    aggregated: Dict[str, float] = {}
    categorical_prefixes = ["ecosystem_type", "coastal_zone_type"]

    for name, score in zip(feature_names, importances):
        base_name = name.split("__", maxsplit=1)[-1]
        for prefix in categorical_prefixes:
            if base_name.startswith(f"{prefix}_"):
                base_name = prefix
                break
        aggregated[base_name] = aggregated.get(base_name, 0.0) + float(score)

    return aggregated


def train_co2_model(co2_df: pd.DataFrame) -> Dict[str, object]:
    X = co2_df[CO2_FEATURES]
    y = co2_df["predicted_co2_tons_per_year"]

    numeric_features = [
        "area_restored_ha",
        "time_since_restoration_months",
        "vegetation_density_index",
    ]
    categorical_features = ["ecosystem_type", "coastal_zone_type"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
            ("num", "passthrough", numeric_features),
        ],
        remainder="drop",
    )

    model = RandomForestRegressor(
        n_estimators=250,
        random_state=42,
        min_samples_leaf=2,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocess", preprocessor),
            ("model", model),
        ]
    )

    pipeline.fit(X, y)

    feature_names = pipeline.named_steps["preprocess"].get_feature_names_out()
    importances = pipeline.named_steps["model"].feature_importances_
    feature_importance = aggregate_feature_importance(feature_names.tolist(), importances)

    return {
        "pipeline": pipeline,
        "feature_importance": feature_importance,
        "classes": None,
    }


def train_restoration_model(restoration_df: pd.DataFrame) -> Dict[str, object]:
    X = restoration_df[RESTORATION_FEATURES]
    y = restoration_df["restoration_status"]

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        min_samples_leaf=2,
    )

    pipeline = Pipeline(steps=[("model", model)])
    pipeline.fit(X, y)

    importances = pipeline.named_steps["model"].feature_importances_
    feature_importance = dict(zip(RESTORATION_FEATURES, importances))

    return {
        "pipeline": pipeline,
        "feature_importance": feature_importance,
        "classes": list(model.classes_),
    }


def train_risk_model(risk_df: pd.DataFrame) -> Dict[str, object]:
    X = risk_df[RISK_FEATURES]
    y = risk_df["risk_level"].astype(str)

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        min_samples_leaf=2,
    )

    pipeline = Pipeline(steps=[("model", model)])
    pipeline.fit(X, y)

    importances = pipeline.named_steps["model"].feature_importances_
    feature_importance = dict(zip(RISK_FEATURES, importances))

    return {
        "pipeline": pipeline,
        "feature_importance": feature_importance,
        "classes": list(model.classes_),
    }


def save_training_dataset(co2_df: pd.DataFrame, restoration_df: pd.DataFrame, risk_df: pd.DataFrame) -> None:
    co2_df = co2_df.copy()
    co2_df["module"] = "co2_prediction"

    restoration_df = restoration_df.copy()
    restoration_df["module"] = "restoration_classification"

    risk_df = risk_df.copy()
    risk_df["module"] = "risk_scoring"

    combined = pd.concat([co2_df, restoration_df, risk_df], ignore_index=True, sort=False)
    combined.to_csv(DATA_DIR / "training_dataset.csv", index=False)


def main() -> None:
    dataset_path = Path(os.getenv("BLUECARB_DATASET_PATH", str(DEFAULT_DATASET_PATH)))
    if not dataset_path.exists():
        raise FileNotFoundError(
            "Dataset not found. Set BLUECARB_DATASET_PATH or place Dummy_datasets_SIH25038.xlsx at project root."
        )

    blue, plantation, mrv = load_source_data(dataset_path)

    rng = np.random.default_rng(42)

    co2_df = build_co2_dataset(blue, plantation)
    co2_df = augment_co2_dataset(co2_df, rng)

    restoration_df = build_restoration_dataset(co2_df, rng)
    risk_df = build_risk_dataset(mrv, rng)

    save_training_dataset(co2_df, restoration_df, risk_df)

    co2_bundle = train_co2_model(co2_df)
    restoration_bundle = train_restoration_model(restoration_df)
    risk_bundle = train_risk_model(risk_df)

    joblib.dump(co2_bundle, MODELS_DIR / "co2_model.pkl")
    joblib.dump(restoration_bundle, MODELS_DIR / "restoration_model.pkl")
    joblib.dump(risk_bundle, MODELS_DIR / "risk_model.pkl")


if __name__ == "__main__":
    main()
