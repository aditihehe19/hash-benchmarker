FROM python:3.12-slim

WORKDIR /app

# Copy and install dependencies first (leverages caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend source code
COPY . .

# Adjust this to match your actual app entry point (e.g., app:app or main:app)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
