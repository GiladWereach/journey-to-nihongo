
export type KanaType = 'hiragana' | 'katakana';

export interface QuizSettings {
  showBasicOnly: boolean;
  showPreviouslyLearned: boolean;
  showTroubleCharacters: boolean;
  characterSize: 'small' | 'medium' | 'large';
  audioFeedback: boolean;
  speedMode: boolean;
  includeDakuten: boolean;
  includeHandakuten: boolean;
}

export interface QuizCharacter {
  id: string;
  character: string;
  romaji: string;
  type: KanaType;
  stroke_count: number;
  stroke_order: string[];
  examples?: Array<{
    word: string;
    reading: string;
    meaning: string;
    romaji: string;
  }>;
}

export interface QuizCharacterSet {
  id: string;
  name: string;
  description: string;
  characters: QuizCharacter[];
  type: KanaType;
}

export interface QuizSessionStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpent: number;
  characterResults: Array<{
    character: string;
    correct: boolean;
    timeSpent: number;
  }>;
}

export interface QuizState {
  currentQuestionIndex: number;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  startTime: Date;
  endTime?: Date;
  isComplete: boolean;
}

export interface QuizQuestion {
  character: QuizCharacter;
  options: string[];
  correctAnswer: string;
  type: 'character-to-romaji' | 'romaji-to-character';
}

export interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}
