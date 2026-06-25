import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("vitals_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface PredictionInput {
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree_function: number;
  age: number;
}

export interface PredictionResult {
  id: number;
  prediction: boolean;
  probability: number;
  risk_level: "Low" | "Moderate" | "High";
  created_at: string;
}

export interface PredictionRecord extends PredictionResult, PredictionInput {}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface Stats {
  total_predictions: number;
  high_risk_count: number;
  low_risk_count: number;
  average_glucose: number;
  average_bmi: number;
  average_age: number;
  risk_distribution: Record<string, number>;
  feature_importance: FeatureImportance[];
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  const { data } = await api.post("/api/auth/register", {
    username,
    email,
    password,
  });
  return data;
}

export async function loginUser(username: string, password: string) {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const { data } = await api.post<{ access_token: string }>(
    "/api/auth/login",
    form,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return data.access_token;
}

// ---------------------------------------------------------------------------
// Prediction / history / stats
// ---------------------------------------------------------------------------
export async function predictRisk(input: PredictionInput) {
  const { data } = await api.post<PredictionResult>("/api/predict", input);
  return data;
}

export async function fetchHistory(limit = 50) {
  const { data } = await api.get<PredictionRecord[]>("/api/history", {
    params: { limit },
  });
  return data;
}

export async function deleteHistoryRecord(id: number) {
  await api.delete(`/api/history/${id}`);
}

export async function fetchStats() {
  const { data } = await api.get<Stats>("/api/stats");
  return data;
}
