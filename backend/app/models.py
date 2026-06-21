from pydantic import BaseModel


class BenchmarkRequest(BaseModel):
    algorithm: str
    password: str

    # bcrypt
    work_factor: int = 12

    # argon2
    memory_cost: int = 65536
    time_cost: int = 3
    parallelism: int = 4


class CompareRequest(BaseModel):
    password: str