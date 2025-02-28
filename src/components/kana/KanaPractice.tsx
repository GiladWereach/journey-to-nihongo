
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { KanaCharacter, KanaType, UserKanaProgress } from '@/types/kana';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { kanaService } from '@/services/kanaService';

interface KanaPracticeProps {
  practiceType: 'recognition' | 'matching';
  kanaType: KanaType | 'all';
  onComplete: (results: PracticeResult) => void;
  onCancel: () => void;
}

export interface PracticeResult {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  characterResults: {
    characterId: string;
    character: string;
    correct: boolean;
  }[];
}

const KanaPractice: React.FC<KanaPracticeProps> = ({ 
  practiceType, 
  kanaType, 
  onComplete, 
  onCancel 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [practiceItems, setPracticeItems] = useState<KanaCharacter[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [results, setResults] = useState<PracticeResult>({
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    characterResults: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<string[]>([]);
  
  // For matching mode
  const [matchCharacters, setMatchCharacters] = useState<{char: string, romaji: string, id: string, selected: boolean}[]>([]);
  const [currentMatching, setCurrentMatching] = useState<{char: string, romaji: string, id: string} | null>(null);
  const [matchingPairs, setMatchingPairs] = useState<{char: string, romaji: string, id: string, correct: boolean}[]>([]);
  const [progressSyncError, setProgressSyncError] = useState(false);

  // Generate random options for multiple choice
  const generateOptions = (correctAnswer: string, allItems: KanaCharacter[]) => {
    const otherOptions = allItems
      .filter(item => item.romaji !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(item => item.romaji);
    
    const allOptions = [...otherOptions, correctAnswer];
    return allOptions.sort(() => 0.5 - Math.random());
  };

  // Generate matching pairs for matching mode
  const generateMatchingPairs = (items: KanaCharacter[]) => {
    // Create a shuffled array of characters for matching
    return items.map(item => ({
      char: item.character,
      romaji: item.romaji,
      id: item.id,
      selected: false
    })).sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    const loadPracticeItems = async () => {
      try {
        setIsLoading(true);
        let items: KanaCharacter[] = [];
        
        // Get characters based on selected type
        if (kanaType === 'all') {
          items = kanaService.getAllKana();
        } else {
          items = kanaService.getKanaByType(kanaType);
        }
        
        // For now, limit to 5 items for quicker testing
        // In a production app, we would use more sophisticated selection based on SRS
        const shuffledItems = items.sort(() => 0.5 - Math.random()).slice(0, 5);
        setPracticeItems(shuffledItems);
        
        if (shuffledItems.length > 0) {
          if (practiceType === 'recognition') {
            setOptions(generateOptions(shuffledItems[0].romaji, items));
          } else if (practiceType === 'matching') {
            // Initialize matching pairs
            setMatchCharacters(generateMatchingPairs(shuffledItems));
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading practice items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load practice items. Please try again.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };
    
    loadPracticeItems();
  }, [kanaType, practiceType, toast]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleMatchingSelect = (item: {char: string, romaji: string, id: string, selected: boolean}) => {
    if (item.selected) return; // Already matched
    
    if (!currentMatching) {
      // First selection of the pair
      setCurrentMatching({
        char: item.char,
        romaji: item.romaji,
        id: item.id
      });
      
      // Mark this item as temporarily selected
      setMatchCharacters(prev => prev.map(c => 
        c.id === item.id ? {...c, selected: true} : c
      ));
    } else {
      // Second selection - check if it's a match
      const isMatch = currentMatching.romaji === item.romaji;
      
      // Create a new matched pair
      const newPair = {
        char: isMatch ? currentMatching.char : item.char,
        romaji: isMatch ? currentMatching.romaji : item.romaji,
        id: isMatch ? currentMatching.id : item.id,
        correct: isMatch
      };
      
      // Update results
      const updatedResults = { ...results };
      updatedResults.totalQuestions++;
      if (isMatch) updatedResults.correctAnswers++;
      updatedResults.accuracy = (updatedResults.correctAnswers / updatedResults.totalQuestions) * 100;
      
      // Add to character results
      const charToUpdate = isMatch ? currentMatching.id : item.id;
      updatedResults.characterResults.push({
        characterId: charToUpdate,
        character: isMatch ? currentMatching.char : item.char,
        correct: isMatch
      });
      
      setResults(updatedResults);
      
      // Add to matching pairs
      setMatchingPairs(prev => [...prev, newPair]);
      
      // Mark both items as selected
      setMatchCharacters(prev => prev.map(c => 
        c.id === item.id || c.id === currentMatching.id ? {...c, selected: true} : c
      ));
      
      // Reset current matching
      setCurrentMatching(null);
      
      // Update user progress in database if user is logged in
      if (user) {
        updateUserProgress(charToUpdate, isMatch);
      }
      
      // Check if all pairs are matched
      const updatedMatchChars = matchCharacters.map(c => 
        c.id === item.id || c.id === currentMatching?.id ? {...c, selected: true} : c
      );
      
      const allMatched = updatedMatchChars.every(c => c.selected);
      if (allMatched) {
        // All items are matched, move to results
        setTimeout(() => {
          onComplete(updatedResults);
        }, 1500); // Give time to see the last pair result
      }
    }
  };

  const checkAnswer = () => {
    if (!selectedAnswer) return;
    
    const currentKana = practiceItems[currentStep];
    const isAnswerCorrect = selectedAnswer === currentKana.romaji;
    setIsCorrect(isAnswerCorrect);
    
    // Update results
    const updatedResults = { ...results };
    updatedResults.totalQuestions++;
    if (isAnswerCorrect) updatedResults.correctAnswers++;
    updatedResults.accuracy = (updatedResults.correctAnswers / updatedResults.totalQuestions) * 100;
    
    updatedResults.characterResults.push({
      characterId: currentKana.id,
      character: currentKana.character,
      correct: isAnswerCorrect
    });
    
    setResults(updatedResults);
    
    // Update user progress in database if user is logged in
    if (user) {
      updateUserProgress(currentKana.id, isAnswerCorrect);
    }
  };

  const updateUserProgress = async (characterId: string, wasCorrect: boolean) => {
    if (!user) return;
    
    try {
      // Get existing progress for this character
      const allProgress = await kanaService.getUserKanaProgress(user.id);
      const existingProgress = allProgress.find(p => p.characterId === characterId);
      
      let proficiency = existingProgress ? existingProgress.proficiency : 0;
      let mistakeCount = existingProgress ? existingProgress.mistakeCount : 0;
      let totalPracticeCount = existingProgress ? existingProgress.totalPracticeCount + 1 : 1;
      
      // Simple proficiency algorithm: increase by 10 for correct answers, decrease by 5 for mistakes
      // In a production app, this would be more sophisticated
      if (wasCorrect) {
        proficiency = Math.min(100, proficiency + 10);
      } else {
        proficiency = Math.max(0, proficiency - 5);
        mistakeCount++;
      }
      
      // Save the updated progress
      const result = await kanaService.updateKanaProgress({
        userId: user.id,
        characterId,
        proficiency,
        mistakeCount,
        totalPracticeCount
      });
      
      if (!result && !progressSyncError) {
        setProgressSyncError(true);
        toast({
          title: "Progress Sync",
          description: "Your progress is being tracked for this session, but we're having trouble syncing it to your account.",
          variant: "warning"
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      if (!progressSyncError) {
        setProgressSyncError(true);
        toast({
          title: "Progress Sync",
          description: "Your progress is being tracked for this session, but we're having trouble syncing it to your account.",
          variant: "warning"
        });
      }
    }
  };

  const goToNextStep = () => {
    if (currentStep < practiceItems.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setOptions(generateOptions(practiceItems[nextStep].romaji, practiceItems));
    } else {
      // Practice session complete
      onComplete(results);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
      </div>
    );
  }

  if (practiceItems.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold mb-4">No practice items available</h3>
        <Button onClick={onCancel}>Go Back</Button>
      </div>
    );
  }

  const currentKana = practiceItems[currentStep];
  const progress = ((currentStep + 1) / practiceItems.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        {practiceType === 'recognition' && (
          <ProgressIndicator 
            progress={progress} 
            size="sm" 
            color="bg-indigo" 
            label={`Question ${currentStep + 1} of ${practiceItems.length}`} 
            showPercentage 
          />
        )}
        
        {practiceType === 'matching' && (
          <ProgressIndicator 
            progress={(matchingPairs.length / practiceItems.length) * 100} 
            size="sm" 
            color="bg-indigo" 
            label={`Pairs matched: ${matchingPairs.length} of ${practiceItems.length}`} 
            showPercentage 
          />
        )}
      </div>
      
      {practiceType === 'recognition' && (
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">What is this character?</CardTitle>
            <div className="mt-6 flex justify-center">
              <JapaneseCharacter 
                character={currentKana.character} 
                size="xl" 
                animated={true} 
                className="text-indigo" 
              />
            </div>
          </CardHeader>
          
          <CardContent>
            <RadioGroup 
              value={selectedAnswer || ''} 
              onValueChange={handleAnswerSelect}
              className="grid grid-cols-2 gap-4 mt-4"
            >
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option} 
                    id={option}
                    disabled={isCorrect !== null}
                    className={cn(
                      isCorrect !== null && option === currentKana.romaji && "border-green-500 text-green-500",
                      isCorrect === false && option === selectedAnswer && "border-red-500 text-red-500"
                    )}
                  />
                  <Label 
                    htmlFor={option}
                    className={cn(
                      "text-lg px-4 py-2 border rounded-md w-full text-center hover:bg-gray-50 cursor-pointer",
                      isCorrect !== null && option === currentKana.romaji && "border-green-500 text-green-500 bg-green-50",
                      isCorrect === false && option === selectedAnswer && "border-red-500 text-red-500 bg-red-50"
                    )}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            
            {isCorrect === null ? (
              <Button 
                onClick={checkAnswer} 
                disabled={!selectedAnswer}
                className="bg-indigo hover:bg-indigo/90"
              >
                Check Answer
              </Button>
            ) : (
              <div className="flex flex-col items-end space-y-2">
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md",
                  isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span>{isCorrect ? 'Correct!' : `Incorrect. The answer is "${currentKana.romaji}"`}</span>
                </div>
                <Button 
                  onClick={goToNextStep}
                  className="bg-indigo hover:bg-indigo/90 flex items-center gap-2"
                >
                  {currentStep < practiceItems.length - 1 ? 'Next Question' : 'See Results'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      )}
      
      {practiceType === 'matching' && (
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Match the Kana with their Sounds</CardTitle>
            <CardDescription>
              Click on a character and then click on its matching pronunciation.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {matchCharacters.map((item, index) => (
                <Button
                  key={`${item.id}-${index}`}
                  onClick={() => handleMatchingSelect(item)}
                  disabled={item.selected}
                  variant="outline"
                  className={cn(
                    "h-16 text-xl font-semibold",
                    item.selected && "opacity-50 cursor-not-allowed",
                    currentMatching?.id === item.id && "border-2 border-indigo bg-indigo/10"
                  )}
                >
                  {index % 2 === 0 ? item.char : item.romaji}
                </Button>
              ))}
            </div>
            
            {matchingPairs.length > 0 && (
              <div className="mt-8 pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Matched Pairs:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {matchingPairs.map((pair, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-md border",
                        pair.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                      )}
                    >
                      <span className="text-xl">{pair.char}</span>
                      <span className="text-sm px-2">=</span>
                      <span>{pair.romaji}</span>
                      {pair.correct ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500 ml-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            
            <Button 
              onClick={() => onComplete(results)}
              className="bg-indigo hover:bg-indigo/90"
              disabled={matchingPairs.length < practiceItems.length}
            >
              Complete Practice
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {progressSyncError && user && (
        <div className="p-4 border border-amber-200 rounded-lg mb-4 bg-amber-50">
          <p className="text-sm text-amber-800">
            <span className="font-medium">Note:</span> Your progress for this session is being tracked locally. We'll try to sync it to your account later.
          </p>
        </div>
      )}
    </div>
  );
};

export default KanaPractice;
