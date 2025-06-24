import pytest
import numpy as np
from unittest.mock import patch, MagicMock
from pathlib import Path
import os

from app.api.c3d_processing_api import (
    GHOSTLYC3DProcessor, 
    ProcessingOptions,
    GameMetadata,
    ChannelAnalytics
)

# Mock C3D data structure
@pytest.fixture
def mock_c3d_data():
    """Create a mock C3D data structure."""
    # Create a mock C3D object with the expected structure
    mock_c3d = {
        'parameters': {
            'INFO': {
                'GAME_NAME': {'value': ['Test Game']},
                'GAME_LEVEL': {'value': ['2']},
                'DURATION': {'value': [60.0]},
                'THERAPIST_ID': {'value': ['test-therapist']},
                'GROUP_ID': {'value': ['test-group']},
                'TIME': {'value': ['2025-05-15 13:01:01']}
            },
            'SUBJECTS': {
                'PLAYER_NAME': {'value': ['Test Player']},
                'GAME_SCORE': {'value': [100.0]}
            },
            'ANALOG': {
                'LABELS': {'value': ['Quad1Raw', 'Quad1activated']},
                'RATE': {'value': [1000.0]}
            }
        },
        'data': {
            'analogs': np.zeros((1, 2, 1000))  # 2 channels, 1000 samples
        }
    }
    
    # Add some simulated EMG data
    # Channel 1: Raw EMG with some contractions
    mock_c3d['data']['analogs'][0, 0, :] = np.random.random(1000) * 0.1  # Baseline noise
    mock_c3d['data']['analogs'][0, 0, 200:300] = np.random.random(100) * 0.8 + 0.2  # Contraction 1
    mock_c3d['data']['analogs'][0, 0, 500:650] = np.random.random(150) * 0.9 + 0.1  # Contraction 2
    
    # Channel 2: Activated EMG (processed)
    mock_c3d['data']['analogs'][0, 1, :] = np.zeros(1000)  # Baseline is zero
    mock_c3d['data']['analogs'][0, 1, 200:300] = np.ones(100) * 0.8  # Contraction 1
    mock_c3d['data']['analogs'][0, 1, 500:650] = np.ones(150) * 0.9  # Contraction 2
    
    return mock_c3d

# Get paths to real C3D files
@pytest.fixture
def real_c3d_files():
    """Get paths to real C3D files for testing."""
    base_dir = Path("backend/data/mock-c3d")
    files = list(base_dir.glob("*.c3d"))
    return files

# Test the GHOSTLYC3DProcessor class
class TestGHOSTLYC3DProcessor:
    
    @patch('backend.app.api.c3d_processing_api.ezc3d.c3d')
    def test_load_file(self, mock_ezc3d, mock_c3d_data):
        """Test loading a C3D file."""
        # Setup
        mock_ezc3d.return_value = mock_c3d_data
        processor = GHOSTLYC3DProcessor("test_file.c3d")
        
        # Execute
        processor.load_file()
        
        # Verify
        assert processor.c3d == mock_c3d_data
        mock_ezc3d.assert_called_once_with("test_file.c3d")
    
    @patch('backend.app.api.c3d_processing_api.ezc3d.c3d')
    def test_extract_metadata(self, mock_ezc3d, mock_c3d_data):
        """Test extracting metadata from a C3D file."""
        # Setup
        mock_ezc3d.return_value = mock_c3d_data
        processor = GHOSTLYC3DProcessor("test_file.c3d")
        
        # Execute
        metadata = processor.extract_metadata()
        
        # Verify
        assert metadata['game_name'] == 'Test Game'
        assert metadata['level'] == '2'
        assert metadata['duration'] == 60.0
        assert metadata['therapist_id'] == 'test-therapist'
        assert metadata['group_id'] == 'test-group'
        assert metadata['time'] == '2025-05-15 13:01:01'
        assert metadata['player_name'] == 'Test Player'
        assert metadata['score'] == 100.0
    
    @patch('backend.app.api.c3d_processing_api.ezc3d.c3d')
    def test_extract_emg_data(self, mock_ezc3d, mock_c3d_data):
        """Test extracting EMG data from a C3D file."""
        # Setup
        mock_ezc3d.return_value = mock_c3d_data
        processor = GHOSTLYC3DProcessor("test_file.c3d")
        
        # Execute
        emg_data = processor.extract_emg_data()
        
        # Verify
        assert 'Quad1Raw' in emg_data
        assert 'Quad1activated' in emg_data
        assert 'Quad1_raw' in emg_data
        assert 'Quad1_activated' in emg_data
        
        # Check data structure
        for channel_name, channel_data in emg_data.items():
            assert 'data' in channel_data
            assert 'time_axis' in channel_data
            assert 'sampling_rate' in channel_data
            assert channel_data['sampling_rate'] == 1000.0
            assert len(channel_data['data']) == 1000
            assert len(channel_data['time_axis']) == 1000
    
    @patch('backend.app.api.c3d_processing_api.ezc3d.c3d')
    def test_detect_contractions(self, mock_ezc3d, mock_c3d_data):
        """Test detecting contractions in EMG data."""
        # Setup
        mock_ezc3d.return_value = mock_c3d_data
        processor = GHOSTLYC3DProcessor("test_file.c3d")
        processor.extract_emg_data()
        
        # Execute
        contractions = processor.detect_contractions(
            threshold_factor=0.3,
            min_duration_ms=50,
            smoothing_window=25
        )
        
        # Verify
        assert len(contractions) > 0
        
        # Check at least one channel has contractions
        found_contractions = False
        for channel, contractions_list in contractions.items():
            if contractions_list:
                found_contractions = True
                # Check contraction structure
                for contraction in contractions_list:
                    assert 'start_time_ms' in contraction
                    assert 'end_time_ms' in contraction
                    assert 'duration_ms' in contraction
                    assert 'mean_amplitude' in contraction
                    assert 'max_amplitude' in contraction
        
        assert found_contractions, "No contractions detected in any channel"
    
    @patch('backend.app.api.c3d_processing_api.ezc3d.c3d')
    def test_calculate_analytics(self, mock_ezc3d, mock_c3d_data):
        """Test calculating analytics from detected contractions."""
        # Setup
        mock_ezc3d.return_value = mock_c3d_data
        processor = GHOSTLYC3DProcessor("test_file.c3d")
        processor.extract_emg_data()
        processor.detect_contractions()
        
        # Execute
        analytics = processor.calculate_analytics()
        
        # Verify
        assert len(analytics) > 0
        
        # Check analytics structure for at least one channel
        found_analytics = False
        for channel, channel_analytics in analytics.items():
            found_analytics = True
            assert 'contraction_count' in channel_analytics
            assert 'avg_duration_ms' in channel_analytics
            assert 'total_duration_ms' in channel_analytics
            assert 'max_duration_ms' in channel_analytics
            assert 'min_duration_ms' in channel_analytics
            assert 'avg_amplitude' in channel_analytics
            assert 'max_amplitude' in channel_analytics
        
        assert found_analytics, "No analytics calculated for any channel"
    
    @patch('backend.app.api.c3d_processing_api.ezc3d.c3d')
    @patch('backend.app.api.c3d_processing_api.uuid.uuid4')
    def test_process_file(self, mock_uuid, mock_ezc3d, mock_c3d_data):
        """Test the complete file processing workflow."""
        # Setup
        mock_ezc3d.return_value = mock_c3d_data
        mock_uuid.return_value = "test-file-id"
        processor = GHOSTLYC3DProcessor("test_file.c3d")
        options = ProcessingOptions(
            threshold_factor=0.3,
            min_duration_ms=50,
            smoothing_window=25
        )
        
        # Execute
        result = processor.process_file(options)
        
        # Verify
        assert result.file_id == "test-file-id"
        assert isinstance(result.metadata, GameMetadata)
        assert result.metadata.game_name == "Test Game"
        assert result.metadata.level == "2"
        
        # Check analytics
        assert len(result.analytics) > 0
        for channel, analytics in result.analytics.items():
            assert isinstance(analytics, ChannelAnalytics)
            assert analytics.contraction_count >= 0

# Test with real C3D files
class TestRealC3DFiles:
    """Tests using real C3D files from the mock-c3d directory."""
    
    def test_real_c3d_files_exist(self, real_c3d_files):
        """Verify that real C3D files exist for testing."""
        assert len(real_c3d_files) > 0, "No real C3D files found for testing"
        for file in real_c3d_files:
            assert file.exists(), f"File {file} does not exist"
            assert file.suffix == '.c3d', f"File {file} is not a C3D file"
    
    @pytest.mark.parametrize("file_index", [0])  # Test with the first file
    def test_load_real_c3d_file(self, real_c3d_files, file_index):
        """Test loading a real C3D file."""
        # Skip if no files
        if not real_c3d_files:
            pytest.skip("No real C3D files available")
        
        # Get the file path
        file_path = real_c3d_files[file_index]
        
        # Create processor and load file
        processor = GHOSTLYC3DProcessor(str(file_path))
        processor.load_file()
        
        # Verify file was loaded
        assert processor.c3d is not None, f"Failed to load real C3D file: {file_path}"
    
    @pytest.mark.parametrize("file_index", [0])  # Test with the first file
    def test_extract_metadata_from_real_file(self, real_c3d_files, file_index):
        """Test extracting metadata from a real C3D file."""
        # Skip if no files
        if not real_c3d_files:
            pytest.skip("No real C3D files available")
        
        # Get the file path
        file_path = real_c3d_files[file_index]
        
        # Create processor and extract metadata
        processor = GHOSTLYC3DProcessor(str(file_path))
        metadata = processor.extract_metadata()
        
        # Verify metadata was extracted
        assert metadata is not None, "Failed to extract metadata"
        # Basic verification - keys should exist even if values might be default
        assert 'level' in metadata
        assert 'time' in metadata
    
    @pytest.mark.parametrize("file_index", [0])  # Test with the first file
    def test_extract_emg_data_from_real_file(self, real_c3d_files, file_index):
        """Test extracting EMG data from a real C3D file."""
        # Skip if no files
        if not real_c3d_files:
            pytest.skip("No real C3D files available")
        
        # Get the file path
        file_path = real_c3d_files[file_index]
        
        # Create processor and extract EMG data
        processor = GHOSTLYC3DProcessor(str(file_path))
        emg_data = processor.extract_emg_data()
        
        # Verify EMG data was extracted
        assert emg_data is not None, "Failed to extract EMG data"
        assert len(emg_data) > 0, "No EMG channels found in the file"
        
        # Check data structure for the first channel
        first_channel = next(iter(emg_data.values()))
        assert 'data' in first_channel
        assert 'time_axis' in first_channel
        assert 'sampling_rate' in first_channel
        assert len(first_channel['data']) > 0
        assert len(first_channel['time_axis']) > 0
    
    @pytest.mark.parametrize("file_index", [0])  # Test with the first file
    def test_process_real_file(self, real_c3d_files, file_index):
        """Test processing a real C3D file end-to-end."""
        # Skip if no files
        if not real_c3d_files:
            pytest.skip("No real C3D files available")
        
        # Get the file path
        file_path = real_c3d_files[file_index]
        
        # Create processor and process file
        processor = GHOSTLYC3DProcessor(str(file_path))
        options = ProcessingOptions(
            threshold_factor=0.3,
            min_duration_ms=50,
            smoothing_window=25
        )
        
        result = processor.process_file(options)
        
        # Verify result
        assert result is not None, "Failed to process file"
        assert result.file_id is not None, "No file ID generated"
        assert result.timestamp is not None, "No timestamp generated"
        assert result.metadata is not None, "No metadata extracted"
        
        # Check if analytics were generated (might be empty if no contractions detected)
        assert hasattr(result, 'analytics'), "No analytics field in result"

# Create test data directory if it doesn't exist
Path("tests/backend/unit/test_data").mkdir(parents=True, exist_ok=True)

if __name__ == "__main__":
    pytest.main(["-v", "test_c3d_processor.py"]) 