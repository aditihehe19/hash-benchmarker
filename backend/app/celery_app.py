from celery import Celery

celery_app = Celery(
    "hash_benchmarker",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0"
)