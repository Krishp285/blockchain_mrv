from __future__ import annotations

from typing import Dict, List

RESTORATION_FEATURES = [
    "ndvi_change",
    "vegetation_cover_percent",
    "time_interval_months",
    "area_consistency_score",
]


def restoration_explanation(
    inputs: Dict[str, float | str],
    top_features: List[Dict[str, float]],
    predicted_class: str,
) -> str:
    feature_names = ", ".join(item["feature"] for item in top_features)
    return (
        f"Restoration classified as {predicted_class}. "
        f"Key drivers: {feature_names}. Higher NDVI change and vegetation cover usually "
        "push outcomes toward successful restoration."
    )
