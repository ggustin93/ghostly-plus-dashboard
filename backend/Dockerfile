# Use a single-stage build since we need all build tools for ezc3d
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
# Add ezc3d library path to LD_LIBRARY_PATH
ENV LD_LIBRARY_PATH=/usr/local/lib/python3.11/site-packages/ezc3d:/usr/local/lib:/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    cmake \
    gcc \
    g++ \
    libopenblas-dev \
    liblapack-dev \
    git \
    libgomp1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH=/root/.local/bin:$PATH

# Copy dependency files
COPY pyproject.toml poetry.lock* ./

# Configure poetry and install dependencies
RUN poetry config virtualenvs.create false --local && \
    poetry install --no-root --only main --no-interaction --no-ansi

# Verify ezc3d installation and list all shared libraries
RUN python -c "import sys; print('Python path:', sys.path)" || echo "Failed to print Python path"
RUN find /usr/local -name "*.so*" | grep ezc3d || echo "No ezc3d libraries found in /usr/local"
RUN find /usr/local/lib/python3.11/site-packages -name "*.so*" | grep ezc3d || echo "No ezc3d libraries found in Python packages"

# Update the library cache
RUN ldconfig

# Copy application code
COPY app /app/app/

# Copy the verification script
COPY app/check_ezc3d.py /app/
RUN chmod +x /app/check_ezc3d.py

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser

# Set ownership of the application directory
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port 8000
EXPOSE 8000

# Run Uvicorn server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 