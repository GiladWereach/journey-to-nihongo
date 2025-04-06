import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  PlayCircle, 
  PauseCircle, 
  RotateCcw, 
  CheckCircle2, 
  XCircle,
  Trophy 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { kanaService } from '@/services/kanaService';
import { Progress } from '@/components/ui/progress';
import { KanaType, KanaCharacter } from '@/types/kana';
import { QuizCharacter } from '@/types/quiz';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';

// Default time in seconds
const DEFAULT_TIME = 60;
const CORRECT_ANSWER_POINTS = 10;
const TIME_BONUS_POINTS = 2;

interface TimedChallengeProps {}

const TimedChallenge: React.FC<TimedChallengeProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get kana type from location state or default to 'hiragana'
  const kanaType: KanaType = location.state?.kanaType || 'hiragana';
  
  // State for game
  const [characters, setCharacters] = useState<QuizCharacter[]>([]);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_TIME);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const incorrectSoundRef = useRef<HTMLAudioElement | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize sounds
  useEffect(() => {
    incorrectSoundRef.current = new Audio('/sounds/incorrect.mp3');
    correctSoundRef.current = new Audio('/sounds/correct.mp3');
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  // Fetch characters
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        // Fix: Use getKanaByType instead of getKanaCharacters which doesn't exist
        const allKanaCharacters = kanaService.getKanaByType(kanaType);
        
        // Convert KanaCharacter[] to QuizCharacter[]
        const quizCharacters: QuizCharacter[] = allKanaCharacters.map(kana => ({
          id: kana.id,
          character: kana.character,
          romaji: kana.romaji,
          type: kana.type as KanaType
        }));
        
        // Shuffle the characters
        const shuffled = [...quizCharacters].sort(() => Math.random() - 0.5);
        setCharacters(shuffled);
      } catch (error) {
        console.error('Error fetching characters:', error);
        toast({
          title: 'Error',
          description: 'Failed to load characters. Please try again.',
          variant: 'destructive',
        });
      }
    };
    
    fetchCharacters();
  }, [kanaType, toast]);
  
  // Generate options when current character changes
  useEffect(() => {
    if (characters.length === 0 || currentCharacterIndex >= characters.length) return;
    
    const currentCharacter = characters[currentCharacterIndex];
    const otherCharacters = characters.filter((_, index) => index !== currentCharacterIndex);
    
    // Get 3 random incorrect options
    const shuffledIncorrect = [...otherCharacters].sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [currentCharacter.romaji, ...shuffledIncorrect.map(c => c.romaji)];
    
    // Shuffle all options
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  }, [currentCharacterIndex, characters]);
  
  // Handle timer
  useEffect(() => {
    if (isGameStarted && !isPaused && !showResults) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - end the game
            clearInterval(timerRef.current!);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameStarted, isPaused, showResults]);
  
  const startGame = () => {
    if (characters.length === 0) {
      toast({
        title: 'Error',
        description: 'No characters available. Please try again.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGameStarted(true);
    setIsPaused(false);
    setTimeRemaining(DEFAULT_TIME);
    setScore(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setCurrentCharacterIndex(0);
    setShowResults(false);
  };
  
  const pauseGame = () => {
    setIsPaused(true);
  };
  
  const resumeGame = () => {
    setIsPaused(false);
  };
  
  const restartGame = () => {
    setIsGameStarted(false);
    setShowResults(false);
    
    // Shuffle characters again
    const shuffled = [...characters].sort(() => Math.random() - 0.5);
    setCharacters(shuffled);
    
    // Small delay to reset the UI
    setTimeout(() => {
      startGame();
    }, 100);
  };
  
  const handleOptionSelect = (selectedRomaji: string) => {
    const correctRomaji = characters[currentCharacterIndex].romaji;
    const isCorrect = selectedRomaji === correctRomaji;
    
    if (isCorrect) {
      // Play sound
      if (correctSoundRef.current) {
        correctSoundRef.current.currentTime = 0;
        correctSoundRef.current.play().catch(e => console.error('Error playing sound:', e));
      }
      
      // Award points - base + time bonus
      const points = CORRECT_ANSWER_POINTS + TIME_BONUS_POINTS;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      
      // Show toast for correct answer
      toast({
        title: 'Correct!',
        description: `+${points} points`,
        variant: 'default',
      });
    } else {
      // Play sound
      if (incorrectSoundRef.current) {
        incorrectSoundRef.current.currentTime = 0;
        incorrectSoundRef.current.play().catch(e => console.error('Error playing sound:', e));
      }
      
      setIncorrectAnswers(prev => prev + 1);
      
      // Show toast for incorrect answer
      toast({
        title: 'Incorrect',
        description: `The correct answer was: ${correctRomaji}`,
        variant: 'destructive',
      });
    }
    
    // Move to next character
    const nextIndex = currentCharacterIndex + 1;
    if (nextIndex < characters.length) {
      setCurrentCharacterIndex(nextIndex);
    } else {
      // If we've gone through all characters, show results
      setShowResults(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Accuracy percentage
  const accuracy = correctAnswers + incorrectAnswers > 0 
    ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100)
    : 0;
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 bg-softgray/30">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-indigo mb-2">Timed Challenge</h1>
            <p className="text-gray-600">
              How many {kanaType} characters can you identify in {DEFAULT_TIME} seconds?
            </p>
          </div>
          
          {!isGameStarted && !showResults ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-10">
                <Clock className="h-20 w-20 text-indigo mb-6" />
                <h2 className="text-2xl font-bold mb-4">Ready to Challenge Yourself?</h2>
                <p className="text-center text-gray-600 mb-6">
                  Identify as many {kanaType} characters as you can before the timer runs out!
                  <br />You'll get {CORRECT_ANSWER_POINTS} points for each correct answer plus a time bonus.
                </p>
                <Button 
                  onClick={startGame} 
                  className="bg-indigo hover:bg-indigo/90 flex items-center gap-2"
                  size="lg"
                >
                  <PlayCircle />
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          ) : showResults ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-10">
                <Trophy className="h-20 w-20 text-amber-500 mb-6" />
                <h2 className="text-2xl font-bold mb-2">Challenge Complete!</h2>
                <p className="text-center text-gray-600 mb-6">
                  Here's how you did:
                </p>
                
                <div className="grid grid-cols-2 gap-6 w-full max-w-md mb-8">
                  <div className="bg-indigo/10 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-indigo mb-1">{score}</div>
                    <div className="text-sm text-gray-600">Total Score</div>
                  </div>
                  <div className="bg-indigo/10 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-indigo mb-1">{accuracy}%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{correctAnswers}</div>
                    <div className="text-sm text-gray-600">Correct</div>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">{incorrectAnswers}</div>
                    <div className="text-sm text-gray-600">Incorrect</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={restartGame} 
                    className="bg-indigo hover:bg-indigo/90 flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Play Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/practice')}
                  >
                    Return to Practice Hub
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 bg-indigo/10 px-4 py-2 rounded-lg">
                  <Clock className="h-5 w-5 text-indigo" />
                  <span className="text-2xl font-bold text-indigo">{formatTime(timeRemaining)}</span>
                </div>
                
                <div className="flex gap-2">
                  {isPaused ? (
                    <Button 
                      onClick={resumeGame} 
                      className="bg-indigo hover:bg-indigo/90 flex items-center gap-2"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Resume
                    </Button>
                  ) : (
                    <Button 
                      onClick={pauseGame} 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <PauseCircle className="h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  <Button 
                    onClick={restartGame} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restart
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Score</div>
                    <div className="text-xl font-bold text-indigo">{score}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">{correctAnswers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium">{incorrectAnswers}</span>
                  </div>
                </div>
              </div>
              
              <Progress 
                value={(timeRemaining / DEFAULT_TIME) * 100} 
                className="h-2 mb-8"
              />
              
              {characters.length > 0 && currentCharacterIndex < characters.length && !isPaused ? (
                <div className="flex flex-col items-center">
                  <Card className="w-full max-w-md mb-6">
                    <CardContent className="p-8 flex flex-col items-center">
                      <JapaneseCharacter 
                        character={characters[currentCharacterIndex].character} 
                        size="xl"
                        className="mb-4"
                      />
                      <p className="text-gray-600 text-sm">
                        What is the romaji for this character?
                      </p>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                    {options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className="py-6 text-lg"
                        variant="outline"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : isPaused ? (
                <div className="flex flex-col items-center justify-center p-12">
                  <h3 className="text-xl font-semibold mb-4">Game Paused</h3>
                  <p className="text-gray-600 mb-6">
                    Click Resume to continue the challenge.
                  </p>
                  <Button 
                    onClick={resumeGame} 
                    className="bg-indigo hover:bg-indigo/90"
                  >
                    Resume Game
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TimedChallenge;
