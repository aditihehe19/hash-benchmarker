import hashlib
import time
import tracemalloc
import bcrypt
import psutil

from argon2 import PasswordHasher


def benchmark_algorithm(
    algorithm: str,
    password: str,
    work_factor: int = 12,
    memory_cost: int = 65536,
    time_cost: int = 3,
    parallelism: int = 4
):
    process = psutil.Process()

    tracemalloc.start()

    start_cpu = process.cpu_percent()
    start_time = time.perf_counter()

    password_bytes = password.encode("utf-8")

    if algorithm == "md5":

        hashed_output = hashlib.md5(
            password_bytes
        ).hexdigest()

    elif algorithm == "sha1":

        hashed_output = hashlib.sha1(
            password_bytes
        ).hexdigest()

    elif algorithm == "sha256":

        hashed_output = hashlib.sha256(
            password_bytes
        ).hexdigest()

    elif algorithm == "bcrypt":

        salt = bcrypt.gensalt(
            rounds=work_factor
        )

        hashed_output = bcrypt.hashpw(
            password_bytes,
            salt
        ).decode()

    elif algorithm == "argon2":

        ph = PasswordHasher(
        memory_cost=memory_cost,
        time_cost=time_cost,
        parallelism=parallelism)

        hashed_output = ph.hash(password)

    else:

        tracemalloc.stop()

        raise ValueError(
            f"{algorithm} not supported"
        )

    end_time = time.perf_counter()

    current_mem, peak_mem = tracemalloc.get_traced_memory()

    tracemalloc.stop()

    end_cpu = process.cpu_percent()

    return {
    "algorithm": algorithm,

    "execution_time_ms": round(
        (end_time - start_time) * 1000,
        4
    ),

    "peak_memory_mb": round(
        peak_mem / (1024 * 1024),
        4
    ),

    "cpu_usage": round(
        abs(end_cpu - start_cpu),
        2
    ),

    "work_factor": (
        work_factor
        if algorithm == "bcrypt"
        else None
    ),

    "memory_cost": (
        memory_cost
        if algorithm == "argon2"
        else None
    ),

    "time_cost": (
        time_cost
        if algorithm == "argon2"
        else None
    ),

    "parallelism": (
        parallelism
        if algorithm == "argon2"
        else None
    ),

    "hash_preview":
        hashed_output[:20] + "..."
}