
import React, { useState, useEffect } from 'react';
import { KanaCharacter } from '@/types/kana';
import KanaCanvas from './KanaCanvas';
import StrokeOrderDisplay from './StrokeOrderDisplay';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseClient } from '@/lib/supabase';

interface WritingPracticeExerciseProps {
  kanaList: KanaCharacter[];
  onComplete: () => void;
  kanaType: 'hiragana' | 'katakana';
}

const WritingPracticeExercise: React.FC<WritingPracticeExerciseProps> = ({
  kanaList,
  onComplete,
  kanaType
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [charactersCompleted, setCharactersCompleted] = useState<string[]>([]);
  const [showReference, setShowReference] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState<'success' | 'normal'>('normal');
  
  const currentKana = kanaList[currentIndex];
  
  useEffect(() => {
    setAttempts(0);
    setShowReference(false);
    setFeedbackMode('normal');
  }, [currentIndex]);
  
  // Track progress in the database
  const updateProgress = async () => {
    if (!user || !currentKana) return;
    
    try {
      // Check if progress exists
      const { data: existingProgress } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('character_id', currentKana.id)
        .single();
      
      if (existingProgress) {
        // Update existing progress
        const newProficiency = Math.min(existingProgress.proficiency + 5, 100);
        const newTotalPractice = existingProgress.total_practice_count + 1;
        
        await supabaseClient
          .from('user_kana_progress')
          .update({
            proficiency: newProficiency,
            total_practice_count: newTotalPractice,
            last_practiced: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
      } else {
        // Create new progress
        await supabaseClient
          .from('user_kana_progress')
          .insert({
            user_id: user.id,
            character_id: currentKana.id,
            proficiency: 20, // Initial proficiency
            total_practice_count: 1,
            last_practiced: new Date().toISOString(),
            review_due: new Date().toISOString()
          });
      }
      
      // Record the learning session
      if (!charactersCompleted.includes(currentKana.id)) {
        setCharactersCompleted([...charactersCompleted, currentKana.id]);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };
  
  const handleSubmission = (imageData: string) => {
    setAttempts(attempts + 1);
    
    // Provide feedback - in a real app, this would compare the drawing to the correct character
    if (attempts === 0) {
      setShowReference(true);
      toast({
        title: "Great attempt!",
        description: "Try one more time with the reference visible.",
      });
    } else {
      setFeedbackMode('success');
      toast({
        title: "Well done!",
        description: `You've practiced writing ${currentKana.character} (${currentKana.romaji})`,
        variant: "default",
      });
      
      // Update progress in database
      updateProgress();
    }
  };
  
  const handleNext = () => {
    if (currentIndex < kanaList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Create or update learning session
      if (user && charactersCompleted.length > 0) {
        createLearningSession();
      }
      
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const createLearningSession = async () => {
    if (!user) return;
    
    try {
      await supabaseClient
        .from('kana_learning_sessions')
        .insert({
          user_id: user.id,
          kana_type: kanaType,
          characters_studied: charactersCompleted,
          completed: true,
          end_time: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error creating learning session:', error);
    }
  };
  
  if (!currentKana) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <div className="text-sm text-gray-500">
          {currentIndex + 1} / {kanaList.length}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={feedbackMode !== 'success' && attempts < 2}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="text-center">
        <JapaneseCharacter
          character={currentKana.character}
          size="xl"
          color={kanaType === 'hiragana' ? 'text-matcha' : 'text-vermilion'}
          className="mx-auto"
        />
        
        <div className="mt-2">
          <h3 className="text-xl font-medium">{currentKana.romaji}</h3>
        </div>
      </div>
      
      {feedbackMode === 'success' ? (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="text-center p-6 space-y-4">
            <div className="text-green-600 text-xl font-medium">Well done!</div>
            <div>You've successfully practiced writing {currentKana.character}.</div>
            <Button 
              onClick={handleNext} 
              className="bg-green-600 hover:bg-green-700"
            >
              Continue to next character
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <StrokeOrderDisplay character={currentKana} />
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Practice Area</h3>
            <KanaCanvas 
              width={280} 
              height={280}
              onComplete={handleSubmission}
              referenceCharacter={showReference ? currentKana.character : undefined}
            />
          </div>
          
          {currentKana.examples && currentKana.examples.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Example Words</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentKana.examples.map((example, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex flex-col">
                        <div className="font-japanese text-lg">{example.word}</div>
                        <div className="text-sm text-gray-500">{example.romaji}</div>
                        <div className="text-xs text-gray-500">{example.meaning}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WritingPracticeExercise;
