
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { KanaType, QuizCharacterSet, QuizSettings } from '@/types/quiz';
import { quizService } from '@/services/quizService';
import { AlertCircle, Zap, Check } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface QuizSetupProps {
  onStartQuiz: (
    kanaType: KanaType, 
    characterSets: QuizCharacterSet[], 
    settings: QuizSettings
  ) => void;
  enforceSpeedMode?: boolean;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ 
  onStartQuiz,
  enforceSpeedMode = false
}) => {
  const { user } = useAuth();
  const [kanaType, setKanaType] = useState<KanaType>('hiragana');
  const [characterSets, setCharacterSets] = useState<QuizCharacterSet[]>([]);
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<QuizSettings>({
    showBasicOnly: false,
    showPreviouslyLearned: true,
    showTroubleCharacters: false,
    characterSize: 'large',
    audioFeedback: true,
    speedMode: enforceSpeedMode,
  });

  useEffect(() => {
    const fetchCharacterSets = async () => {
      setLoading(true);
      try {
        const sets = await quizService.getAvailableCharacterSets(kanaType);
        setCharacterSets(sets);
        
        if (sets.length > 0 && selectedSets.length === 0) {
          const vowelsSet = sets.find(set => set.id === `${kanaType}-vowels`);
          if (vowelsSet) {
            setSelectedSets([vowelsSet.id]);
          } else {
            setSelectedSets([sets[0].id]);
          }
        }
      } catch (error) {
        console.error('Error fetching character sets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCharacterSets();
  }, [kanaType]);
  
  useEffect(() => {
    if (enforceSpeedMode) {
      setSettings(prev => ({
        ...prev,
        speedMode: true
      }));
    }
  }, [enforceSpeedMode]);

  const toggleSetSelection = (setId: string) => {
    if (selectedSets.includes(setId)) {
      setSelectedSets(selectedSets.filter(id => id !== setId));
    } else {
      setSelectedSets([...selectedSets, setId]);
    }
  };

  const toggleSetting = (setting: keyof QuizSettings) => {
    if (setting === 'speedMode' && enforceSpeedMode) {
      return;
    }
    
    setSettings({
      ...settings,
      [setting]: !settings[setting as keyof QuizSettings]
    });
  };

  const handleStartQuiz = () => {
    if (selectedSets.length === 0) return;
    
    const selectedCharacterSets = characterSets.filter(set => selectedSets.includes(set.id));
    onStartQuiz(kanaType, selectedCharacterSets, settings);
  };

  const groupCharacterSets = () => {
    const basic = characterSets.filter(set => 
      ['vowels', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'].includes(set.consonantGroup || '')
    );
    
    const dakuten = characterSets.filter(set => 
      ['g', 'z', 'd', 'b', 'p'].includes(set.consonantGroup || '')
    );
    
    const special = characterSets.filter(set => 
      ['special', 'combinations'].includes(set.consonantGroup || '')
    );
    
    const vowels = characterSets.filter(set => 
      set.id.includes('-a-row') || 
      set.id.includes('-i-row') || 
      set.id.includes('-u-row') || 
      set.id.includes('-e-row') || 
      set.id.includes('-o-row')
    );
    
    return { basic, dakuten, special, vowels };
  };

  const renderCharacterPreview = (set: QuizCharacterSet) => {
    return (
      <div className="mt-2 flex justify-center items-center flex-wrap gap-1.5 text-sm japanese-text">
        {set.characters.slice(0, 5).map(char => (
          <span key={char.id} className="inline-block">
            {char.character}
          </span>
        ))}
        {set.characters.length > 5 && (
          <span className="text-muted-foreground text-xs">+{set.characters.length - 5}</span>
        )}
      </div>
    );
  };

  const groupedSets = groupCharacterSets();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Select Kana Type</h2>
        <Tabs 
          value={kanaType} 
          onValueChange={(value) => setKanaType(value as KanaType)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
            <TabsTrigger value="katakana">Katakana</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Select Character Sets</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedSets(characterSets.map(set => set.id))}
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedSets([])}
            >
              Clear
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Basic Characters</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {groupedSets.basic.map(set => (
                  <Card 
                    key={set.id}
                    className={`cursor-pointer hover:border-indigo transition-colors ${
                      selectedSets.includes(set.id) ? 'border-indigo bg-indigo/5' : ''
                    }`}
                    onClick={() => toggleSetSelection(set.id)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="font-semibold">{set.name.replace(' Group', '')}</div>
                      {renderCharacterPreview(set)}
                      {selectedSets.includes(set.id) && (
                        <div className="absolute top-2 right-2 text-indigo">
                          <Check size={16} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {groupedSets.dakuten.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Dakuten & Handakuten</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {groupedSets.dakuten.map(set => (
                    <Card 
                      key={set.id}
                      className={`cursor-pointer hover:border-indigo transition-colors ${
                        selectedSets.includes(set.id) ? 'border-indigo bg-indigo/5' : ''
                      }`}
                      onClick={() => toggleSetSelection(set.id)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="font-semibold">{set.name.replace(' Group', '')}</div>
                        {renderCharacterPreview(set)}
                        {selectedSets.includes(set.id) && (
                          <div className="absolute top-2 right-2 text-indigo">
                            <Check size={16} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {groupedSets.special.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Special Characters</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {groupedSets.special.map(set => (
                    <Card 
                      key={set.id}
                      className={`cursor-pointer hover:border-indigo transition-colors ${
                        selectedSets.includes(set.id) ? 'border-indigo bg-indigo/5' : ''
                      }`}
                      onClick={() => toggleSetSelection(set.id)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="font-semibold">{set.name.replace(' Group', '')}</div>
                        {renderCharacterPreview(set)}
                        {selectedSets.includes(set.id) && (
                          <div className="absolute top-2 right-2 text-indigo">
                            <Check size={16} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quiz Settings</h2>
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="audio-feedback"
                checked={settings.audioFeedback}
                onCheckedChange={() => toggleSetting('audioFeedback')}
              />
              <Label htmlFor="audio-feedback">Audio Feedback</Label>
            </div>
            <span className="text-xs text-muted-foreground">Play sounds for correct/incorrect answers</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="speed-mode"
                checked={settings.speedMode}
                onCheckedChange={() => toggleSetting('speedMode')}
                disabled={enforceSpeedMode}
              />
              <Label htmlFor="speed-mode" className="flex items-center gap-1">
                <Zap size={14} className={settings.speedMode ? "text-indigo" : "text-muted-foreground"} />
                Speed Mode
              </Label>
            </div>
            <span className="text-xs text-muted-foreground max-w-[60%]">
              {settings.speedMode ? 
                "Type the correct romaji to automatically advance." : 
                "Click Check button to validate your answer."}
            </span>
          </div>
          
          {user && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="trouble-characters"
                  checked={settings.showTroubleCharacters}
                  onCheckedChange={() => toggleSetting('showTroubleCharacters')}
                />
                <Label htmlFor="trouble-characters" className="flex items-center gap-1">
                  <AlertCircle size={14} className={settings.showTroubleCharacters ? "text-indigo" : "text-muted-foreground"} />
                  Prioritize Trouble Characters
                </Label>
              </div>
              <span className="text-xs text-muted-foreground max-w-[60%]">
                Focus on characters you've had difficulty with
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-4">
        <Button 
          onClick={handleStartQuiz}
          disabled={selectedSets.length === 0}
          className="w-full"
          size="lg"
        >
          Start Quiz
        </Button>
        {selectedSets.length === 0 && (
          <p className="text-xs text-red-500 mt-1 text-center">
            Please select at least one character set
          </p>
        )}
      </div>
    </div>
  );
};

export default QuizSetup;
