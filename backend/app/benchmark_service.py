from sqlalchemy.orm import Session
import platform
import psutil
from app.db_models import BenchmarkResult


def save_benchmark_result(
    db: Session,
    result: dict
):

    benchmark = BenchmarkResult(
    algorithm=result["algorithm"],
    execution_time_ms=result["execution_time_ms"],
    peak_memory_mb=result["peak_memory_mb"],
    cpu_usage=result["cpu_usage"],

    work_factor=result["work_factor"],
    memory_cost=result["memory_cost"],
    time_cost=result["time_cost"],
    parallelism=result["parallelism"]
)

    db.add(benchmark)

    db.commit()

    db.refresh(benchmark)

    return benchmark

def get_all_results(db: Session):

    return db.query(
        BenchmarkResult
    ).order_by(
        BenchmarkResult.id.desc()
    ).all()

def get_analytics(db: Session):

    results = db.query(
        BenchmarkResult
    ).all()

    if not results:
        return {
            "message": "No benchmark data found"
        }

    algorithm_stats = {}

    for result in results:

        algo = result.algorithm

        if algo not in algorithm_stats:
            algorithm_stats[algo] = []

        algorithm_stats[algo].append(
            result.execution_time_ms
        )

    averages = {}

    for algo, times in algorithm_stats.items():

        averages[algo] = round(
            sum(times) / len(times),
            4
        )

    fastest = min(
        averages,
        key=averages.get
    )

    slowest = max(
        averages,
        key=averages.get
    )

    return {
        "fastest_algorithm": fastest,
        "slowest_algorithm": slowest,
        "average_execution_times": averages
    }

def get_security_rankings():

    scores = {
        "argon2": {
            "security_score": 95,
            "rating": "Excellent"
        },
        "bcrypt": {
            "security_score": 85,
            "rating": "Good"
        },
        "sha256": {
            "security_score": 40,
            "rating": "Weak for password storage"
        },
        "sha1": {
            "security_score": 10,
            "rating": "Deprecated"
        },
        "md5": {
            "security_score": 0,
            "rating": "Broken"
        }
    }

    rankings = []

    for algorithm, data in scores.items():

        rankings.append({
            "algorithm": algorithm,
            **data
        })

    rankings.sort(
        key=lambda x: x["security_score"],
        reverse=True
    )

    return {
        "rankings": rankings
    }

def get_recommendation(db: Session):

    results = db.query(
        BenchmarkResult
    ).all()

    if not results:
        return {
            "message": "No benchmark data available"
        }

    algorithms = {}

    for result in results:

        algo = result.algorithm

        if algo not in algorithms:
            algorithms[algo] = []

        algorithms[algo].append(
            result.execution_time_ms
        )

    averages = {}

    for algo, times in algorithms.items():

        averages[algo] = (
            sum(times) / len(times)
        )

    if "argon2" in averages:

        return {
            "recommended_algorithm": "argon2",
            "security_level": "High",
            "reason": [
                "Memory hard",
                "Resistant to GPU attacks",
                "Industry recommended password hashing algorithm"
            ]
        }

    elif "bcrypt" in averages:

        return {
            "recommended_algorithm": "bcrypt",
            "security_level": "Medium",
            "reason": [
                "Adaptive work factor",
                "Widely adopted",
                "Strong password hashing algorithm"
            ]
        }

    return {
        "recommended_algorithm": "None",
        "reason": [
            "Only fast cryptographic hashes detected"
        ]
    }

def get_security_analysis(db: Session):

    results = db.query(
        BenchmarkResult
    ).all()

    if not results:
        return {
            "message": "No benchmark data found"
        }

    # Known security characteristics
    security_profiles = {
        "md5": {
            "gpu_resistance": 0,
            "memory_hardness": 0,
            "adoption": 0
        },
        "sha1": {
            "gpu_resistance": 5,
            "memory_hardness": 0,
            "adoption": 5
        },
        "sha256": {
            "gpu_resistance": 15,
            "memory_hardness": 0,
            "adoption": 30
        },
        "bcrypt": {
            "gpu_resistance": 80,
            "memory_hardness": 40,
            "adoption": 90
        },
        "argon2": {
            "gpu_resistance": 100,
            "memory_hardness": 100,
            "adoption": 80
        }
    }

    algorithm_times = {}

    for result in results:

        algo = result.algorithm

        if algo not in algorithm_times:
            algorithm_times[algo] = []

        algorithm_times[algo].append(
            result.execution_time_ms
        )

    analysis = []

    for algo, times in algorithm_times.items():

        avg_time = sum(times) / len(times)

        # Performance suitability score
        if 100 <= avg_time <= 500:
            performance_score = 100

        elif avg_time < 100:
            performance_score = 30

        else:
            performance_score = 60

        profile = security_profiles.get(
            algo,
            {
                "gpu_resistance": 0,
                "memory_hardness": 0,
                "adoption": 0
            }
        )

        final_score = round(
            (
                profile["gpu_resistance"] * 0.4
                + profile["memory_hardness"] * 0.3
                + performance_score * 0.2
                + profile["adoption"] * 0.1
            ),
            2
        )

        analysis.append({
            "algorithm": algo,
            "average_time_ms": round(avg_time, 2),
            "security_score": final_score
        })

    analysis.sort(
        key=lambda x: x["security_score"],
        reverse=True
    )

    return {
        "algorithms": analysis
    }

def get_optimal_config(
    db: Session,
    target_time_ms: float
):

    results = db.query(
        BenchmarkResult
    ).all()

    if not results:
        return {
            "message": "No benchmark data found"
        }

    best_match = min(
        results,
        key=lambda x: abs(
            x.execution_time_ms - target_time_ms
        )
    )

    return {
        "algorithm": best_match.algorithm,
        "execution_time_ms":
            best_match.execution_time_ms,

        "work_factor":
            best_match.work_factor,

        "memory_cost":
            best_match.memory_cost,

        "time_cost":
            best_match.time_cost,

        "parallelism":
            best_match.parallelism,

        "difference_from_target_ms":
            round(
                abs(
                    best_match.execution_time_ms
                    - target_time_ms
                ),
                2
            )
    }

def get_secure_recommendation(
    db: Session,
    target_time_ms: float
):

    results = db.query(
        BenchmarkResult
    ).all()

    if not results:
        return {
            "message": "No benchmark data found"
        }

    security_scores = {
        "argon2": 100,
        "bcrypt": 80,
        "sha256": 30,
        "sha1": 10,
        "md5": 0
    }

    candidates = []

    for result in results:

        score = security_scores.get(
            result.algorithm,
            0
        )

        distance = abs(
            result.execution_time_ms
            - target_time_ms
        )

        candidates.append({
            "result": result,
            "score": score,
            "distance": distance
        })

    candidates.sort(
        key=lambda x: (
            -x["score"],
            x["distance"]
        )
    )

    best = candidates[0]["result"]

    return {
        "recommended_algorithm":
            best.algorithm,

        "execution_time_ms":
            best.execution_time_ms,

        "work_factor":
            best.work_factor,

        "memory_cost":
            best.memory_cost,

        "time_cost":
            best.time_cost,

        "parallelism":
            best.parallelism,

        "security_score":
            security_scores[
                best.algorithm
            ]
    }
def get_hardware_profile():

    return {

        "system": platform.system(),

        "release": platform.release(),

        "machine": platform.machine(),

        "processor": platform.processor(),

        "physical_cores":
            psutil.cpu_count(
                logical=False
            ),

        "logical_cores":
            psutil.cpu_count(
                logical=True
            ),

        "total_ram_gb":
            round(
                psutil.virtual_memory().total
                / (1024 ** 3),
                2
            )
    }
def estimate_attack_cost(
    algorithm: str
):

    costs = {

        "md5": {
            "cost_usd": 0.01,
            "risk": "Critical"
        },

        "sha1": {
            "cost_usd": 1,
            "risk": "High"
        },

        "sha256": {
            "cost_usd": 50,
            "risk": "Medium"
        },

        "bcrypt": {
            "cost_usd": 5000,
            "risk": "Low"
        },

        "argon2": {
            "cost_usd": 50000,
            "risk": "Very Low"
        }
    }

    return costs.get(
        algorithm.lower(),
        {
            "cost_usd": "Unknown",
            "risk": "Unknown"
        }
    )
from datetime import datetime


def export_report(
    db: Session
):

    report = {

        "generated_at":
            datetime.utcnow(),

        "hardware_profile":
            get_hardware_profile(),

        "analytics":
            get_analytics(db),

        "security_analysis":
            get_security_analysis(db),

        "recommendation":
            get_recommendation(db)
    }

    return report