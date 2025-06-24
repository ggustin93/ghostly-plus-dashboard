# GHOSTLY+ Backend Tests

This directory contains tests for the GHOSTLY+ backend API.

## Running Tests

To run all tests:

```bash
cd /path/to/ghostly-plus-dashboard
pytest tests/backend
```

To run a specific test file:

```bash
pytest tests/backend/unit/test_c3d_processor.py
```

## Test Structure

- `unit/`: Unit tests for individual components
  - `test_c3d_processor.py`: Tests for the C3D file processor
  - `test_c3d_processing_api.py`: Tests for the C3D processing API endpoints

## Real C3D File Tests

Some tests use real C3D files from the `backend/data/mock-c3d` directory. These tests will be skipped if no C3D files are found. 