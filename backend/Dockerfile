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
# --only main: Install only main dependencies (exclude dev)
RUN poetry config virtualenvs.create false --local && \
    poetry install --no-root --only main --no-interaction --no-ansi

# --- Second Stage: Runtime --- #
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Create a non-root user here, in the final stage
RUN adduser --disabled-password --gecos '' appuser

# Copy installed packages AND executables from builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code from the build context (which is ./backend)
COPY --chown=appuser:appuser app /app/app/ 
# Source path is relative to ./backend context

# Switch to non-root user
USER appuser

# Expose port 8000
EXPOSE 8000

# Run Uvicorn server
# Use 0.0.0.0 to bind to all interfaces
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 