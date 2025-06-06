
import React from 'react';
import { Button } from '@/components/ui/button';
import { TraditionalCard } from '@/components/ui/TraditionalAtmosphere';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { KanaType } from '@/types/kana';

interface SimpleQuizSetupProps {
  onStartQuiz: (kanaType: KanaType) => void;
}

const SimpleQuizSetup: React.FC<SimpleQuizSetupProps> = ({ onStartQuiz }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <p className="text-wood-light/80 font-traditional text-lg">
          Select the type of kana you'd like to practice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hiragana Option */}
        <TraditionalCard 
          className="bg-gradient-to-br from-matcha/20 to-matcha/10 border-matcha/40 cursor-pointer"
          onClick={() => onStartQuiz('hiragana')}
        >
          <div className="p-8 text-center">
            <div className="mb-6">
              <JapaneseCharacter character="あ" size="lg" color="text-lantern-warm" />
            </div>
            <h3 className="text-xl font-traditional text-paper-warm mb-3">Hiragana Quiz</h3>
            <p className="text-wood-light/70 font-traditional text-sm mb-6">
              Practice the basic Japanese syllabary used for native words
            </p>
            <Button 
              className="w-full bg-matcha hover:bg-matcha/90 text-paper-warm font-traditional"
              onClick={(e) => {
                e.stopPropagation();
                onStartQuiz('hiragana');
              }}
            >
              Start Hiragana Quiz
            </Button>
          </div>
        </TraditionalCard>

        {/* Katakana Option */}
        <TraditionalCard 
          className="bg-gradient-to-br from-vermilion/20 to-vermilion/10 border-vermilion/40 cursor-pointer"
          onClick={() => onStartQuiz('katakana')}
        >
          <div className="p-8 text-center">
            <div className="mb-6">
              <JapaneseCharacter character="ア" size="lg" color="text-lantern-warm" />
            </div>
            <h3 className="text-xl font-traditional text-paper-warm mb-3">Katakana Quiz</h3>
            <p className="text-wood-light/70 font-traditional text-sm mb-6">
              Practice the syllabary used for foreign words and names
            </p>
            <Button 
              className="w-full bg-vermilion hover:bg-vermilion/90 text-paper-warm font-traditional"
              onClick={(e) => {
                e.stopPropagation();
                onStartQuiz('katakana');
              }}
            >
              Start Katakana Quiz
            </Button>
          </div>
        </TraditionalCard>
      </div>

      <div className="text-center">
        <p className="text-wood-light/60 font-traditional text-sm">
          Choose your preferred kana type to begin your practice session
        </p>
      </div>
    </div>
  );
};

export default SimpleQuizSetup;
