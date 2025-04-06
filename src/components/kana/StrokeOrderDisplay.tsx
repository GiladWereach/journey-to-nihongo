
import React from 'react';
import { KanaCharacter } from '@/types/kana';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
    <div className={`${className || ''}`}>
      <h3 className="text-sm font-medium mb-2">Stroke Order</h3>
      
      <div className="flex items-center justify-between gap-1 mb-4">
        {character.stroke_order.map((stroke, index) => (
          <React.Fragment key={index}>
            <Card className="flex-1 max-w-24 bg-white">
              <CardContent className="p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Step {index + 1}</div>
                <div className="font-japanese text-xl">{stroke}</div>
              </CardContent>
            </Card>
            
            {index < character.stroke_order.length - 1 && !isMobile && (
              <ArrowRight className="h-4 w-4 text-gray-400" />
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
