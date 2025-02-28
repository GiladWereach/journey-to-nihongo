
import { supabase } from '@/integrations/supabase/client';
import { KanaCharacter, KanaGroup, KanaType, UserKanaProgress } from '@/types/kana';

// Static data - In a production app, this would be stored in a database
const hiraganaBasic: KanaCharacter[] = [
  {
    id: 'hiragana-a',
    character: 'あ',
    romaji: 'a',
    type: 'hiragana',
    strokeCount: 3,
    strokeOrder: ['top-right curve', 'middle horizontal', 'bottom curve'],
    mnemonic: 'Looks like a person sitting with arms out',
    examples: [
      { word: 'あい', romaji: 'ai', meaning: 'love' },
      { word: 'あか', romaji: 'aka', meaning: 'red' }
    ]
  },
  {
    id: 'hiragana-i',
    character: 'い',
    romaji: 'i',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['top horizontal', 'vertical with hook'],
    mnemonic: 'Like the letter i with two strokes',
    examples: [
      { word: 'いぬ', romaji: 'inu', meaning: 'dog' },
      { word: 'いし', romaji: 'ishi', meaning: 'stone' }
    ]
  },
  {
    id: 'hiragana-u',
    character: 'う',
    romaji: 'u',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['vertical line', 'curved sweep'],
    mnemonic: 'Like a swimmer diving into water',
    examples: [
      { word: 'うみ', romaji: 'umi', meaning: 'sea' },
      { word: 'うた', romaji: 'uta', meaning: 'song' }
    ]
  },
  {
    id: 'hiragana-e',
    character: 'え',
    romaji: 'e',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['horizontal line', 'curved vertical line'],
    mnemonic: 'Looks like someone shouting "eh?"',
    examples: [
      { word: 'えき', romaji: 'eki', meaning: 'station' },
      { word: 'えいが', romaji: 'eiga', meaning: 'movie' }
    ]
  },
  {
    id: 'hiragana-o',
    character: 'お',
    romaji: 'o',
    type: 'hiragana',
    strokeCount: 3,
    strokeOrder: ['top curve', 'middle horizontal', 'bottom vertical with hook'],
    mnemonic: 'Looks like a ball rolling off a cliff',
    examples: [
      { word: 'おかし', romaji: 'okashi', meaning: 'snack' },
      { word: 'おと', romaji: 'oto', meaning: 'sound' }
    ]
  }
];

const katakanaBasic: KanaCharacter[] = [
  {
    id: 'katakana-a',
    character: 'ア',
    romaji: 'a',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['top-right diagonal', 'middle horizontal'],
    mnemonic: 'Like an A without the middle bar',
    examples: [
      { word: 'アイス', romaji: 'aisu', meaning: 'ice cream' },
      { word: 'アメリカ', romaji: 'amerika', meaning: 'America' }
    ]
  },
  {
    id: 'katakana-i',
    character: 'イ',
    romaji: 'i',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['top-right diagonal', 'top-left diagonal'],
    mnemonic: 'Like the letter i without the dot',
    examples: [
      { word: 'イギリス', romaji: 'igirisu', meaning: 'England' },
      { word: 'インド', romaji: 'indo', meaning: 'India' }
    ]
  },
  {
    id: 'katakana-u',
    character: 'ウ',
    romaji: 'u',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['vertical line', 'curved right sweep'],
    mnemonic: 'Like a person stretching arms upward',
    examples: [
      { word: 'ウール', romaji: 'ūru', meaning: 'wool' },
      { word: 'ウミ', romaji: 'umi', meaning: 'sea' }
    ]
  },
  {
    id: 'katakana-e',
    character: 'エ',
    romaji: 'e',
    type: 'katakana',
    strokeCount: 3,
    strokeOrder: ['top horizontal', 'middle horizontal', 'vertical line'],
    mnemonic: 'Like the letter E without the bottom line',
    examples: [
      { word: 'エレベーター', romaji: 'erebētā', meaning: 'elevator' },
      { word: 'エビ', romaji: 'ebi', meaning: 'shrimp' }
    ]
  },
  {
    id: 'katakana-o',
    character: 'オ',
    romaji: 'o',
    type: 'katakana',
    strokeCount: 3,
    strokeOrder: ['top horizontal', 'vertical line', 'diagonal line'],
    mnemonic: 'Like a person carrying a stick on their shoulder',
    examples: [
      { word: 'オレンジ', romaji: 'orenji', meaning: 'orange' },
      { word: 'オーストラリア', romaji: 'ōsutoraria', meaning: 'Australia' }
    ]
  }
];

// Group the characters for learning
const kanaGroups: KanaGroup[] = [
  {
    id: 'hiragana-basic',
    name: 'Basic Hiragana',
    characters: hiraganaBasic
  },
  {
    id: 'katakana-basic',
    name: 'Basic Katakana',
    characters: katakanaBasic
  }
];

// Service functions
export const kanaService = {
  // Get all kana characters
  getAllKana: (): KanaCharacter[] => {
    return [...hiraganaBasic, ...katakanaBasic];
  },

  // Get kana by type
  getKanaByType: (type: KanaType): KanaCharacter[] => {
    return type === 'hiragana' ? hiraganaBasic : katakanaBasic;
  },

  // Get kana groups
  getKanaGroups: (): KanaGroup[] => {
    return kanaGroups;
  },

  // Get a specific kana character
  getKanaById: (id: string): KanaCharacter | undefined => {
    return [...hiraganaBasic, ...katakanaBasic].find(kana => kana.id === id);
  },

  // Get user's kana progress
  getUserKanaProgress: async (userId: string): Promise<UserKanaProgress[]> => {
    try {
      const { data, error } = await supabase
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching user kana progress:', error);
      return [];
    }
  },

  // Update user's kana progress
  updateUserKanaProgress: async (progress: Omit<UserKanaProgress, 'lastPracticed' | 'reviewDue'>) => {
    try {
      const { data, error } = await supabase
        .from('user_kana_progress')
        .upsert({
          user_id: progress.userId,
          character_id: progress.characterId,
          proficiency: progress.proficiency,
          last_practiced: new Date().toISOString(),
          review_due: calculateNextReviewDate(progress.proficiency),
          mistake_count: progress.mistakeCount,
          total_practice_count: progress.totalPracticeCount
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user kana progress:', error);
      return null;
    }
  }
};

// Helper function to calculate next review date based on spaced repetition
function calculateNextReviewDate(proficiency: number): string {
  const now = new Date();
  let daysToAdd = 1;

  // Simple algorithm: higher proficiency = longer intervals
  if (proficiency >= 90) {
    daysToAdd = 14; // Two weeks
  } else if (proficiency >= 70) {
    daysToAdd = 7; // One week
  } else if (proficiency >= 50) {
    daysToAdd = 3; // Three days
  } else {
    daysToAdd = 1; // One day
  }

  now.setDate(now.getDate() + daysToAdd);
  return now.toISOString();
}
