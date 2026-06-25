SAMPLE_INPUT = {
    "pregnancies": 2,
    "glucose": 130,
    "blood_pressure": 70,
    "skin_thickness": 25,
    "insulin": 80,
    "bmi": 28.5,
    "diabetes_pedigree_function": 0.5,
    "age": 35,
}


def test_predict_requires_auth(client):
    response = client.post("/api/predict", json=SAMPLE_INPUT)
    assert response.status_code == 401


def test_predict_returns_risk(client, auth_headers):
    response = client.post("/api/predict", json=SAMPLE_INPUT, headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["risk_level"] in {"Low", "Moderate", "High"}
    assert 0.0 <= body["probability"] <= 1.0
    assert isinstance(body["prediction"], bool)


def test_predict_validates_input(client, auth_headers):
    bad_input = dict(SAMPLE_INPUT, age=500)  # out of allowed range
    response = client.post("/api/predict", json=bad_input, headers=auth_headers)
    assert response.status_code == 422


def test_history_lists_predictions(client, auth_headers):
    client.post("/api/predict", json=SAMPLE_INPUT, headers=auth_headers)
    response = client.get("/api/history", headers=auth_headers)
    assert response.status_code == 200
    records = response.json()
    assert len(records) >= 1
    assert records[0]["glucose"] == SAMPLE_INPUT["glucose"]


def test_history_delete(client, auth_headers):
    client.post("/api/predict", json=SAMPLE_INPUT, headers=auth_headers)
    record_id = client.get("/api/history", headers=auth_headers).json()[0]["id"]

    response = client.delete(f"/api/history/{record_id}", headers=auth_headers)
    assert response.status_code == 204

    response = client.delete(f"/api/history/{record_id}", headers=auth_headers)
    assert response.status_code == 404


def test_stats_endpoint(client, auth_headers):
    client.post("/api/predict", json=SAMPLE_INPUT, headers=auth_headers)
    response = client.get("/api/stats", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["total_predictions"] >= 1
    assert len(body["feature_importance"]) == 8
