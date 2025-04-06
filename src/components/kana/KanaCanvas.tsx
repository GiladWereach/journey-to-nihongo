
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCcw, Check } from 'lucide-react';

interface KanaCanvasProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  referenceCharacter?: string;
  onComplete?: (imageData: string) => void;
  className?: string;
}

const KanaCanvas: React.FC<KanaCanvasProps> = ({
  width = 300,
  height = 300,
  strokeColor = '#333',
  strokeWidth = 8,
  referenceCharacter,
  onComplete,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      // Set canvas resolution for hi-DPI displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        setContext(ctx);
      }
    }
  }, [width, height, strokeColor, strokeWidth]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return;
    
    setIsDrawing(true);
    setHasDrawn(true);
    
    // Get coordinates
    let clientX, clientY;
    if ('touches' in e) {
      // Touch event
      e.preventDefault(); // Prevent scrolling
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    context.beginPath();
    context.moveTo(x, y);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    
    // Get coordinates
    let clientX, clientY;
    if ('touches' in e) {
      // Touch event
      e.preventDefault(); // Prevent scrolling
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
  };
  
  const endDrawing = () => {
    if (!isDrawing || !context) return;
    
    context.closePath();
    setIsDrawing(false);
  };
  
  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasDrawn(false);
  };
  
  const handleComplete = () => {
    if (!canvasRef.current || !hasDrawn) return;
    
    const imageData = canvasRef.current.toDataURL('image/png');
    if (onComplete) {
      onComplete(imageData);
    }
  };
  
  return (
    <div className={`flex flex-col items-center ${className || ''}`}>
      {referenceCharacter && (
        <div className="mb-2 text-3xl font-japanese opacity-20 text-center">
          {referenceCharacter}
        </div>
      )}
      
      <div className="relative border-2 border-gray-200 rounded-lg mb-4 bg-white">
        <canvas
          ref={canvasRef}
          className="touch-none cursor-crosshair"
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={clearCanvas}
          disabled={!hasDrawn}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={handleComplete}
          disabled={!hasDrawn}
          className="bg-indigo hover:bg-indigo/90 flex items-center gap-1"
        >
          <Check className="h-4 w-4" />
          Submit
        </Button>
      </div>
    </div>
  );
};

export default KanaCanvas;
