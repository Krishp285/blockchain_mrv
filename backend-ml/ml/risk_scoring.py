from __future__ import annotations

from typing import Dict, List

RISK_FEATURES = [
    "image_authenticity_score",
    "satellite_confidence_score",
    "ngo_historical_acceptance_rate",
    "upload_frequency",
    "location_sensitivity",
]


def risk_explanation(
    inputs: Dict[str, float | str],
    top_features: List[Dict[str, float]],
    predicted_class: str,
) -> str:
    feature_names = ", ".join(item["feature"] for item in top_features)
    return (
        f"Risk scored as {predicted_class}. "
        f"Top signals: {feature_names}. Lower authenticity or satellite confidence and "
        "higher location sensitivity typically increase risk."
    )
