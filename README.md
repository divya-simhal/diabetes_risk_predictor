# Vitals — Diabetes Risk Predictor

A full-stack web application that predicts diabetes risk from clinical
health metrics using a trained machine learning model, with per-user
authentication, prediction history, and an analytics dashboard.

This started as a single-file Flask + scikit-learn demo and was rebuilt
into a production-style three-tier application: a REST API backend, a
typed React frontend, and a relational database — the same architecture
pattern used in real SaaS products.

## Stack

| Layer       | Technology |
|-------------|------------|
| Frontend    | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Recharts |
| Backend     | FastAPI, SQLAlchemy, Pydantic, JWT auth (python-jose, bcrypt) |
| Database    | PostgreSQL (SQLite fallback for zero-config local dev) |
| ML model    | scikit-learn Logistic Regression, trained on the Pima Indians Diabetes dataset |
| Testing     | Pytest (backend), ESLint + `tsc` (frontend) |
| Infra       | Docker, Docker Compose |

## Features

- **JWT authentication** — register/login, predictions are scoped to the
  signed-in user.
- **Risk screening** — submit 8 clinical metrics and get back a
  probability, a binary prediction, and a Low/Moderate/High risk band.
- **Prediction history** — every screening is persisted to PostgreSQL and
  can be reviewed or deleted later.
- **Analytics dashboard** — aggregated stats (risk distribution, average
  glucose/BMI/age) and a feature-importance chart derived from the
  model's own coefficients.
- **Input validation** end-to-end — Pydantic schemas on the backend,
  matching constraints on the frontend form.

## Architecture

```
┌─────────────┐      REST/JSON       ┌──────────────┐      SQL      ┌────────────┐
│   Next.js    │ ───────────────────▶│   FastAPI     │──────────────▶│ PostgreSQL │
│  (frontend)  │◀─────────────────── │   (backend)   │◀──────────────│            │
└─────────────┘     JWT in header     └──────┬───────┘                └────────────┘
                                              │
                                       joblib model
                                       (LogisticRegression)
```

## Project structure

```
diabetes-risk-predictor/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app + router registration
│   │   ├── config.py          # Settings (env-driven)
│   │   ├── database.py        # SQLAlchemy engine/session
│   │   ├── models.py          # User, PredictionRecord ORM models
│   │   ├── schemas.py         # Pydantic request/response models
│   │   ├── security.py        # Password hashing + JWT
│   │   ├── deps.py            # FastAPI dependencies (auth, DB session)
│   │   ├── ml/
│   │   │   ├── train.py       # Training pipeline (recreates the model)
│   │   │   ├── model.py       # Inference wrapper used by the API
│   │   │   ├── diabetes_model.pkl
│   │   │   └── scaler.pkl
│   │   └── routers/
│   │       ├── auth.py        # /api/auth/register, /api/auth/login
│   │       ├── predict.py     # /api/predict
│   │       ├── history.py     # /api/history
│   │       └── stats.py       # /api/stats
│   ├── tests/                 # Pytest suite
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # PredictionForm, RiskGauge, charts, etc.
│   ├── lib/                   # API client + auth context
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Running locally with Docker (recommended)

This spins up PostgreSQL, the FastAPI backend, and the Next.js frontend
together.

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend docs (Swagger UI): http://localhost:8000/docs

### Inspecting the database in pgAdmin

The `db` service runs on host port **5445** (not the default 5432) so it
doesn't clash with another local PostgreSQL instance you may already have
running. To register it in pgAdmin:

1. Right-click **Servers** → **Register** → **Server**
2. **General** tab → Name: `Diabetes Risk Predictor`
3. **Connection** tab:
   - Host: `localhost`
   - Port: `5445`
   - Maintenance database: `diabetes_db`
   - Username: `diabetes_user`
   - Password: `diabetes_pass`

This is a completely separate Postgres instance (own Docker container,
own data volume) — it won't touch or conflict with any other database
server already running on your machine.

## Running without Docker

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # defaults to SQLite, no Postgres needed
uvicorn app.main:app --reload
```

API will be live at http://localhost:8000, with interactive docs at
http://localhost:8000/docs.

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

App will be live at http://localhost:3000.

### Running tests

```bash
cd backend
pytest -v
```

## Retraining the model

The trained model files are already included, but the full pipeline is
reproducible:

```bash
cd backend
python -m app.ml.train
```

This reads `app/ml/diabetes.csv`, imputes missing values (zeros in
`Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, `BMI` are treated
as missing and filled with the column median), trains a
`LogisticRegression` classifier, and overwrites `diabetes_model.pkl` and
`scaler.pkl`.

## API overview

| Method | Endpoint              | Auth | Description |
|--------|------------------------|------|--------------|
| POST   | `/api/auth/register`  | No   | Create an account |
| POST   | `/api/auth/login`     | No   | Get a JWT access token |
| POST   | `/api/predict`        | Yes  | Run a prediction, save it to history |
| GET    | `/api/history`        | Yes  | List past predictions (paginated) |
| DELETE | `/api/history/{id}`   | Yes  | Delete a prediction record |
| GET    | `/api/stats`          | Yes  | Aggregated dashboard stats |
| GET    | `/api/health`         | No   | Health check |

Full interactive documentation is auto-generated by FastAPI at `/docs`.

## Disclaimer

This project is built for educational and portfolio purposes. It is not
a medical device and its predictions should not be used as a substitute
for professional medical advice.
