from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import auth, history, predict, stats

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Diabetes Risk Predictor API",
    description="ML-powered API that predicts diabetes risk from health metrics "
    "and stores prediction history per user.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(history.router)
app.include_router(stats.router)


@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok"}
