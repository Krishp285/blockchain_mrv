from __future__ import annotations

from typing import Dict, List

CO2_FEATURES = [
    "area_restored_ha",
    "ecosystem_type",
    "time_since_restoration_months",
    "vegetation_density_index",
    "coastal_zone_type",
]


def co2_explanation(inputs: Dict[str, float | str], top_features: List[Dict[str, float]]) -> str:
    feature_names = ", ".join(item["feature"] for item in top_features)
    return (
        "Prediction is driven primarily by: "
        f"{feature_names}. Larger restored area, higher vegetation density, and longer restoration "
        "duration generally increase annual CO2 sequestration estimates."
    )
