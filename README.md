# Hash Benchmark Platform

A cybersecurity-focused benchmarking platform built with **FastAPI**, **PostgreSQL**, **Redis**, **Celery**, and **Docker** to evaluate the performance and security of modern password hashing algorithms.

---

## Features

* Benchmark password hashing algorithms
* Measure execution time
* Measure CPU utilization
* Measure peak memory usage
* Store benchmark history in PostgreSQL
* Compare multiple algorithms
* Security analysis engine
* Hardware profiling
* Attack cost estimation
* Smart recommendation engine
* Secure configuration recommendation
* Export benchmark reports
* Asynchronous benchmarking using Celery + Redis
* Dockerized deployment

---

## Supported Algorithms

* MD5
* SHA-1
* SHA-256
* bcrypt
* Argon2

---

## Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic

### Database

* PostgreSQL

### Queue System

* Redis
* Celery

### Deployment

* Docker
* Docker Compose

---

## Project Structure

```
backend/
│
├── app/
│   ├── benchmark.py
│   ├── crud.py
│   ├── database.py
│   ├── db_models.py
│   ├── tasks.py
│   ├── analytics.py
│   ├── recommendation.py
│   ├── hardware.py
│   ├── security.py
│   └── main.py
│
├── Dockerfile
├── requirements.txt
└── .env.example
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/aditihehe19/hash-benchmarker.git
cd hash-benchmarker
```

Install dependencies

```bash
pip install -r backend/requirements.txt
```

Run the backend

```bash
uvicorn app.main:app --reload
```

---

## Docker

Build and start the project

```bash
docker compose up --build
```

---

## API Documentation

Swagger UI

```
http://localhost:8000/docs
```

---

## Major API Endpoints

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | /benchmark               |
| POST   | /benchmark-async         |
| GET    | /task-status/{task_id}   |
| GET    | /results                 |
| GET    | /analytics               |
| GET    | /recommendation          |
| GET    | /security-analysis       |
| GET    | /optimal-config          |
| GET    | /recommend-secure-config |
| GET    | /hardware-profile        |
| GET    | /attack-cost             |
| GET    | /export-report           |

---

## Future Improvements

* Interactive React dashboard
* Performance visualization charts
* Automatic benchmark scheduling
* Machine Learning based recommendation engine
* Multi-node distributed benchmarking

---

## Author

**Aditi Kotnala**

B.Tech Computer Science Engineering (Cyber Security)

SRM University AP
