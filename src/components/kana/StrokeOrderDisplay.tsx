
import React from 'react';
import { KanaCharacter } from '@/types/kana';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface StrokeOrderDisplayProps {
  character: KanaCharacter;
  className?: string;
}

const StrokeOrderDisplay: React.FC<StrokeOrderDisplayProps> = ({ 
  character,
  className
}) => {
  const isMobile = useIsMobile();
  
  if (!character.stroke_order || character.stroke_order.length === 0) {
    return (
      <div className={`text-center text-gray-500 ${className || ''}`}>
        No stroke order information available.
      </div>
    );
  }
  
  return (
    <div className={cn("stroke-order-display", className)}>
      <h3 className="text-sm font-medium mb-2">Stroke Order</h3>
      
      <div className={`flex ${isMobile ? 'flex-wrap justify-center' : 'items-center justify-between'} gap-2 mb-4`}>
        {character.stroke_order.map((stroke, index) => (
          <React.Fragment key={index}>
            <Card className={`${isMobile ? 'w-16' : 'flex-1 max-w-24'} bg-white shadow-sm transition-all hover:shadow`}>
              <CardContent className="p-3 text-center flex flex-col items-center justify-center">
                <div className="text-xs text-gray-500 mb-1">Step {index + 1}</div>
                <div className="font-japanese text-xl">{stroke}</div>
              </CardContent>
            </Card>
            
            {index < character.stroke_order.length - 1 && !isMobile && (
              <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 italic text-center">
        Practice tracing each stroke in order from left to right
      </div>
    </div>
  );
};

export default StrokeOrderDisplay;
