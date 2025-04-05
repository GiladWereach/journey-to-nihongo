
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [groupingTab, setGroupingTab] = useState<'consonant' | 'vowel'>('consonant');

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
  const groupedSetsByConsonant = availableSets.reduce((groups: Record<string, QuizCharacterSet[]>, set) => {
    const groupKey = set.consonantGroup || 'other';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(set);
    return groups;
  }, {});

  const groupedSetsByVowel = availableSets.reduce((groups: Record<string, QuizCharacterSet[]>, set) => {
    const groupKey = set.vowelGroup || 'other';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(set);
    return groups;
  }, {});

  // Sort group keys for better display order
  const consonantOrder = ['vowels', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'special', 'dakuten', 'handakuten', 'combinations', 'all', 'other'];
  const vowelOrder = ['a', 'i', 'u', 'e', 'o', 'all', 'special', 'other'];

  const sortedConsonantGroups = Object.keys(groupedSetsByConsonant).sort((a, b) => {
    return consonantOrder.indexOf(a) - consonantOrder.indexOf(b);
  });

  const sortedVowelGroups = Object.keys(groupedSetsByVowel).sort((a, b) => {
    return vowelOrder.indexOf(a) - vowelOrder.indexOf(b);
  });

  const isSetSelected = (set: QuizCharacterSet) => {
    return selectedSets.some(s => s.id === set.id);
  };

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
          {loadingCharacterSets ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
            </div>
          ) : (
            <Tabs 
              value={groupingTab} 
              onValueChange={(value) => setGroupingTab(value as 'consonant' | 'vowel')}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-2 mb-6">
                <TabsTrigger value="consonant">Group by Consonant</TabsTrigger>
                <TabsTrigger value="vowel">Group by Vowel</TabsTrigger>
              </TabsList>
              
              <TabsContent value="consonant" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedConsonantGroups
                    .filter(groupName => groupName !== 'all') // Exclude 'all' as it's redundant with separate vowel tab
                    .map((groupName) => (
                      <div key={groupName} className="border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start gap-2">
                          <Checkbox 
                            id={`group-${groupName}`} 
                            className="mt-1.5"
                            checked={groupedSetsByConsonant[groupName].every(set => 
                              selectedSets.some(s => s.id === set.id)
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                // Select all sets in this group
                                const setsToAdd = groupedSetsByConsonant[groupName].filter(set => 
                                  !selectedSets.some(s => s.id === set.id)
                                );
                                setSelectedSets([...selectedSets, ...setsToAdd]);
                              } else {
                                // Deselect all sets in this group
                                setSelectedSets(selectedSets.filter(s => 
                                  !groupedSetsByConsonant[groupName].some(gs => gs.id === s.id)
                                ));
                              }
                            }}
                          />
                          <div className="flex-1">
                            <Label htmlFor={`group-${groupName}`} className="font-medium cursor-pointer capitalize">
                              {groupName === 'vowels' ? 'Vowels' : `${groupName.toUpperCase()} Group`}
                            </Label>
                            <div className="flex flex-wrap mt-2 gap-1.5">
                              {groupedSetsByConsonant[groupName][0]?.characters.map((char) => (
                                <div 
                                  key={char.id} 
                                  className={`flex items-center justify-center h-8 w-8 rounded-sm border ${
                                    groupedSetsByConsonant[groupName].every(set => isSetSelected(set)) ? 'bg-muted/60' : 'bg-background'
                                  }`}
                                >
                                  <JapaneseCharacter 
                                    character={char.character} 
                                    size="sm" 
                                    color={kanaType === 'hiragana' ? 'text-matcha' : 'text-vermilion'} 
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="vowel" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedVowelGroups
                    .filter(groupName => groupName !== 'all' && groupName !== 'special') // Filter out redundant categories
                    .map((groupName) => (
                      <div key={groupName} className="border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start gap-2">
                          <Checkbox 
                            id={`vowel-group-${groupName}`}
                            className="mt-1.5"
                            checked={groupedSetsByVowel[groupName].every(set => 
                              selectedSets.some(s => s.id === set.id)
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                // Select all sets in this group
                                const setsToAdd = groupedSetsByVowel[groupName].filter(set => 
                                  !selectedSets.some(s => s.id === set.id)
                                );
                                setSelectedSets([...selectedSets, ...setsToAdd]);
                              } else {
                                // Deselect all sets in this group
                                setSelectedSets(selectedSets.filter(s => 
                                  !groupedSetsByVowel[groupName].some(gs => gs.id === s.id)
                                ));
                              }
                            }}
                          />
                          <div className="flex-1">
                            <Label htmlFor={`vowel-group-${groupName}`} className="font-medium cursor-pointer capitalize">
                              {groupName.toUpperCase()} Row
                            </Label>
                            <div className="flex flex-wrap mt-2 gap-1.5">
                              {groupedSetsByVowel[groupName][0]?.characters.slice(0, 10).map((char) => (
                                <div 
                                  key={char.id} 
                                  className={`flex items-center justify-center h-8 w-8 rounded-sm border ${
                                    groupedSetsByVowel[groupName].every(set => isSetSelected(set)) ? 'bg-muted/60' : 'bg-background'
                                  }`}
                                >
                                  <JapaneseCharacter 
                                    character={char.character} 
                                    size="sm" 
                                    color={kanaType === 'hiragana' ? 'text-matcha' : 'text-vermilion'} 
                                  />
                                </div>
                              ))}
                              {groupedSetsByVowel[groupName][0]?.characters.length > 10 && (
                                <div className="flex items-center justify-center h-8 rounded-sm border bg-muted px-2">
                                  <span className="text-xs text-muted-foreground">+{groupedSetsByVowel[groupName][0]?.characters.length - 10}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {selectedSets.length > 0 && (
            <div className="mt-4 p-2 bg-muted/80 rounded-md text-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="basic-only">Basic Characters Only</Label>
                <p className="text-xs text-muted-foreground">Exclude dakuten and handakuten</p>
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
                <p className="text-xs text-muted-foreground">Show characters already practiced</p>
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
                <p className="text-xs text-muted-foreground">Prioritize lower accuracy chars</p>
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
                <p className="text-xs text-muted-foreground">Play correct/incorrect sounds</p>
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
