import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmgVisualizationProps {
  detailed?: boolean;
  simplified?: boolean;
  previous?: boolean;
  groupType?: 'ghostly' | 'bfr' | 'control';
}

const EmgVisualization = ({ detailed, simplified, previous, groupType = 'ghostly' }: EmgVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedMuscle, setSelectedMuscle] = useState('quadriceps');
  const { theme } = useTheme();
  const [offsetPosition, setOffsetPosition] = useState(0);
  
  // Generate simulated EMG data based on group type and whether it's a previous session
  const generateEmgData = (length: number, amplitude: number, frequency: number, noise: number) => {
    // Apply different patterns based on group type
    const groupModifier = 
      groupType === 'bfr' ? 1.25 : // BFR typically shows higher amplitude
      groupType === 'control' ? 0.85 : // Control group shows lower amplitude
      1.0; // Ghostly group baseline
      
    const timeModifier = previous ? 0.75 : 1.0; // Previous sessions show lower activation
    
    const data = [];
    for (let i = 0; i < length; i++) {
      // Create a more quadriceps-specific EMG pattern with burst characteristics
      const baseSignal = 
        amplitude * groupModifier * timeModifier * Math.sin(i * frequency * 0.01) +
        (amplitude * 0.5) * Math.sin(i * frequency * 0.03);
        
      // Add contractile bursts typical in strength training
      const burstFactor = (i % 50 < 25) ? 1.2 : 0.8;
      
      // Add characteristic shape for quadriceps contractions
      const signal = baseSignal * burstFactor + noise * (Math.random() - 0.5);
      data.push(signal);
    }
    return data;
  };

  // Calculate statistics for EMG data
  const calculateEmgStats = (data: number[]) => {
    // Calculate mean/average
    const sum = data.reduce((acc, val) => acc + Math.abs(val), 0);
    const mean = sum / data.length;
    
    // Calculate standard deviation
    const squaredDifferences = data.map(val => Math.pow(Math.abs(val) - mean, 2));
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / data.length;
    const std = Math.sqrt(variance);
    
    // Calculate root mean square (RMS)
    const sumOfSquares = data.reduce((acc, val) => acc + Math.pow(val, 2), 0);
    const rms = Math.sqrt(sumOfSquares / data.length);
    
    // Calculate mean absolute value (MAV)
    const mav = mean;
    
    return { mean, std, rms, mav };
  };

  // Function to draw the EMG visualization
  const drawVisualization = (offset = 0) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Adjust for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set styles based on theme
    const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Color coding based on group type
    let lineColor = theme === 'dark' ? 'hsl(220, 70%, 50%)' : 'hsl(12, 76%, 61%)';
    if (previous) {
      lineColor = 'rgba(180, 180, 180, 0.8)';
    } else if (groupType === 'bfr') {
      lineColor = theme === 'dark' ? 'hsl(280, 70%, 50%)' : 'hsl(280, 76%, 61%)';
    } else if (groupType === 'control') {
      lineColor = theme === 'dark' ? 'hsl(160, 70%, 50%)' : 'hsl(160, 76%, 61%)';
    }
    
    // Calculate dimensions
    const width = rect.width;
    const height = rect.height;
    
    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Generate data with intensity based on group type and session
    const baseAmplitude = 80;
    const noise = 10;
    const dataLength = Math.floor(width * zoom);
    const data = generateEmgData(dataLength, baseAmplitude, 1, noise);
    
    // Calculate statistics
    const stats = calculateEmgStats(data);
    
    // Draw time axis
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Time labels
    ctx.fillStyle = textColor;
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    for (let x = 0; x < width; x += 100) {
      const time = ((x / width * 20) + (offset / 30)).toFixed(1) + 's';
      ctx.fillText(time, x, height - 5);
    }
    
    // Draw EMG signal
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const step = dataLength / width;
    for (let x = 0; x < width; x++) {
      // Apply the offset for animation
      const dataIndex = Math.floor((x * step) + offset) % data.length;
      if (dataIndex >= 0 && dataIndex < data.length) {
        const y = height / 2 - data[dataIndex];
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    }
    ctx.stroke();
    
    // Add additional details if detailed view
    if (detailed) {
      // Draw amplitude scale
      ctx.fillStyle = textColor;
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      
      const maxAmplitude = 200;
      for (let a = -maxAmplitude; a <= maxAmplitude; a += 50) {
        if (a === 0) continue; // Skip zero (center line)
        const y = height / 2 - a;
        ctx.fillText(a + ' μV', 40, y);
      }
      
      // Draw target threshold line for muscle activation (75% MVC from the study protocol)
      const threshold = 120;
      const thresholdY = height / 2 - threshold;
      
      ctx.strokeStyle = 'rgba(255, 50, 50, 0.6)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(50, thresholdY);
      ctx.lineTo(width, thresholdY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label threshold line as 75% MVC (from the study protocol)
      ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
      ctx.textAlign = 'left';
      ctx.fillText('Target 75% MVC (120 μV)', 55, thresholdY - 5);
      
      // Display statistics
      ctx.fillStyle = textColor;
      ctx.textAlign = 'right';
      ctx.font = '12px Arial';
      
      // Format stats to 2 decimal places and convert to mV
      const rmsFormatted = (stats.rms / 1000).toFixed(2) + ' mV';
      const mavFormatted = (stats.mav / 1000).toFixed(2) + ' mV';
      const avgFormatted = (stats.mean / 1000).toFixed(2) + ' mV';
      const stdFormatted = (stats.std / 1000).toFixed(2) + ' mV';
      
      ctx.fillText(`RMS: ${rmsFormatted}`, width - 20, 20);
      ctx.fillText(`MAV: ${mavFormatted}`, width - 20, 40);
      ctx.fillText(`Avg: ${avgFormatted}`, width - 20, 60);
      ctx.fillText(`Std: ${stdFormatted}`, width - 20, 80);
    }
  };

  // Initial render
  useEffect(() => {
    drawVisualization(offsetPosition);
  }, [theme, zoom, simplified, detailed, previous, groupType, selectedMuscle, offsetPosition]);

  // Animation frame for playing the visualization
  useEffect(() => {
    if (!isPlaying) return;
    
    let animationFrameId: number;
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      // We can use elapsed time to calculate speed adjustments if needed
      // const elapsed = timestamp - startTime;
      
      // Update offset position for scrolling effect (2 pixels per frame)
      setOffsetPosition(prevOffset => prevOffset + 2);
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        drawVisualization(offsetPosition);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [offsetPosition]);

  return (
    <div className={cn(
      "flex h-full flex-col",
      simplified ? "gap-2" : "gap-4"
    )}>
      {!simplified && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-1 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-1 h-4 w-4" />
                  Play
                </>
              )}
            </Button>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="w-24">
                <Slider
                  value={[zoom]}
                  min={0.5}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setZoom(value[0])}
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setZoom(Math.min(3, zoom + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Select
            value={selectedMuscle}
            onValueChange={setSelectedMuscle}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select muscle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quadriceps">Quadriceps</SelectItem>
              <SelectItem value="vastus_lateralis">Vastus Lateralis</SelectItem>
              <SelectItem value="vastus_medialis">Vastus Medialis</SelectItem>
              <SelectItem value="rectus_femoris">Rectus Femoris</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className={cn(
        "relative flex-1 rounded-lg border",
        previous ? "border-muted" : "border-primary/20"
      )}>
        <canvas 
          ref={canvasRef}
          className="h-full w-full"
          style={{ 
            display: 'block',
            width: '100%',
            height: '100%'
          }}
        />
        
        {simplified && (
          <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
            {previous ? 'Previous Session' : `Current Session (${groupType?.toUpperCase() || 'GHOSTLY'})`}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmgVisualization;