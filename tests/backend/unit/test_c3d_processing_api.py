import os
import json
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, mock_open
from pathlib import Path

# Import the main app
from app.main import app
from app.api.c3d_processing_api import EMGAnalysisResult, GameMetadata, ChannelAnalytics

# Create test client
client = TestClient(app)

# Path to real C3D files
REAL_C3D_PATH = Path("backend/data/mock-c3d")

# Create test data directory if it doesn't exist
Path("tests/backend/unit/test_data").mkdir(parents=True, exist_ok=True)

# Ensure data directories exist
Path("backend/data/uploads").mkdir(parents=True, exist_ok=True)
Path("backend/data/results").mkdir(parents=True, exist_ok=True)

# Basic test for the API root endpoint
def test_c3d_api_root():
    """Test the C3D API root endpoint."""
    response = client.get("/api/v1/ghostly/")
    assert response.status_code == 200
    assert "name" in response.json()
    assert "version" in response.json()

# Simple test with a real C3D file
@pytest.mark.skipif(not list(REAL_C3D_PATH.glob("*.c3d")), 
                   reason="No real C3D files available for testing")
def test_upload_real_c3d_file():
    """Test uploading a real C3D file."""
    # Find the first C3D file
    c3d_files = list(REAL_C3D_PATH.glob("*.c3d"))
    if not c3d_files:
        pytest.skip("No C3D files found for testing")
    
    test_file = c3d_files[0]
    
    # Make the request with the real file
    with open(test_file, "rb") as f:
        response = client.post(
            "/api/v1/ghostly/upload",
            files={"file": (test_file.name, f, "application/octet-stream")},
            data={
                "user_id": "test-user",
                "patient_id": "test-patient",
                "session_id": "test-session",
                "threshold_factor": "0.3",
                "min_duration_ms": "50",
                "smoothing_window": "25"
            }
        )
    
    # Basic verification
    assert response.status_code == 200
    assert "file_id" in response.json()
    assert "metadata" in response.json()
    assert "analytics" in response.json()

# Mock data and fixtures
@pytest.fixture
def mock_c3d_file():
    """Create a mock C3D file for testing."""
    return b"mock_c3d_file_content"

@pytest.fixture
def mock_emg_result():
    """Create a mock EMG analysis result."""
    metadata = GameMetadata(
        game_name="Test Game",
        level="1",
        duration=60.0,
        therapist_id="test-therapist",
        group_id="test-group",
        time="2025-05-15 13:01:01",
        player_name="Test Player",
        score=100.0
    )
    
    analytics = {
        "Quadriceps": ChannelAnalytics(
            contraction_count=10,
            avg_duration_ms=250.0,
            total_duration_ms=2500.0,
            max_duration_ms=500.0,
            min_duration_ms=100.0,
            avg_amplitude=0.75,
            max_amplitude=1.0
        )
    }
    
    result = EMGAnalysisResult(
        file_id="test-file-id",
        timestamp="2025-05-15-13-01-01",
        metadata=metadata,
        analytics=analytics,
        user_id="test-user",
        patient_id="test-patient",
        session_id="test-session"
    )
    
    return result

# Test the results listing endpoint
@patch("backend.app.api.c3d_processing_api.RESULTS_DIR")
def test_list_results(mock_results_dir):
    """Test the list results endpoint."""
    # Setup mock
    mock_path1 = MagicMock()
    mock_path1.name = "result1.json"
    mock_path2 = MagicMock()
    mock_path2.name = "result2.json"
    mock_results_dir.glob.return_value = [mock_path1, mock_path2]
    
    # Make the request
    response = client.get("/api/v1/ghostly/results")
    
    # Verify response
    assert response.status_code == 200
    assert response.json() == ["result1.json", "result2.json"]
    mock_results_dir.glob.assert_called_once_with("*.json")

# Test getting a specific result
@patch("backend.app.api.c3d_processing_api.RESULTS_DIR")
@patch("backend.app.api.c3d_processing_api.open", new_callable=mock_open)
@patch("json.load")
def test_get_result(mock_json_load, mock_open_file, mock_results_dir, mock_emg_result):
    """Test getting a specific result by ID."""
    # Setup mocks
    mock_path = MagicMock()
    mock_path.exists.return_value = True
    mock_results_dir.__truediv__.return_value = mock_path
    mock_json_load.return_value = mock_emg_result.model_dump()
    
    # Make the request
    response = client.get("/api/v1/ghostly/results/test-file-id")
    
    # Verify response
    assert response.status_code == 200
    assert response.json()["file_id"] == "test-file-id"
    mock_path.exists.assert_called_once()

# Test listing patients
@patch("backend.app.api.c3d_processing_api.RESULTS_DIR")
@patch("backend.app.api.c3d_processing_api.open", new_callable=mock_open)
@patch("json.load")
def test_list_patients(mock_json_load, mock_open_file, mock_results_dir):
    """Test listing all patient IDs."""
    # Setup mocks
    mock_path1 = MagicMock()
    mock_path1.name = "patient1_result.json"
    mock_path2 = MagicMock()
    mock_path2.name = "patient2_result.json"
    mock_results_dir.glob.return_value = [mock_path1, mock_path2]
    
    # Setup mock JSON data
    mock_json_load.side_effect = [
        {"patient_id": "patient1"},
        {"patient_id": "patient2"}
    ]
    
    # Make the request
    response = client.get("/api/v1/ghostly/patients")
    
    # Verify response
    assert response.status_code == 200
    assert set(response.json()) == {"patient1", "patient2"}
    assert mock_results_dir.glob.call_count == 1
    assert mock_json_load.call_count == 2

# Test deleting a result
@patch("backend.app.api.c3d_processing_api.RESULTS_DIR")
@patch("backend.app.api.c3d_processing_api.os.remove")
def test_delete_result(mock_os_remove, mock_results_dir):
    """Test deleting a specific result by ID."""
    # Setup mocks
    mock_path = MagicMock()
    mock_path.exists.return_value = True
    mock_results_dir.__truediv__.return_value = mock_path
    
    # Make the request
    response = client.delete("/api/v1/ghostly/results/test-file-id")
    
    # Verify response
    assert response.status_code == 200
    assert response.json()["message"] == "Result test-file-id deleted successfully"
    mock_path.exists.assert_called_once()
    mock_os_remove.assert_called_once_with(mock_path)

if __name__ == "__main__":
    pytest.main(["-v", "test_c3d_processing_api.py"]) 