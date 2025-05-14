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
}

const EmgVisualization = ({ detailed, simplified, previous }: EmgVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const { theme } = useTheme();
  
  // Generate simulated EMG data
  const generateEmgData = (length: number, amplitude: number, frequency: number, noise: number) => {
    const data = [];
    for (let i = 0; i < length; i++) {
      const signal = 
        amplitude * Math.sin(i * frequency * 0.01) +
        (previous ? amplitude * 0.65 : amplitude) * Math.sin(i * frequency * 0.03) +
        noise * (Math.random() - 0.5);
      data.push(signal);
    }
    return data;
  };

  useEffect(() => {
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
    const lineColor = previous 
      ? 'rgba(180, 180, 180, 0.8)' 
      : theme === 'dark' 
        ? 'hsl(220, 70%, 50%)' 
        : 'hsl(12, 76%, 61%)';
    
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
    
    // Generate data
    const baseAmplitude = previous ? 60 : 80;
    const noise = previous ? 8 : 12;
    const dataLength = Math.floor(width * zoom);
    const data = generateEmgData(dataLength, baseAmplitude, 1, noise);
    
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
      const time = (x / width * 20).toFixed(1) + 's';
      ctx.fillText(time, x, height - 5);
    }
    
    // Draw EMG signal
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const step = dataLength / width;
    for (let x = 0; x < width; x++) {
      const dataIndex = Math.floor(x * step);
      if (dataIndex < data.length) {
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
      
      // Draw threshold line
      const threshold = 120;
      const thresholdY = height / 2 - threshold;
      
      ctx.strokeStyle = 'rgba(255, 50, 50, 0.6)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(50, thresholdY);
      ctx.lineTo(width, thresholdY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label threshold line
      ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
      ctx.textAlign = 'left';
      ctx.fillText('Threshold (120 μV)', 55, thresholdY - 5);
    }
  }, [theme, zoom, simplified, detailed, previous]);

  // Animation frame for playing the visualization
  useEffect(() => {
    if (!isPlaying) return;
    
    let animationFrameId: number;
    let startTime: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // Redraw the canvas with scrolling effect
      // This is a simplified approach - in a real app you'd shift the actual data
      
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
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Re-render on resize
          // This is a simplified approach - in a real app you might debounce this
          const event = new Event('resize');
          window.dispatchEvent(event);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select muscle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Muscles</SelectItem>
              <SelectItem value="biceps">Biceps</SelectItem>
              <SelectItem value="triceps">Triceps</SelectItem>
              <SelectItem value="deltoid">Deltoid</SelectItem>
              <SelectItem value="forearm">Forearm</SelectItem>
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
            {previous ? 'Previous Session' : 'Current Session'}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmgVisualization;