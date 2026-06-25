def test_register_and_login(client):
    response = client.post(
        "/api/auth/register",
        json={"username": "newuser", "email": "newuser@example.com", "password": "password1"},
    )
    assert response.status_code == 201
    assert response.json()["username"] == "newuser"

    response = client.post(
        "/api/auth/login",
        data={"username": "newuser", "password": "password1"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={"username": "user2", "email": "user2@example.com", "password": "correctpass"},
    )
    response = client.post(
        "/api/auth/login",
        data={"username": "user2", "password": "wrongpass"},
    )
    assert response.status_code == 401


def test_duplicate_registration_rejected(client):
    payload = {"username": "dupe", "email": "dupe@example.com", "password": "password1"}
    client.post("/api/auth/register", json=payload)
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 400
