from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.ml.model import predict as run_prediction
from app.models import PredictionRecord, User
from app.schemas import PredictionInput, PredictionOutput

router = APIRouter(prefix="/api/predict", tags=["predict"])


@router.post("", response_model=PredictionOutput)
def predict(
    payload: PredictionInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = run_prediction(payload.model_dump())

    record = PredictionRecord(
        owner_id=current_user.id,
        pregnancies=payload.pregnancies,
        glucose=payload.glucose,
        blood_pressure=payload.blood_pressure,
        skin_thickness=payload.skin_thickness,
        insulin=payload.insulin,
        bmi=payload.bmi,
        diabetes_pedigree_function=payload.diabetes_pedigree_function,
        age=payload.age,
        prediction=result["prediction"],
        probability=result["probability"],
        risk_level=result["risk_level"],
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return record
