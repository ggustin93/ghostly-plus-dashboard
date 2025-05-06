# Makefile for GHOSTLY+ Backend Development

.PHONY: help run lint format test clean

# Default target executed when no arguments are given to make.
help:
	@echo "Available commands:"
	@echo "  run    - Run the FastAPI development server with Uvicorn"
	@echo "  lint   - Run Ruff linter check"
	@echo "  format - Run Ruff formatter"
	@echo "  test   - Run tests with pytest"
	@echo "  clean  - Remove cache files"

run:
	@echo "Starting FastAPI server..."
	@poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

lint:
	@echo "Running Ruff linter check..."
	@poetry run ruff check .

format:
	@echo "Running Ruff formatter..."
	@poetry run ruff format .

check-format: # Often useful in CI
	@echo "Checking formatting with Ruff..."
	@poetry run ruff format --check .

test:
	@echo "Running tests with pytest..."
	@poetry run pytest

clean:
	@echo "Cleaning cache files..."
	@find . -type f -name '*.pyc' -delete
	@find . -type d -name '__pycache__' -delete
	@rm -rf .pytest_cache
	@rm -rf .mypy_cache
	@rm -rf htmlcov
	@rm -f .coverage 