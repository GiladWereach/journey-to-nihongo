
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import KanaPractice from '@/components/kana/KanaPractice';
import KanaPracticeResults from '@/components/kana/KanaPracticeResults';
import { KanaType, PracticeResult } from '@/types/kana';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';

interface PracticeSessionTabProps {
  practiceMode: 'selection' | 'practice' | 'results';
  practiceType: 'recognition' | 'matching';
  selectedKanaType: KanaType | 'all';
  practiceResults: PracticeResult | null;
  onPracticeComplete: (results: PracticeResult) => void;
  onPracticeCancel: () => void;
  onPracticeSimilar: () => void;
  onPracticeAgain: () => void;
  onFinishPractice: () => void;
}

const PracticeSessionTab: React.FC<PracticeSessionTabProps> = ({
  practiceMode,
  practiceType,
  selectedKanaType,
  practiceResults,
  onPracticeComplete,
  onPracticeCancel,
  onPracticeSimilar,
  onPracticeAgain,
  onFinishPractice
}) => {
  if (practiceMode === 'practice') {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onPracticeCancel}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-indigo">
              {practiceType === 'recognition' ? 'Recognition' : 'Matching'}
            </h2>
            <div className="flex items-center justify-center gap-2">
              {selectedKanaType === 'hiragana' ? (
                <JapaneseCharacter character="あ" size="sm" color="text-matcha" />
              ) : selectedKanaType === 'katakana' ? (
                <JapaneseCharacter character="ア" size="sm" color="text-vermilion" />
              ) : (
                <div className="flex items-center gap-1">
                  <JapaneseCharacter character="あ" size="sm" color="text-matcha" />
                  <JapaneseCharacter character="ア" size="sm" color="text-vermilion" />
                </div>
              )}
            </div>
          </div>
          <div className="w-10"></div>
        </div>
        <KanaPractice 
          practiceType={practiceType}
          kanaType={selectedKanaType}
          onComplete={onPracticeComplete}
          onCancel={onPracticeCancel}
        />
      </>
    );
  }

  if (practiceMode === 'results' && practiceResults) {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onFinishPractice}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-indigo">Results</h2>
          </div>
          <div className="w-10"></div>
        </div>
        <KanaPracticeResults 
          results={practiceResults}
          onPracticeSimilar={onPracticeSimilar}
          onPracticeAgain={onPracticeAgain}
          onFinish={onFinishPractice}
        />
      </>
    );
  }

  return null;
};

export default PracticeSessionTab;
