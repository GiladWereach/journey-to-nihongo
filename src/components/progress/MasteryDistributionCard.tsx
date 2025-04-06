
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

interface MasteryDistributionCardProps {
  hiragana: {
    level0: number;
    level1: number;
    level2: number;
    level3Plus: number;
    total: number;
  };
  katakana: {
    level0: number;
    level1: number;
    level2: number;
    level3Plus: number;
    total: number;
  };
  className?: string;
}

const MasteryDistributionCard: React.FC<MasteryDistributionCardProps> = ({
  hiragana,
  katakana,
  className
}) => {
  // Calculate mastery percentages
  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Mastery Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Hiragana</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Learning</span>
                  <span className="text-sm text-muted-foreground">
                    {hiragana.level0} of {hiragana.total}
                  </span>
                </div>
                <ProgressIndicator 
                  progress={calculatePercentage(hiragana.level0, hiragana.total)}
                  color="bg-amber-500"
                  size="sm"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Disappearing (Level 1-2)</span>
                  <span className="text-sm text-muted-foreground">
                    {hiragana.level1 + hiragana.level2} of {hiragana.total}
                  </span>
                </div>
                <ProgressIndicator 
                  progress={calculatePercentage(hiragana.level1 + hiragana.level2, hiragana.total)}
                  color="bg-blue-500"
                  size="sm"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Mastered (Level 3+)</span>
                  <span className="text-sm text-muted-foreground">
                    {hiragana.level3Plus} of {hiragana.total}
                  </span>
                </div>
                <ProgressIndicator 
                  progress={calculatePercentage(hiragana.level3Plus, hiragana.total)}
                  color="bg-green-500"
                  size="sm"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Katakana</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Learning</span>
                  <span className="text-sm text-muted-foreground">
                    {katakana.level0} of {katakana.total}
                  </span>
                </div>
                <ProgressIndicator 
                  progress={calculatePercentage(katakana.level0, katakana.total)}
                  color="bg-amber-500"
                  size="sm"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Disappearing (Level 1-2)</span>
                  <span className="text-sm text-muted-foreground">
                    {katakana.level1 + katakana.level2} of {katakana.total}
                  </span>
                </div>
                <ProgressIndicator 
                  progress={calculatePercentage(katakana.level1 + katakana.level2, katakana.total)}
                  color="bg-blue-500"
                  size="sm"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Mastered (Level 3+)</span>
                  <span className="text-sm text-muted-foreground">
                    {katakana.level3Plus} of {katakana.total}
                  </span>
                </div>
                <ProgressIndicator 
                  progress={calculatePercentage(katakana.level3Plus, katakana.total)}
                  color="bg-green-500"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MasteryDistributionCard;
