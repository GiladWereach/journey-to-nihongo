
export interface AssessmentQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    value: string;
  }[];
  correctAnswer: string;
  category: 'level' | 'goal' | 'time' | 'knowledge';
}

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    question: 'What is your current level of Japanese?',
    options: [
      { id: 'level-1', text: 'Complete beginner with no knowledge', value: 'beginner' },
      { id: 'level-2', text: 'Know some basic phrases and greetings', value: 'elementary' },
      { id: 'level-3', text: 'Can have simple conversations', value: 'intermediate' },
      { id: 'level-4', text: 'Can read, write and speak with some fluency', value: 'advanced' }
    ],
    correctAnswer: 'beginner',
    category: 'level'
  },
  {
    id: 2,
    question: 'What is your main goal for learning Japanese?',
    options: [
      { id: 'goal-1', text: 'Basic communication for travel', value: 'travel' },
      { id: 'goal-2', text: 'Reading manga, watching anime without subtitles', value: 'culture' },
      { id: 'goal-3', text: 'Business communication', value: 'business' },
      { id: 'goal-4', text: 'Academic purposes or passing JLPT', value: 'academic' },
      { id: 'goal-5', text: 'General interest in the language', value: 'general' }
    ],
    correctAnswer: 'general',
    category: 'goal'
  },
  {
    id: 3,
    question: 'How much time can you dedicate to learning each day?',
    options: [
      { id: 'time-1', text: '5-15 minutes', value: '10' },
      { id: 'time-2', text: '15-30 minutes', value: '20' },
      { id: 'time-3', text: '30-60 minutes', value: '45' },
      { id: 'time-4', text: 'More than 60 minutes', value: '75' }
    ],
    correctAnswer: '20',
    category: 'time'
  },
  {
    id: 4,
    question: 'Do you have any prior knowledge of Japanese writing systems?',
    options: [
      { id: 'knowledge-1', text: 'None at all', value: 'none' },
      { id: 'knowledge-2', text: 'I know some hiragana', value: 'hiragana' },
      { id: 'knowledge-3', text: 'I know hiragana and some katakana', value: 'hiragana_katakana' },
      { id: 'knowledge-4', text: 'I know hiragana, katakana and some kanji', value: 'basic_kanji' }
    ],
    correctAnswer: 'none',
    category: 'knowledge'
  }
];
