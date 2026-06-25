from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.ml.model import feature_importance
from app.models import PredictionRecord, User
from app.schemas import StatsOut

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    base_query = db.query(PredictionRecord).filter(PredictionRecord.owner_id == current_user.id)

    total = base_query.count()
    high_risk = base_query.filter(PredictionRecord.prediction.is_(True)).count()
    low_risk = total - high_risk

    averages = base_query.with_entities(
        func.avg(PredictionRecord.glucose),
        func.avg(PredictionRecord.bmi),
        func.avg(PredictionRecord.age),
    ).first()
    avg_glucose, avg_bmi, avg_age = (averages or (None, None, None))

    risk_distribution = {"Low": 0, "Moderate": 0, "High": 0}
    for (level,) in base_query.with_entities(PredictionRecord.risk_level).all():
        risk_distribution[level] = risk_distribution.get(level, 0) + 1

    return StatsOut(
        total_predictions=total,
        high_risk_count=high_risk,
        low_risk_count=low_risk,
        average_glucose=round(avg_glucose, 2) if avg_glucose else 0.0,
        average_bmi=round(avg_bmi, 2) if avg_bmi else 0.0,
        average_age=round(avg_age, 2) if avg_age else 0.0,
        risk_distribution=risk_distribution,
        feature_importance=feature_importance(),
    )
