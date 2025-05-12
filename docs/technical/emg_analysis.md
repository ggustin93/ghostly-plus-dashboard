# EMG Analysis Metrics and Implementation

This document provides technical details on EMG (Electromyography) metrics calculation and implementation for the Ghostly+ system. It outlines the key metrics needed for therapist assessment of patient progress in muscle rehabilitation.

## Key EMG Analysis Metrics

The following metrics have been identified as essential for clinical assessment of patient progress in rehabilitation settings:

### Core EMG Analysis Metrics (Must-Implement)

1. **Muscle Activation Level (%MVC)**
   - Description: Percentage of Maximal Voluntary Contraction
   - Purpose: Indicates intensity of muscle activation during specific movements
   - Implementation: `calculate_mvc_percentage(emg_signal, reference_mvc)`
   - Visualization: Color-coded heat maps or gauge charts showing activation intensity

2. **Root Mean Square (RMS)**
   - Description: Measure of EMG amplitude reflecting muscle exertion levels
   - Purpose: Provides insights into overall strength of muscle contraction
   - Implementation: `calculate_rms(emg_signal)` using NumPy
   - Visualization: Time-series charts with threshold indicators

3. **Symmetry Index**
   - Description: Comparison of left vs. right muscle activation
   - Purpose: Identifies imbalances in muscle recruitment patterns
   - Implementation: `calculate_symmetry(left_emg, right_emg)`
   - Visualization: Side-by-side comparison charts with percentage difference

4. **Activation Duration**
   - Description: Time period for which muscle maintains significant activation
   - Purpose: Assesses muscle endurance and fatigue resistance
   - Implementation: `calculate_activation_duration(emg_signal, threshold)`
   - Visualization: Timeline showing active vs. rest periods

### Advanced EMG Analysis Metrics (Should-Implement)

5. **Median Frequency**
   - Description: Frequency domain analysis for fatigue assessment
   - Purpose: Detects shifts in EMG power spectrum indicating muscle fatigue
   - Implementation: `calculate_median_frequency(emg_signal)` using SciPy FFT
   - Visualization: Trend charts showing frequency shifts across session

6. **Co-activation Index**
   - Description: Simultaneous activation of agonist/antagonist muscles
   - Purpose: Evaluates muscle coordination and motor control
   - Implementation: `calculate_coactivation(agonist_emg, antagonist_emg)`
   - Visualization: Radar charts showing balance between muscle groups

7. **Muscle Quality Indicators**
   - Description: Spatial distribution and homogeneity metrics
   - Purpose: Assesses coordination and efficiency of muscle activation
   - Implementation: `calculate_entropy(emg_signal)`, `calculate_homogeneity(emg_signal)`
   - Visualization: Heat maps with homogeneity overlays

## Reference Implementation

The Python implementation should provide the following core functionality:

```python
import numpy as np
from scipy.signal import butter, lfilter
from scipy.fft import fft

def preprocess_emg(emg_signal, sampling_rate, lowcut=20, highcut=450):
    """Preprocess EMG signal with bandpass filter and rectification"""
    # Bandpass filter
    nyq = 0.5 * sampling_rate
    low = lowcut / nyq
    high = highcut / nyq
    b, a = butter(4, [low, high], btype='band')
    filtered = lfilter(b, a, emg_signal)
    
    # Full-wave rectification
    rectified = np.abs(filtered)
    return rectified

def calculate_rms(emg_signal):
    """Calculate Root Mean Square of EMG signal"""
    return np.sqrt(np.mean(np.square(emg_signal)))

def calculate_mvc_percentage(emg_signal, reference_mvc):
    """Calculate %MVC relative to reference maximum"""
    signal_rms = calculate_rms(emg_signal)
    return (signal_rms / reference_mvc) * 100

def calculate_symmetry(left_emg, right_emg):
    """Calculate symmetry index between left and right muscles"""
    left_rms = calculate_rms(left_emg)
    right_rms = calculate_rms(right_emg)
    
    # Symmetry index formula
    symmetry = 2 * abs(left_rms - right_rms) / (left_rms + right_rms) * 100
    return symmetry
```

## API Integration

All metrics should be available through the API endpoints and integrated into the appropriate therapist dashboard screens, particularly T3 (Session Analysis). The recommended API endpoints include:

- `GET /api/emg/metrics/{session_id}` - Retrieve all calculated metrics for a session
- `GET /api/emg/raw/{session_id}` - Get preprocessed but raw EMG signal data
- `POST /api/emg/analyze` - Submit EMG data for analysis (returns calculated metrics)

## Validation Requirements

The usefulness of these metrics should be validated with therapists before full implementation. In particular:

- Confirm which specific muscle groups are most relevant for monitoring in elderly rehabilitation
- Validate EMG visualization preferences (heat maps vs. line charts vs. gauges)
- Determine preferred thresholds and reference values for different patient categories
- Verify the relevance of advanced metrics for clinical decision-making

## Additional Implementation Considerations

1. **Performance optimization** - EMG data processing can be computationally intensive; consider:
   - Caching of processed results
   - Asynchronous processing of large datasets
   - Downsampling strategies where appropriate

2. **Data storage considerations**
   - Store raw EMG data for future reprocessing
   - Store calculated metrics separately for quick retrieval
   - Consider time-series database options for efficient querying

3. **Visualization backend support**
   - Provide data in a format optimized for frontend charting libraries
   - Include metadata with units, ranges, and thresholds
   - Support for real-time streaming updates (if needed in future versions) 