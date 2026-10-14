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
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Quick Start
```bash
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Production Cloud Deployment (1-Click & Recommended Hosting)
- **DigitalOcean**: [Claim $200 in Free Cloud Compute Credits (60 Days)](https://m.do.co/c/shareflow)
- **Railway**: [1-Click Cloud Deploy on Railway](https://railway.com?referralCode=shareflow)
- **Hetzner Cloud**: [High-Performance NVMe Cloud Servers from €3.79/mo](https://hetzner.cloud/?ref=shareflow)
