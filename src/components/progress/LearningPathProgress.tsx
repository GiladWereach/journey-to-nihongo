
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, MapPin, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearningStage {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface LearningPathProgressProps {
  hiraganaProgress: number;
  katakanaProgress: number;
  basicKanjiProgress: number;
  grammarProgress: number;
  className?: string;
}

const LearningPathProgress: React.FC<LearningPathProgressProps> = ({
  hiraganaProgress,
  katakanaProgress,
  basicKanjiProgress,
  grammarProgress,
  className
}) => {
  // Calculate the overall progress to determine the current stage
  const totalProgress = (hiraganaProgress + katakanaProgress + basicKanjiProgress + grammarProgress) / 4;
  
  // Define learning stages
  const stages: LearningStage[] = [
    {
      id: 'hiragana',
      title: 'Hiragana Mastery',
      description: 'Learn all hiragana characters and basic vocabulary',
      completed: hiraganaProgress >= 90,
      current: totalProgress < 25 && hiraganaProgress < 90
    },
    {
      id: 'katakana',
      title: 'Katakana Challenge',
      description: 'Master katakana and common foreign loanwords',
      completed: katakanaProgress >= 90,
      current: hiraganaProgress >= 90 && katakanaProgress < 90
    },
    {
      id: 'basic-kanji',
      title: 'Basic Kanji Introduction',
      description: 'Learn common kanji and sentence structures',
      completed: basicKanjiProgress >= 90,
      current: katakanaProgress >= 90 && basicKanjiProgress < 90
    },
    {
      id: 'grammar-basics',
      title: 'Grammar Foundations',
      description: 'Master essential grammar patterns and conversational phrases',
      completed: grammarProgress >= 90,
      current: basicKanjiProgress >= 90 && grammarProgress < 90
    },
    {
      id: 'jlpt-n5',
      title: 'JLPT N5 Preparation',
      description: 'Prepare for the JLPT N5 certification',
      completed: false,
      current: grammarProgress >= 90
    }
  ];
  
  // Find the current stage index
  const currentStageIndex = stages.findIndex(stage => stage.current);
  const activeStageIndex = currentStageIndex === -1 ? 0 : currentStageIndex;
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-indigo" />
          Learning Path Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line connecting all stages */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200" />
          
          <div className="space-y-8">
            {stages.map((stage, index) => (
              <div key={stage.id} className="relative flex items-start">
                {/* Stage indicator */}
                <div className="absolute left-3 -translate-x-1/2 flex items-center justify-center">
                  {stage.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500 bg-white rounded-full" />
                  ) : stage.current ? (
                    <MapPin className="h-6 w-6 text-vermilion bg-white rounded-full animate-pulse" />
                  ) : (
                    <Circle className={cn(
                      "h-6 w-6 bg-white rounded-full",
                      index <= activeStageIndex ? "text-indigo" : "text-gray-300"
                    )} />
                  )}
                </div>
                
                {/* Stage content */}
                <div className={cn(
                  "ml-8 -mt-1 pb-2",
                  stage.current && "bg-indigo/5 p-4 rounded-lg -ml-4",
                )}>
                  <h3 className={cn(
                    "font-medium",
                    stage.completed ? "text-green-600" : 
                    stage.current ? "text-vermilion" :
                    "text-gray-600"
                  )}>
                    {stage.title}
                    {stage.completed && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <Trophy className="mr-1 h-3 w-3" /> Completed
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
                  
                  {/* Progress indicator for current stage */}
                  {stage.current && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span>Progress</span>
                        <span>
                          {stage.id === 'hiragana' ? `${Math.round(hiraganaProgress)}%` :
                           stage.id === 'katakana' ? `${Math.round(katakanaProgress)}%` :
                           stage.id === 'basic-kanji' ? `${Math.round(basicKanjiProgress)}%` :
                           `${Math.round(grammarProgress)}%`}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full", 
                            stage.id === 'hiragana' ? "bg-matcha" :
                            stage.id === 'katakana' ? "bg-vermilion" :
                            stage.id === 'basic-kanji' ? "bg-indigo" :
                            "bg-amber-500"
                          )}
                          style={{ 
                            width: `${stage.id === 'hiragana' ? hiraganaProgress :
                                    stage.id === 'katakana' ? katakanaProgress :
                                    stage.id === 'basic-kanji' ? basicKanjiProgress :
                                    grammarProgress}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningPathProgress;
