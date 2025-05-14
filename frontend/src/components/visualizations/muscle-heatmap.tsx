import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme-provider';

interface MuscleHeatmapProps {
  side: 'left' | 'right';
}

const MuscleHeatmap = ({ side }: MuscleHeatmapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  // Coordinate data for the muscle outline (simplified)
  const muscleOutlines = {
    deltoid: [
      [50, 40], [70, 25], [90, 30], [100, 55], [90, 75], [65, 85], [45, 70]
    ],
    biceps: [
      [65, 85], [90, 75], [95, 110], [85, 140], [65, 150], [45, 140], [45, 110], [45, 70]
    ],
    forearm: [
      [85, 140], [95, 170], [90, 200], [70, 220], [50, 220], [40, 200], [45, 170], [45, 140], [65, 150]
    ],
    // Add more muscles as needed
  };
  
  // Muscle activation data (simulated)
  // Values from 0 to 1 representing activation level
  const getActivationData = () => {
    // Create asymmetrical activation between sides
    const isMirrored = side === 'left';
    return {
      deltoid: isMirrored ? 0.45 : 0.85,
      biceps: isMirrored ? 0.35 : 0.75,
      forearm: isMirrored ? 0.55 : 0.65
    };
  };
  
  // Function to draw muscle heat map on the canvas
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
    
    // Adjust size to fit canvas
    const width = rect.width;
    const height = rect.height;
    const scale = Math.min(width / 240, height / 260) * 0.9;
    
    // Center the drawing
    const offsetX = (width - 240 * scale) / 2 + 20;
    const offsetY = (height - 260 * scale) / 2 + 20;
    
    // Get activation data
    const activationData = getActivationData();
    
    // Draw muscle outlines with heat colors
    for (const [muscle, points] of Object.entries(muscleOutlines)) {
      const activation = activationData[muscle as keyof typeof activationData] || 0;
      
      // Create gradient fill based on activation level
      let fillColor: string;
      
      if (theme === 'dark') {
        // Dark theme gradients
        if (activation < 0.3) {
          fillColor = `rgba(20, 70, 160, ${0.3 + activation})`;
        } else if (activation < 0.6) {
          fillColor = `rgba(70, 100, 230, ${0.5 + activation * 0.5})`;
        } else {
          fillColor = `rgba(100, 140, 255, ${0.6 + activation * 0.4})`;
        }
      } else {
        // Light theme gradients
        if (activation < 0.3) {
          fillColor = `rgba(255, 180, 120, ${0.3 + activation})`;
        } else if (activation < 0.6) {
          fillColor = `rgba(255, 140, 80, ${0.5 + activation * 0.5})`;
        } else {
          fillColor = `rgba(255, 100, 50, ${0.6 + activation * 0.4})`;
        }
      }
      
      // Mirror coordinates for left side
      const adjustedPoints = points.map(([x, y]) => {
        const adjustedX = side === 'left' ? width - (x * scale + offsetX) : x * scale + offsetX;
        return [adjustedX, y * scale + offsetY];
      });
      
      // Draw filled muscle shape
      ctx.beginPath();
      adjustedPoints.forEach(([x, y], index) => {
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      
      // Fill with heat color
      ctx.fillStyle = fillColor;
      ctx.fill();
      
      // Draw outline
      ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add muscle label
      const centerX = adjustedPoints.reduce((sum, [x]) => sum + x, 0) / adjustedPoints.length;
      const centerY = adjustedPoints.reduce((sum, [, y]) => sum + y, 0) / adjustedPoints.length;
      
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(muscle[0].toUpperCase() + muscle.slice(1), centerX, centerY);
      
      // Add activation percentage
      const percentage = Math.round(activation * 100);
      ctx.font = '12px Arial';
      ctx.fillText(`${percentage}%`, centerX, centerY + 20);
    }
  }, [side, theme]);
  
  return (
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
  );
};

export default MuscleHeatmap;