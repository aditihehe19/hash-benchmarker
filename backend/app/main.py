from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, get_db
from app.db_models import Base
from app.tasks import run_benchmark_task
from app.benchmark import benchmark_algorithm
from app.models import BenchmarkRequest, CompareRequest
from backend.app.benchmark_service import (
    save_benchmark_result, get_all_results, get_analytics,
    get_security_rankings, get_recommendation, get_security_analysis,
    get_optimal_config, get_hardware_profile, estimate_attack_cost,
    export_report, get_secure_recommendation
)
from celery.result import AsyncResult

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)  # runs once on startup
    yield

app = FastAPI(
    title="Hash Benchmark Platform",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... rest of your routes unchanged
#@app.on_event("startup")
#def startup():

 #   Base.metadata.create_all(bind=engine)
#Base.metadata.create_all(bind=engine)

@app.get("/")
def home():

    return {
        "message":
        "Hash Benchmark API Running"
    }


@app.post("/benchmark")
def run_benchmark(
    request: BenchmarkRequest,
    db: Session = Depends(get_db)
):

    result = benchmark_algorithm(
    algorithm=request.algorithm,
    password=request.password,

    work_factor=request.work_factor,

    memory_cost=request.memory_cost,
    time_cost=request.time_cost,
    parallelism=request.parallelism
)

    save_benchmark_result(
        db=db,
        result=result
    )

    return result

@app.post("/compare")
def compare_algorithms(
    request: CompareRequest
):

    algorithms = [
        "md5",
        "sha1",
        "sha256",
        "bcrypt",
        "argon2"
    ]

    results = []

    for algo in algorithms:

        result = benchmark_algorithm(
            algorithm=algo,
            password=request.password
        )

        results.append(result)

    return {
        "results": results
    }

@app.get("/results")
def get_results(
    db: Session = Depends(get_db)
):

    results = get_all_results(db)

    return results

@app.get("/analytics")
def analytics(
    db: Session = Depends(get_db)
):

    return get_analytics(db)

@app.get("/security-rankings")
def security_rankings():

    return get_security_rankings()

@app.get("/recommendation")
def recommendation(
    db: Session = Depends(get_db)
):

    return get_recommendation(db)

@app.get("/security-analysis")
def security_analysis(
    db: Session = Depends(get_db)
):

    return get_security_analysis(db) 

@app.get("/recommend-optimal-config")
def recommend_optimal_config(
    target_time_ms: float,
    db: Session = Depends(get_db)
):

    return get_optimal_config(
        db,
        target_time_ms
    )

@app.get("/recommend-secure-config")
def recommend_secure_config(
    target_time_ms: float,
    db: Session = Depends(get_db)
):

    return get_secure_recommendation(
        db,
        target_time_ms
    )

@app.get("/hardware-profile")
def hardware_profile():

    return get_hardware_profile()

@app.get("/attack-cost")
def attack_cost(
    algorithm: str
):

    return estimate_attack_cost(
        algorithm
    )

@app.get("/export-report")
def get_export_report(
    db: Session = Depends(get_db)
):

    return export_report(db)

@app.post("/benchmark-async")
def benchmark_async(
    request: BenchmarkRequest
):

    task = run_benchmark_task.delay(
        request.algorithm,
        request.password,

        request.work_factor,

        request.memory_cost,
        request.time_cost,
        request.parallelism
    )

    return {
        "task_id": task.id,
        "status": "queued"
    }
@app.get("/task-status/{task_id}")
def get_task_status(task_id: str):
    task = AsyncResult(task_id, app=run_benchmark_task.app)
    
    response = {
        "task_id": task_id,
        "status": task.status,
        "result": None,
        "error": None
    }
    
    if task.ready():
        if task.successful():
            response["result"] = task.result
        else:
            # This exposes the actual exception so you can debug it
            response["error"] = str(task.result)
            response["traceback"] = task.traceback
    
    return response