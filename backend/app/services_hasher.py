import hashlib
import time
import tracemalloc
import bcrypt
from argon2 import PasswordHasher

def benchmark_algorithm(algorithm: str, password: str, work_factor: int = 12) -> dict:
    """
    Executes a specific hashing algorithm and measures its performance metrics.
    """
    # 1. Start tracking memory allocation
    tracemalloc.start()
    
    # 2. Get high-resolution start time
    start_time = time.perf_counter()
    
    # 3. Dynamic Execution of the requested algorithm
    hashed_output = ""
    password_bytes = password.encode('utf-8')
    
    if algorithm == "md5":
        # MD5 is lightning fast (and insecure)
        hashed_output = hashlib.md5(password_bytes).hexdigest()
        
    elif algorithm == "sha256":
        # SHA-256 is standard cryptographic hashing
        hashed_output = hashlib.sha256(password_bytes).hexdigest()
        
    elif algorithm == "bcrypt":
        # bcrypt is adaptive and CPU-bound. work_factor determines iterations (2^work_factor)
        salt = bcrypt.gensalt(rounds=work_factor)
        hashed_output = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
        
    elif algorithm == "argon2":
        # Argon2id is the modern gold standard (Memory and CPU bound)
        # We use default profile parameters here for simplicity
        ph = PasswordHasher(memory_cost=65536, time_cost=3, parallelism=4)
        hashed_output = ph.hash(password)
        
    else:
        tracemalloc.stop()
        raise ValueError(f"Algorithm {algorithm} is not supported.")
        
    # 4. Capture end time and peak memory
    end_time = time.perf_counter()
    current_mem, peak_mem = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    
    # 5. Calculate results
    execution_time_ms = (end_time - start_time) * 1000
    peak_memory_mb = peak_mem / (1024 * 1024) # Convert bytes to Megabytes
    
    return {
        "algorithm": algorithm,
        "execution_time_ms": round(execution_time_ms, 4),
        "peak_memory_mb": round(peak_memory_mb, 4),
        "hash_preview": hashed_output[:20] + "..." # Don't return the whole string for clean UI
    }