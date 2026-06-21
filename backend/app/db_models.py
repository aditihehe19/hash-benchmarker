from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime
)

from datetime import datetime

from app.database import Base


class BenchmarkResult(Base):

    __tablename__ = "benchmark_results"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    algorithm = Column(
        String,
        nullable=False
    )

    execution_time_ms = Column(
        Float
    )

    peak_memory_mb = Column(
        Float
    )

    cpu_usage = Column(
        Float
    )

    work_factor = Column(Integer, nullable=True)

    memory_cost = Column(Integer, nullable=True)

    time_cost = Column(Integer, nullable=True)

    parallelism = Column(Integer, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )