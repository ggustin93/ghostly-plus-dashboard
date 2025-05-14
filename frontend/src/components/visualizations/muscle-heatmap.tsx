import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import { TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';

interface MuscleHeatmapProps {
  side: 'left' | 'right';
  measurementType?: 'strength' | 'csa' | 'pennation' | 'echo';
}

interface MuscleData {
  name: string;
  points: number[][];
  baseValue: number;
  // Positions for label anchors (relative to muscle outline)
  labelPosition?: { x: number, y: number };
}

const MuscleHeatmap = ({ side, measurementType = 'strength' }: MuscleHeatmapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [activeMetric, setActiveMetric] = useState<'strength' | 'csa' | 'pennation' | 'echo'>(measurementType);
  
  const CANVAS_CONCEPTUAL_WIDTH = 140;
  // Define quadriceps muscle group data with more semantic structure
  const getMuscleData = (isMirrored: boolean): Record<string, MuscleData> => {
    return {
      rectus_femoris: {
        name: 'Rectus Femoris',
        points: [[60, 50], [80, 50], [85, 120], [75, 180], [65, 180], [55, 120]],
        // Use same values for both legs
        baseValue: 0.65,
        labelPosition: isMirrored ? { x: 50, y: 100 } : { x: 90, y: 100 } // local X for each side
      },
      vastus_lateralis: {
        name: 'Vastus Lateralis',
        points: [[80, 50], [100, 60], [105, 130], [95, 190], [75, 180], [85, 120]],
        // Use same values for both legs
        baseValue: 0.70,
        labelPosition: isMirrored ? { x: 25, y: 130 } : { x: 115, y: 130 } // local X for each side
      },
      vastus_medialis: {
        name: 'Vastus Medialis',
        points: [[60, 50], [40, 60], [35, 130], [45, 190], [65, 180], [55, 120]],
        // Use same values for both legs
        baseValue: 0.60,
        labelPosition: isMirrored ? { x: 110, y: 130 } : { x: 30, y: 130 } // local X for each side
      }
    };
  };
  
  // Get modifier values for different measurement types
  const getMetricModifiers = (metricType: string): Record<string, number> => {
    const modifiers: Record<string, Record<string, number>> = {
      strength: { 
        rectus_femoris: 1.0, 
        vastus_lateralis: 1.1, 
        vastus_medialis: 0.9 
      },
      csa: { // Cross-sectional area
        rectus_femoris: 1.1, 
        vastus_lateralis: 0.9, 
        vastus_medialis: 1.0 
      },
      pennation: { // Pennation angle
        rectus_femoris: 0.9, 
        vastus_lateralis: 1.1, 
        vastus_medialis: 1.2 
      },
      echo: { // Echo intensity (higher is worse)
        rectus_femoris: 0.9, 
        vastus_lateralis: 0.8, 
        vastus_medialis: 1.0 
      }
    };
    
    return modifiers[metricType] || modifiers.strength;
  };
  
  // Calculate fill color based on activation and metric type
  const getFillColor = (activation: number, metricType: string, isDarkTheme: boolean): string => {
    // Different color schemes for different metrics
    const isPositiveMetric = metricType === 'strength' || metricType === 'csa' || metricType === 'pennation';
    
    // Use same intensity for both legs
    const intensityBoost = 0.2;
    
    if (isPositiveMetric) {
      // For these metrics, higher values are better (greens and blues)
      if (isDarkTheme) {
        // Dark theme gradients
        if (activation < 0.4) {
          return `rgba(30, 90, 170, ${0.5 + activation + intensityBoost})`;
        } else if (activation < 0.6) {
          return `rgba(70, 130, 200, ${0.6 + activation * 0.5 + intensityBoost})`;
        } else {
          return `rgba(100, 180, 255, ${0.7 + activation * 0.3 + intensityBoost})`;
        }
      } else {
        // Light theme gradients
        if (activation < 0.4) {
          return `rgba(0, 140, 80, ${0.5 + activation + intensityBoost})`;
        } else if (activation < 0.6) {
          return `rgba(0, 170, 110, ${0.6 + activation * 0.5 + intensityBoost})`;
        } else {
          return `rgba(0, 200, 140, ${0.7 + activation * 0.3 + intensityBoost})`;
        }
      }
    } else {
      // For echo intensity, higher values indicate worse condition (oranges and reds)
      if (isDarkTheme) {
        // Dark theme gradients
        if (activation < 0.4) {
          return `rgba(170, 90, 30, ${0.5 + activation + intensityBoost})`;
        } else if (activation < 0.6) {
          return `rgba(200, 130, 70, ${0.6 + activation * 0.5 + intensityBoost})`;
        } else {
          return `rgba(255, 180, 100, ${0.7 + activation * 0.3 + intensityBoost})`;
        }
      } else {
        // Light theme gradients
        if (activation < 0.4) {
          return `rgba(255, 180, 120, ${0.5 + activation + intensityBoost})`;
        } else if (activation < 0.6) {
          return `rgba(255, 140, 80, ${0.6 + activation * 0.5 + intensityBoost})`;
        } else {
          return `rgba(255, 90, 50, ${0.7 + activation * 0.3 + intensityBoost})`;
        }
      }
    }
  };
  
  // Format display value based on metric type
  const formatMetricValue = (activation: number, metricType: string): string => {
    switch(metricType) {
      case 'strength':
        return `${Math.round(activation * 100)}% MVC`;
      case 'csa':
        // Convert to approximate cm² value (typical range 15-30cm²)
        return `${(15 + (activation * 15)).toFixed(1)} cm²`;
      case 'pennation':
        // Convert to degrees (typical range 10-25 degrees)
        return `${Math.round(10 + (activation * 15))}°`;
      case 'echo':
        // Echo intensity (0-255 scale, lower is better muscle quality)
        return `Echo: ${Math.round(100 + (activation * 100))}`;
      default:
        return `${Math.round(activation * 100)}%`;
    }
  };
  
  // Function to render the heatmap
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
    
    // Calculate dimensions
    const width = rect.width;
    const height = rect.height;
    const scale = Math.min(width / CANVAS_CONCEPTUAL_WIDTH, height / 230) * 0.9;
    
    // Center the drawing
    const offsetX = (width - CANVAS_CONCEPTUAL_WIDTH * scale) / 2 + 20;
    const offsetY = (height - 230 * scale) / 2 + 20;
    
    const isMirrored = side === 'left';
    const muscleData = getMuscleData(isMirrored);
    const metricModifiers = getMetricModifiers(activeMetric);
    const isDarkTheme = theme === 'dark';
    
    // Draw a basic leg outline first
    ctx.beginPath();
    
    const legOutlinePoints = side === 'left' 
      ? [[80, 30], [30, 40], [20, 130], [30, 210], [80, 220], [110, 210], [120, 130], [110, 40]]
      : [[60, 30], [110, 40], [120, 130], [110, 210], [60, 220], [30, 210], [20, 130], [30, 40]];
    
    const adjustedLegOutline = legOutlinePoints.map(([x, y]) => [x * scale + offsetX, y * scale + offsetY]);
    
    adjustedLegOutline.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = isDarkTheme ? 'rgba(60, 60, 70, 0.4)' : 'rgba(240, 240, 245, 0.5)';
    ctx.fill();
    ctx.strokeStyle = isDarkTheme ? 'rgba(120, 120, 130, 0.6)' : 'rgba(180, 180, 190, 0.8)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    const muscleDataWithPositions: Record<string, {
      muscle: MuscleData,
      adjustedPoints: number[][],
      centerX: number, 
      centerY: number,
      activation: number,
      metricDisplay: string
    }> = {};
    
    // Draw muscles first
    for (const [muscleKey, muscle] of Object.entries(muscleData)) {
      const modifier = metricModifiers[muscleKey] || 1.0;
      const activation = muscle.baseValue * modifier;
      const fillColor = getFillColor(activation, activeMetric, isDarkTheme);
      
      const adjustedPoints = muscle.points.map(([x, y]) => {
        // Corrected mirroring for muscle points
        const localX = isMirrored ? CANVAS_CONCEPTUAL_WIDTH - x : x;
        const canvasX = localX * scale + offsetX;
        return [canvasX, y * scale + offsetY];
      });
      
      ctx.beginPath();
      adjustedPoints.forEach(([x, y], index) => {
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      const centerX = adjustedPoints.reduce((sum, [valX]) => sum + valX, 0) / adjustedPoints.length;
      const centerY = adjustedPoints.reduce((sum, [, valY]) => sum + valY, 0) / adjustedPoints.length;
      const metricDisplay = formatMetricValue(activation, activeMetric);
      
      muscleDataWithPositions[muscleKey] = {
        muscle,
        adjustedPoints,
        centerX,
        centerY,
        activation,
        metricDisplay
      };
    }
    
    // Now draw labels separately
    for (const [, data] of Object.entries(muscleDataWithPositions)) {
      const { muscle, centerX, centerY, metricDisplay } = data;
      
      let labelX: number, labelY: number;
      
      if (muscle.labelPosition) {
        // muscle.labelPosition.x is already local for the specific side
        const localLabelX = muscle.labelPosition.x;
        labelX = localLabelX * scale + offsetX;
        labelY = muscle.labelPosition.y * scale + offsetY;
      } else {
        // Fallback if labelPosition is not defined (should not happen with current data)
        const xOffsetFallback = isMirrored ? -40 : 40;
        labelX = centerX + xOffsetFallback;
        labelY = centerY;
      }
      
      ctx.beginPath();
      ctx.moveTo(labelX, labelY);
      ctx.lineTo(centerX, centerY);
      ctx.strokeStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      
      ctx.fillStyle = isDarkTheme ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)';
      const textWidth = muscle.name.length * 5.5 + 20;
      const textHeight = 36;
      ctx.fillRect(labelX - textWidth / 2, labelY - 12, textWidth, textHeight);
      
      ctx.fillStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(muscle.name, labelX, labelY);
      
      ctx.font = '11px Arial';
      ctx.fillText(metricDisplay, labelX, labelY + 16);
    }
    
    ctx.fillStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    const metricTitles = { strength: 'Muscle Strength', csa: 'Cross-Sectional Area', pennation: 'Pennation Angle', echo: 'Echo Intensity' };
    const metricTitle = metricTitles[activeMetric] || metricTitles.strength;
    ctx.fillText(`${side.toUpperCase()} LEG - ${metricTitle}`, width / 2, height - 20);
  }, [side, theme, activeMetric]);
  
  return (
    <div className="flex flex-col space-y-4">
      <Tabs 
        value={activeMetric} 
        onValueChange={(v) => setActiveMetric(v as 'strength' | 'csa' | 'pennation' | 'echo')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="csa">Cross-Section</TabsTrigger>
          <TabsTrigger value="pennation">Pennation</TabsTrigger>
          <TabsTrigger value="echo">Echo</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="relative h-80 rounded-lg border bg-card">
        <canvas 
          ref={canvasRef}
          className="h-full w-full"
          style={{ 
            display: 'block',
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    </div>
  );
};

export default MuscleHeatmap;