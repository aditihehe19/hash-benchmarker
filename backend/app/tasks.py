from app.celery_app import celery_app
from app.benchmark import benchmark_algorithm


@celery_app.task
def run_benchmark_task(
    algorithm,
    password,
    work_factor,
    memory_cost,
    time_cost,
    parallelism
):

    return benchmark_algorithm(
        algorithm=algorithm,
        password=password,
        work_factor=work_factor,
        memory_cost=memory_cost,
        time_cost=time_cost,
        parallelism=parallelism
    )