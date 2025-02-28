
export type KanaType = 'hiragana' | 'katakana';
export type StrokeDirection = 'horizontal' | 'vertical' | 'diagonal' | 'curve';

export interface KanaCharacter {
  id: string;
  character: string;
  romaji: string;
  type: KanaType;
  strokeCount: number;
  strokeOrder: string[];
  soundFile?: string;
  mnemonic?: string;
  examples?: {
    word: string;
    romaji: string;
    meaning: string;
  }[];
}

export interface KanaGroup {
  id: string;
  name: string;
  characters: KanaCharacter[];
  type?: KanaType;
}

export interface UserKanaProgress {
  userId: string;
  characterId: string;
  proficiency: number; // 0-100
  lastPracticed: Date;
  reviewDue: Date;
  mistakeCount: number;
  totalPracticeCount: number;
}

export interface KanaLearningSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  kanaType: KanaType;
  charactersStudied: string[]; // character IDs
  accuracy: number; // 0-100
  completed: boolean;
}
