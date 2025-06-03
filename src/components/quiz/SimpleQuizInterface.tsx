
import React from 'react';
import EnhancedQuizInterface from './EnhancedQuizInterface';
import { KanaType } from '@/types/kana';
import { QuizSession } from '@/services/quizSessionService';

interface SimpleQuizInterfaceProps {
  kanaType: KanaType;
  onEndQuiz: () => void;
  session: QuizSession | null;
}

// This component now serves as a wrapper to maintain backwards compatibility
// while using the enhanced quiz interface underneath
const SimpleQuizInterface: React.FC<SimpleQuizInterfaceProps> = (props) => {
  return <EnhancedQuizInterface {...props} />;
};

export default SimpleQuizInterface;
