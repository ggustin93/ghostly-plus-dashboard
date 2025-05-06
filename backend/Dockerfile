# Use an official Python runtime as a parent image
# Make sure to use a version compatible with your dependencies (e.g., >=3.10)
FROM python:3.11-slim as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install poetry
# We use the official installer which is recommended over pip install poetry
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    curl -sSL https://install.python-poetry.org | python3 -
ENV PATH=/root/.local/bin:$PATH

# Copy only dependency definition files first to leverage Docker cache
COPY pyproject.toml poetry.lock* ./

# Install project dependencies
# --no-root: Don't install the project itself, only dependencies
# --no-dev: Exclude development dependencies for production image
RUN poetry install --no-root --no-dev --no-interaction --no-ansi

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser

# --- Second Stage: Runtime --- #
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Copy virtual env from builder stage
COPY --from=builder /root/.local/share/pypoetry/virtualenvs/* /.venv
ENV PATH="/.venv/bin:$PATH"

# Copy application code
COPY ./app ./app

# Switch to non-root user
USER appuser

# Expose port 8000
EXPOSE 8000

# Run Uvicorn server
# Use 0.0.0.0 to bind to all interfaces
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 