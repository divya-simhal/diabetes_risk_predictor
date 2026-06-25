import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class PredictionInput(BaseModel):
    pregnancies: int = Field(ge=0, le=20)
    glucose: float = Field(ge=0, le=300)
    blood_pressure: float = Field(ge=0, le=200)
    skin_thickness: float = Field(ge=0, le=100)
    insulin: float = Field(ge=0, le=900)
    bmi: float = Field(ge=0, le=80)
    diabetes_pedigree_function: float = Field(ge=0, le=3)
    age: int = Field(ge=1, le=120)


class PredictionOutput(BaseModel):
    id: int
    prediction: bool
    probability: float
    risk_level: str
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class PredictionRecordOut(PredictionOutput):
    pregnancies: int
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree_function: float
    age: int


class FeatureImportance(BaseModel):
    feature: str
    importance: float


class StatsOut(BaseModel):
    total_predictions: int
    high_risk_count: int
    low_risk_count: int
    average_glucose: float
    average_bmi: float
    average_age: float
    risk_distribution: dict[str, int]
    feature_importance: list[FeatureImportance]
