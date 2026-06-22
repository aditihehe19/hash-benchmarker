from app.celery_app import celery_app
from app.benchmark import benchmark_algorithm

from app.database import SessionLocal
from app.crud import save_benchmark_result


@celery_app.task
def run_benchmark_task(
    algorithm,
    password,
    work_factor,
    memory_cost,
    time_cost,
    parallelism
):

    result = benchmark_algorithm(
        algorithm=algorithm,
        password=password,
        work_factor=work_factor,
        memory_cost=memory_cost,
        time_cost=time_cost,
        parallelism=parallelism
    )

    db = SessionLocal()

    try:

        save_benchmark_result(
            db,
            result
        )

    finally:

        db.close()

    return result