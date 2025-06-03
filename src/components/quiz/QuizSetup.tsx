
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { KanaType, QuizSettings } from '@/types/quiz';
import { hiraganaCharacters } from '@/data/hiraganaData';
import { katakanaCharacters } from '@/data/katakanaData';

interface QuizSetupProps {
  onStartQuiz: (kanaType: KanaType, settings: QuizSettings) => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz }) => {
  const [selectedType, setSelectedType] = useState<KanaType>('hiragana');
  const [settings, setSettings] = useState<QuizSettings>({
    showBasicOnly: true,
    showPreviouslyLearned: true,
    showTroubleCharacters: true,
    characterSize: 'medium',
    audioFeedback: true,
    speedMode: false,
    includeDakuten: false,
    includeHandakuten: false
  });

  const hiraganaCount = hiraganaCharacters.length;
  const katakanaCount = katakanaCharacters.length;

  const handleStart = () => {
    onStartQuiz(selectedType, settings);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose Character Set</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                selectedType === 'hiragana' 
                  ? 'ring-2 ring-matcha bg-green-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedType('hiragana')}
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-japanese mb-2 text-matcha">ひらがな</div>
                <div className="font-semibold">Hiragana</div>
                <Badge variant="secondary" className="mt-2">
                  {hiraganaCount} characters
                </Badge>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                selectedType === 'katakana' 
                  ? 'ring-2 ring-vermilion bg-red-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedType('katakana')}
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-japanese mb-2 text-vermilion">カタカナ</div>
                <div className="font-semibold">Katakana</div>
                <Badge variant="secondary" className="mt-2">
                  {katakanaCount} characters
                </Badge>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Character Size</span>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <Button
                    key={size}
                    variant={settings.characterSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, characterSize: size }))}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span>Audio Feedback</span>
              <Button
                variant={settings.audioFeedback ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, audioFeedback: !prev.audioFeedback }))}
              >
                {settings.audioFeedback ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span>Speed Mode</span>
              <Button
                variant={settings.speedMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, speedMode: !prev.speedMode }))}
              >
                {settings.speedMode ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          onClick={handleStart} 
          size="lg"
          className="w-full md:w-auto"
        >
          Start Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizSetup;
