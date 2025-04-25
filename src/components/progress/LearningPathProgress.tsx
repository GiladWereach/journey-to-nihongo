
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { LearningStage } from '@/types/progress';
import StageIndicator from './learning-path/StageIndicator';
import StageContent from './learning-path/StageContent';

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
    }
  ];

  const currentStageIndex = stages.findIndex(s => s.current);

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
                  <StageIndicator 
                    completed={stage.completed}
                    current={stage.current}
                    index={index}
                    currentStageIndex={currentStageIndex}
                  />
                  <StageContent stage={stage} />
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
