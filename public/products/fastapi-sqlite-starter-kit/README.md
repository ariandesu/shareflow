# Production FastAPI + SQLite Starter Kit

A high-performance, asynchronous FastAPI boilerplate configured for production deployment on Linux / Docker with SQLite + WAL mode.

## Features
- **FastAPI 0.110+**: Asynchronous endpoints with Pydantic v2 schemas.
- **SQLite WAL Mode**: High-concurrency read/write SQLite database adapter.
- **JWT Auth**: Secure password hashing (Passlib + Bcrypt) & Bearer Token auth.
- **CORS & Rate Limiting**: Built-in slowapi rate limiter & production security headers.
- **Docker & Systemd**: Ready-to-use Dockerfile, docker-compose.yml, and systemd unit templates.

## Structure
```
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── routers/
│       ├── auth.py
│       └── items.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Quick Start
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
