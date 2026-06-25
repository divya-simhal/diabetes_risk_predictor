
from pathlib import Path

import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

DATA_DIR = Path(__file__).parent
ZERO_AS_MISSING_COLS = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]


def load_and_clean_data() -> pd.DataFrame:
    data = pd.read_csv(DATA_DIR / "diabetes.csv")

    
    data[ZERO_AS_MISSING_COLS] = data[ZERO_AS_MISSING_COLS].replace(0, pd.NA)
    for col in ZERO_AS_MISSING_COLS:
        data[col] = data[col].fillna(data[col].median()).astype(float)

    return data


def train():
    data = load_and_clean_data()

    X = data.drop("Outcome", axis=1)
    y = data["Outcome"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = LogisticRegression(max_iter=1000)
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred))

    joblib.dump(model, DATA_DIR / "diabetes_model.pkl")
    joblib.dump(scaler, DATA_DIR / "scaler.pkl")
    print(f"Saved model + scaler to {DATA_DIR}")


if __name__ == "__main__":
    train()
