
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { Button } from '@/components/ui/button';
import { KanaCharacter } from '@/types/kana';
import { cn } from '@/lib/utils';

interface KanaCardProps {
  kana: KanaCharacter;
  showDetails?: boolean;
  onPractice?: () => void;
  onShowDetails?: () => void;
  className?: string;
}

const KanaCard: React.FC<KanaCardProps> = ({
  kana,
  showDetails = false,
  onPractice,
  onShowDetails,
  className,
}) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="text-center">
        <CardTitle className="flex justify-center">
          <JapaneseCharacter 
            character={kana.character} 
            size="xl" 
            animated={true} 
            className="text-indigo" 
          />
        </CardTitle>
        <CardDescription className="text-lg font-medium mt-2">{kana.romaji}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showDetails && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Type:</span>
              <span className="capitalize">{kana.type}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Stroke Count:</span>
              <span>{kana.stroke_count}</span>
            </div>
            {kana.mnemonic && (
              <div className="text-sm">
                <p className="font-medium mb-1">Mnemonic:</p>
                <p className="text-muted-foreground">{kana.mnemonic}</p>
              </div>
            )}
            {kana.examples && kana.examples.length > 0 && (
              <div className="text-sm">
                <p className="font-medium mb-1">Examples:</p>
                <ul className="list-disc list-inside space-y-1">
                  {kana.examples.map((example, index) => (
                    <li key={index}>
                      <span className="font-medium">{example.word}</span> ({example.romaji}) - {example.meaning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 justify-center">
        {onPractice && (
          <Button 
            variant="default" 
            className="bg-indigo hover:bg-indigo/90"
            onClick={onPractice}
          >
            Practice
          </Button>
        )}
        {onShowDetails && (
          <Button 
            variant="outline" 
            className="border-indigo text-indigo hover:bg-indigo/10"
            onClick={onShowDetails}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default KanaCard;
