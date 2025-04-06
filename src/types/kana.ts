export type KanaType = 'hiragana' | 'katakana';

export interface KanaExample {
  word: string;
  romaji: string;
  meaning: string;
}

export interface KanaCharacter {
  id: string;
  character: string;
  romaji: string;
  type: KanaType;
  stroke_count: number;
  stroke_order: string[];
  mnemonic?: string;
  sound_file?: string;
  examples?: KanaExample[];
  group?: string; // Add this line to fix the type error
}
