export type Co2PredictionRequest = {
  area_restored_ha: number;
  ecosystem_type: string;
  time_since_restoration_months: number;
  vegetation_density_index: number;
  coastal_zone_type: string;
};

export type Co2PredictionResponse = {
  predicted_co2_tons_per_year: number;
  feature_importance: { feature: string; importance: number }[];
  explanation: string;
};

export type RestorationClassificationRequest = {
  ndvi_change: number;
  vegetation_cover_percent: number;
  time_interval_months: number;
  area_consistency_score: number;
};

export type RestorationClassificationResponse = {
  restoration_status: string;
  confidence_score: number;
  feature_importance: { feature: string; importance: number }[];
  explanation: string;
};

export type RiskScoringRequest = {
  image_authenticity_score: number;
  satellite_confidence_score: number;
  ngo_historical_acceptance_rate: number;
  upload_frequency: number;
  location_sensitivity: number;
};

export type RiskScoringResponse = {
  risk_level: string;
  review_priority: string;
  confidence_score: number;
  feature_importance: { feature: string; importance: number }[];
  explanation: string;
};

const baseUrl = (import.meta.env.VITE_ML_API_URL as string) || "http://localhost:8000";

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`ML API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const mlApi = {
  predictCo2: (payload: Co2PredictionRequest) => postJson<Co2PredictionResponse>("/predict/co2", payload),
  classifyRestoration: (payload: RestorationClassificationRequest) =>
    postJson<RestorationClassificationResponse>("/classify/restoration", payload),
  scoreRisk: (payload: RiskScoringRequest) => postJson<RiskScoringResponse>("/score/risk", payload),
};
