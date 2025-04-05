
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Circle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { kanaService } from '@/services/kanaService';
import { quizService } from '@/services/quizService';
import { KanaType, QuizCharacterSet, QuizSettings } from '@/types/quiz';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';

interface QuizSetupProps {
  onStartQuiz: (kanaType: KanaType, characterSets: QuizCharacterSet[], settings: QuizSettings) => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz }) => {
  const { user } = useAuth();
  const [kanaType, setKanaType] = useState<KanaType>('hiragana');
  const [selectedSets, setSelectedSets] = useState<QuizCharacterSet[]>([]);
  const [settings, setSettings] = useState<QuizSettings>({
    showBasicOnly: false,
    showPreviouslyLearned: true, 
    showTroubleCharacters: false,
    characterSize: 'large',
    audioFeedback: true,
  });
  const [availableSets, setAvailableSets] = useState<QuizCharacterSet[]>([]);
  const [loadingCharacterSets, setLoadingCharacterSets] = useState(true);
  const [groupBy, setGroupBy] = useState<'consonant' | 'vowel'>('consonant');

  // Load character sets when kana type changes
  useEffect(() => {
    const loadCharacterSets = async () => {
      setLoadingCharacterSets(true);
      try {
        // Get character sets for selected kana type
        const sets = await quizService.getAvailableCharacterSets(kanaType);
        setAvailableSets(sets);
        
        // Select first group by default if nothing selected
        if (selectedSets.length === 0 && sets.length > 0) {
          setSelectedSets([sets[0]]);
        }
      } catch (error) {
        console.error('Error loading character sets:', error);
      } finally {
        setLoadingCharacterSets(false);
      }
    };
    
    loadCharacterSets();
  }, [kanaType]);

  const handleKanaTypeChange = (type: KanaType) => {
    setKanaType(type);
    setSelectedSets([]);
  };

  const toggleSetSelection = (set: QuizCharacterSet) => {
    if (selectedSets.some(s => s.id === set.id)) {
      setSelectedSets(selectedSets.filter(s => s.id !== set.id));
    } else {
      setSelectedSets([...selectedSets, set]);
    }
  };

  const selectAllSets = () => {
    setSelectedSets([...availableSets]);
  };

  const deselectAllSets = () => {
    setSelectedSets([]);
  };

  const handleSettingChange = (key: keyof QuizSettings, value: any) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };

  const handleStartQuiz = () => {
    if (selectedSets.length === 0) {
      // Provide feedback that at least one set must be selected
      return;
    }
    
    onStartQuiz(kanaType, selectedSets, settings);
  };
  
  // Group the available sets by consonant or vowel
  const groupedSets = availableSets.reduce((groups: Record<string, QuizCharacterSet[]>, set) => {
    const groupKey = groupBy === 'consonant' ? set.consonantGroup || 'other' : set.vowelGroup || 'other';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(set);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-indigo">Select Writing System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              variant={kanaType === 'hiragana' ? 'default' : 'outline'}
              className={`h-24 ${kanaType === 'hiragana' ? 'bg-matcha hover:bg-matcha/90' : ''}`}
              onClick={() => handleKanaTypeChange('hiragana')}
            >
              <div className="text-center flex flex-col items-center justify-center">
                <span className="text-xl mb-2">Hiragana</span>
                <JapaneseCharacter character="あいう" size="sm" color={kanaType === 'hiragana' ? 'text-white' : 'text-matcha'} />
              </div>
            </Button>
            
            <Button
              variant={kanaType === 'katakana' ? 'default' : 'outline'}
              className={`h-24 ${kanaType === 'katakana' ? 'bg-vermilion hover:bg-vermilion/90' : ''}`}
              onClick={() => handleKanaTypeChange('katakana')}
            >
              <div className="text-center flex flex-col items-center justify-center">
                <span className="text-xl mb-2">Katakana</span>
                <JapaneseCharacter character="アイウ" size="sm" color={kanaType === 'katakana' ? 'text-white' : 'text-vermilion'} />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-indigo">Select Character Sets</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={selectAllSets}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAllSets}>
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <RadioGroup 
              defaultValue="consonant" 
              value={groupBy}
              onValueChange={(value) => setGroupBy(value as 'consonant' | 'vowel')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="consonant" id="group-consonant" />
                <Label htmlFor="group-consonant">Group by Consonant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vowel" id="group-vowel" />
                <Label htmlFor="group-vowel">Group by Vowel</Label>
              </div>
            </RadioGroup>
          </div>
        
          {loadingCharacterSets ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {Object.entries(groupedSets).map(([groupName, sets]) => (
                <AccordionItem key={groupName} value={groupName}>
                  <AccordionTrigger className="text-lg capitalize">
                    {groupName} Group 
                    <span className="text-sm text-muted-foreground ml-2">
                      ({sets.length} sets)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      {sets.map((set) => (
                        <Button
                          key={set.id}
                          variant="outline"
                          className={`h-full flex items-center justify-between px-3 py-2 hover:bg-muted ${
                            selectedSets.some(s => s.id === set.id) 
                              ? 'border-2 border-indigo' 
                              : ''
                          }`}
                          onClick={() => toggleSetSelection(set)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{set.name}</span>
                            <span className="text-sm text-muted-foreground">{set.characters.length} characters</span>
                          </div>
                          {selectedSets.some(s => s.id === set.id) ? (
                            <CheckCircle2 className="h-5 w-5 text-indigo" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          
          {selectedSets.length > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Selected: {selectedSets.length} set(s) with {selectedSets.reduce((count, set) => count + set.characters.length, 0)} characters</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-indigo">Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="basic-only">Basic Characters Only</Label>
                <p className="text-sm text-muted-foreground">Exclude dakuten and handakuten characters</p>
              </div>
              <Switch
                id="basic-only"
                checked={settings.showBasicOnly}
                onCheckedChange={(checked) => handleSettingChange('showBasicOnly', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="previously-learned">Include Previously Learned</Label>
                <p className="text-sm text-muted-foreground">Show characters you've already practiced</p>
              </div>
              <Switch
                id="previously-learned"
                checked={settings.showPreviouslyLearned}
                onCheckedChange={(checked) => handleSettingChange('showPreviouslyLearned', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="trouble-chars">Focus on Trouble Characters</Label>
                <p className="text-sm text-muted-foreground">Emphasize characters with lower accuracy</p>
              </div>
              <Switch
                id="trouble-chars"
                checked={settings.showTroubleCharacters}
                onCheckedChange={(checked) => handleSettingChange('showTroubleCharacters', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="audio-feedback">Audio Feedback</Label>
                <p className="text-sm text-muted-foreground">Play sounds for correct/incorrect answers</p>
              </div>
              <Switch
                id="audio-feedback"
                checked={settings.audioFeedback}
                onCheckedChange={(checked) => handleSettingChange('audioFeedback', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center pt-4">
        <Button 
          size="lg"
          className="bg-indigo hover:bg-indigo/90 px-8"
          disabled={selectedSets.length === 0}
          onClick={handleStartQuiz}
        >
          Start Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizSetup;
