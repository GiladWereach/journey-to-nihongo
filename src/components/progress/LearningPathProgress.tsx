
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, CheckCircle2, Circle, BookOpen, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { LearningStage } from '@/types/progress';
import { Badge } from '@/components/ui/badge';

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
      title: 'Hiragana Recognition',
      description: 'Learn all hiragana characters through multiple choice and speed quizzes',
      completed: hiraganaProgress >= 90,
      current: hiraganaProgress < 90,
      progress: hiraganaProgress,
      features: [
        {
          name: 'Multiple Choice Quiz',
          description: 'Test your knowledge with multiple choice questions',
          icon: 'book-open',
          available: true
        },
        {
          name: 'Speed Quiz',
          description: 'Test your recognition speed with timed challenges',
          icon: 'clock',
          available: true
        }
      ]
    },
    {
      id: 'katakana',
      title: 'Katakana Recognition',
      description: 'Master katakana through multiple choice and speed quizzes',
      completed: katakanaProgress >= 90 && hiraganaProgress >= 90,
      current: hiraganaProgress >= 90 && katakanaProgress < 90,
      progress: katakanaProgress,
      features: [
        {
          name: 'Multiple Choice Quiz',
          description: 'Test your knowledge with multiple choice questions',
          icon: 'book-open',
          available: true
        },
        {
          name: 'Speed Quiz',
          description: 'Test your recognition speed with timed challenges',
          icon: 'clock',
          available: true
        }
      ]
    },
    {
      id: 'basic-kanji',
      title: 'Basic Kanji Introduction',
      description: 'Learn common kanji through guided multiple choice quizzes',
      completed: basicKanjiProgress >= 90 && katakanaProgress >= 90,
      current: katakanaProgress >= 90 && basicKanjiProgress < 90,
      progress: basicKanjiProgress,
      features: [
        {
          name: 'Multiple Choice Quiz',
          description: 'Test your knowledge with multiple choice questions',
          icon: 'book-open',
          available: true
        },
        {
          name: 'Speed Quiz',
          description: 'Test your recognition speed with timed challenges',
          icon: 'clock',
          available: false
        }
      ]
    },
    {
      id: 'grammar-basics',
      title: 'Grammar Foundations',
      description: 'Master essential Japanese grammar patterns through interactive quizzes',
      completed: grammarProgress >= 90 && basicKanjiProgress >= 90,
      current: basicKanjiProgress >= 90 && grammarProgress < 90,
      progress: grammarProgress,
      features: [
        {
          name: 'Multiple Choice Quiz',
          description: 'Test your grammar knowledge with interactive exercises',
          icon: 'book-open',
          available: false
        }
      ]
    },
    {
      id: 'jlpt-n5',
      title: 'JLPT N5 Preparation',
      description: 'Prepare for the JLPT N5 certification with comprehensive practice',
      completed: false,
      current: grammarProgress >= 90,
      progress: 0,
      features: [
        {
          name: 'Multiple Choice Quiz',
          description: 'JLPT-style practice questions',
          icon: 'book-open',
          available: false
        },
        {
          name: 'Vocabulary Practice',
          description: 'Learn essential N5 vocabulary',
          icon: 'zap',
          available: false
        }
      ]
    }
  ];

  // Helper function to render feature icon
  const renderFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'book-open':
        return <BookOpen className="h-4 w-4" />;
      case 'clock':
        return <Clock className="h-4 w-4" />;
      case 'zap':
        return <Zap className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-2xl font-semibold">
          <MapPin className="mr-2 h-5 w-5 text-vermilion" />
          Learning Path Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-[2px] bg-gray-100" />
          
          <div className="space-y-7">
            {stages.map((stage, index) => (
              <div key={stage.id} className="relative">
                <div className="flex">
                  {/* Stage indicator dot */}
                  <div className="relative flex-shrink-0">
                    {stage.completed ? (
                      <CheckCircle2 className="h-[22px] w-[22px] text-matcha bg-white rounded-full z-10 relative" />
                    ) : stage.current ? (
                      <MapPin className="h-[22px] w-[22px] text-vermilion bg-white rounded-full z-10 relative" />
                    ) : (
                      <Circle className={cn(
                        "h-[22px] w-[22px] bg-white rounded-full z-10 relative",
                        index <= stages.findIndex(s => s.current) ? "text-gray-400" : "text-gray-200"
                      )} />
                    )}
                  </div>
                  
                  {/* Stage content */}
                  <div className={cn(
                    "ml-4 w-full",
                    stage.current ? "pb-5" : "pb-0"
                  )}>
                    <h3 className={cn(
                      "text-base font-semibold leading-tight",
                      stage.completed ? "text-matcha" : 
                      stage.current ? "text-vermilion" :
                      "text-gray-700"
                    )}>
                      {stage.title}
                    </h3>
                    <p className="text-gray-500 mt-1 text-sm">{stage.description}</p>
                    
                    {/* Available features for this stage */}
                    {stage.features && stage.features.length > 0 && (stage.current || stage.completed) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {stage.features.map((feature, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline"
                            className={cn(
                              "flex items-center gap-1 py-1",
                              feature.available ? "bg-gray-50" : "bg-gray-50 opacity-60"
                            )}
                          >
                            {renderFeatureIcon(feature.icon)}
                            <span className="text-xs">{feature.name}</span>
                            {!feature.available && (
                              <span className="text-xs text-gray-400 ml-1">(Coming Soon)</span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Progress indicator for current stage */}
                    {stage.current && stage.progress > 0 && (
                      <div className="mt-3 pl-0">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-gray-600 font-medium">Progress</span>
                          <span className="text-gray-600">{Math.round(stage.progress)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
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

                    {/* Visual indicator for completed stages */}
                    {stage.completed && (
                      <div className="mt-1 text-xs text-matcha flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        <span>Completed</span>
                      </div>
                    )}

                    {/* Future stage indicator */}
                    {!stage.completed && !stage.current && index > stages.findIndex(s => s.current) && (
                      <div className="mt-1 text-xs text-gray-400">
                        Complete previous stage to unlock
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
