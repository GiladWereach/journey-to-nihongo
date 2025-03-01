
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { Button } from '@/components/ui/button';
import { KanaCharacter } from '@/types/kana';
import { cn } from '@/lib/utils';
import { BookOpen, Book } from 'lucide-react';

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
  const isHiragana = kana.type === 'hiragana';
  
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="text-center p-3 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-muted">
            {isHiragana ? (
              <Book className="h-3 w-3 mr-1 text-indigo" />
            ) : (
              <BookOpen className="h-3 w-3 mr-1 text-secondary" />
            )}
            <span className={isHiragana ? "text-indigo" : "text-secondary"}>
              {isHiragana ? 'Hiragana' : 'Katakana'}
            </span>
          </div>
        </div>
        <CardTitle className="flex justify-center mt-2">
          <JapaneseCharacter 
            character={kana.character} 
            size="lg" 
            animated={true} 
            className={isHiragana ? "text-indigo" : "text-secondary"} 
          />
        </CardTitle>
        <CardDescription className="text-base font-medium mt-1">{kana.romaji}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-3 pt-0">
        {showDetails && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Stroke Count:</span>
              <span>{kana.stroke_count}</span>
            </div>
            {kana.mnemonic && (
              <div className="text-xs">
                <p className="font-medium mb-1">Mnemonic:</p>
                <p className="text-muted-foreground">{kana.mnemonic}</p>
              </div>
            )}
            {kana.examples && kana.examples.length > 0 && (
              <div className="text-xs">
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
      <CardFooter className="flex gap-2 justify-center p-3 pt-0">
        {onPractice && (
          <Button 
            variant="default" 
            size="sm"
            className={cn(
              "text-xs px-2 py-1 h-auto",
              isHiragana ? "bg-indigo hover:bg-indigo/90" : "bg-secondary hover:bg-secondary/90"
            )}
            onClick={onPractice}
          >
            Practice
          </Button>
        )}
        {onShowDetails && (
          <Button 
            variant="outline" 
            size="sm"
            className={cn(
              "text-xs px-2 py-1 h-auto",
              isHiragana 
                ? "border-indigo text-indigo hover:bg-indigo/10" 
                : "border-secondary text-secondary hover:bg-secondary/10"
            )}
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
