
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

interface LearningStage {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  progress: number;
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
  // Calculate the current stage based on progress values
  const stages: LearningStage[] = [
    {
      id: 'hiragana',
      title: 'Hiragana Mastery',
      description: 'Learn all hiragana characters and basic vocabulary',
      completed: hiraganaProgress >= 90,
      current: hiraganaProgress < 90,
      progress: hiraganaProgress
    },
    {
      id: 'katakana',
      title: 'Katakana Challenge',
      description: 'Master katakana and common foreign loanwords',
      completed: katakanaProgress >= 90 && hiraganaProgress >= 90,
      current: hiraganaProgress >= 90 && katakanaProgress < 90,
      progress: katakanaProgress
    },
    {
      id: 'basic-kanji',
      title: 'Basic Kanji Introduction',
      description: 'Learn common kanji and sentence structures',
      completed: basicKanjiProgress >= 90 && katakanaProgress >= 90,
      current: katakanaProgress >= 90 && basicKanjiProgress < 90,
      progress: basicKanjiProgress
    },
    {
      id: 'grammar-basics',
      title: 'Grammar Foundations',
      description: 'Master essential grammar patterns and conversational phrases',
      completed: grammarProgress >= 90 && basicKanjiProgress >= 90,
      current: basicKanjiProgress >= 90 && grammarProgress < 90,
      progress: grammarProgress
    },
    {
      id: 'jlpt-n5',
      title: 'JLPT N5 Preparation',
      description: 'Prepare for the JLPT N5 certification',
      completed: false,
      current: grammarProgress >= 90,
      progress: 0
    }
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-2xl font-semibold">
          <MapPin className="mr-2 h-5 w-5 text-indigo" />
          Learning Path Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gray-200" />
          
          <div className="space-y-6">
            {stages.map((stage, index) => (
              <div key={stage.id} className="relative">
                <div className="flex items-start">
                  {/* Stage indicator dot */}
                  <div className="absolute left-3 -translate-x-1/2 mt-1.5">
                    {stage.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-matcha bg-white rounded-full" />
                    ) : stage.current ? (
                      <MapPin className="h-6 w-6 text-vermilion bg-white rounded-full" />
                    ) : (
                      <Circle className={cn(
                        "h-6 w-6 bg-white rounded-full",
                        index <= stages.findIndex(s => s.current) ? "text-gray-400" : "text-gray-300"
                      )} />
                    )}
                  </div>
                  
                  {/* Stage content */}
                  <div className={cn(
                    "ml-10 pb-2 w-full",
                    stage.current && "bg-gray-50 p-4 rounded-lg -ml-1"
                  )}>
                    <h3 className={cn(
                      "text-lg font-medium",
                      stage.completed ? "text-matcha" : 
                      stage.current ? "text-vermilion" :
                      "text-gray-700"
                    )}>
                      {stage.title}
                    </h3>
                    <p className="text-gray-500 mt-1 text-sm">{stage.description}</p>
                    
                    {/* Progress indicator for current stage */}
                    {(stage.current || stage.completed) && stage.progress > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-gray-600 font-medium">Progress</span>
                          <span className="text-gray-600">{Math.round(stage.progress)}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full", 
                              stage.id === 'hiragana' ? "bg-matcha" :
                              stage.id === 'katakana' ? "bg-vermilion" :
                              stage.id === 'basic-kanji' ? "bg-indigo" :
                              "bg-amber-500"
                            )}
                            style={{ width: `${stage.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
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
