
from pathlib import Path

import joblib
import pandas as pd

MODEL_DIR = Path(__file__).parent
FEATURE_ORDER = [
    "pregnancies",
    "glucose",
    "blood_pressure",
    "skin_thickness",
    "insulin",
    "bmi",
    "diabetes_pedigree_function",
    "age",
]
# Column names the model was originally trained with (Pima dataset schema).
_TRAINED_COLUMNS = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
]

_model = joblib.load(MODEL_DIR / "diabetes_model.pkl")
_scaler = joblib.load(MODEL_DIR / "scaler.pkl")


def _risk_level(probability: float) -> str:
    if probability < 0.33:
        return "Low"
    if probability < 0.66:
        return "Moderate"
    return "High"


def predict(features: dict) -> dict:
    
    ordered = [features[key] for key in FEATURE_ORDER]
    row = pd.DataFrame([ordered], columns=_TRAINED_COLUMNS)
    scaled = _scaler.transform(row)

    probability = float(_model.predict_proba(scaled)[0][1])
    prediction = bool(_model.predict(scaled)[0])

    return {
        "prediction": prediction,
        "probability": round(probability, 4),
        "risk_level": _risk_level(probability),
    }


def feature_importance() -> list[dict]:
   
    coefs = _model.coef_[0]
    pairs = list(zip(FEATURE_ORDER, (float(c) for c in coefs)))
    pairs.sort(key=lambda pair: abs(pair[1]), reverse=True)
    return [{"feature": name, "importance": round(value, 4)} for name, value in pairs]
