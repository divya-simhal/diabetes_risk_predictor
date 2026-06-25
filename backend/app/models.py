import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


def utcnow():
    return datetime.datetime.now(datetime.timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=utcnow)

    predictions = relationship(
        "PredictionRecord", back_populates="owner", cascade="all, delete-orphan"
    )


class PredictionRecord(Base):
    __tablename__ = "prediction_records"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Input features (Pima Indians Diabetes dataset schema)
    pregnancies = Column(Integer, nullable=False)
    glucose = Column(Float, nullable=False)
    blood_pressure = Column(Float, nullable=False)
    skin_thickness = Column(Float, nullable=False)
    insulin = Column(Float, nullable=False)
    bmi = Column(Float, nullable=False)
    diabetes_pedigree_function = Column(Float, nullable=False)
    age = Column(Integer, nullable=False)

    # Model output
    prediction = Column(Boolean, nullable=False)  # True = diabetic / high risk
    probability = Column(Float, nullable=False)  # P(diabetic), 0..1
    risk_level = Column(String, nullable=False)  # Low / Moderate / High

    created_at = Column(DateTime, default=utcnow)

    owner = relationship("User", back_populates="predictions")
