
import { supabaseClient } from '@/lib/supabase';
import { KanaCharacter, KanaGroup, KanaGroupCharacter, KanaType, UserKanaProgress } from '@/types/kana';

// Mock data for development
const hiraganaCharacters: KanaCharacter[] = [
  {
    id: 'a',
    character: 'あ',
    romaji: 'a',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like an open mouth saying "ahh"',
    examples: [
      {
        word: 'あかい',
        romaji: 'akai',
        meaning: 'red',
      },
      {
        word: 'あさ',
        romaji: 'asa',
        meaning: 'morning',
      }
    ]
  },
  {
    id: 'i',
    character: 'い',
    romaji: 'i',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a person with two feelers saying "eee"',
    examples: [
      {
        word: 'いけ',
        romaji: 'ike',
        meaning: 'pond',
      },
      {
        word: 'いいえ',
        romaji: 'iie',
        meaning: 'no',
      }
    ]
  },
  {
    id: 'u',
    character: 'う',
    romaji: 'u',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a drop of water saying "ooo"',
    examples: [
      {
        word: 'うみ',
        romaji: 'umi',
        meaning: 'sea',
      },
      {
        word: 'うた',
        romaji: 'uta',
        meaning: 'song',
      }
    ]
  },
  {
    id: 'e',
    character: 'え',
    romaji: 'e',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like someone saying "eh?" in surprise',
    examples: [
      {
        word: 'えいが',
        romaji: 'eiga',
        meaning: 'movie',
      },
      {
        word: 'えき',
        romaji: 'eki',
        meaning: 'station',
      }
    ]
  },
  {
    id: 'o',
    character: 'お',
    romaji: 'o',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a ball bouncing saying "oh!"',
    examples: [
      {
        word: 'おかし',
        romaji: 'okashi',
        meaning: 'sweets',
      },
      {
        word: 'おと',
        romaji: 'oto',
        meaning: 'sound',
      }
    ]
  },
];

const katakanaCharacters: KanaCharacter[] = [
  {
    id: 'a-kata',
    character: 'ア',
    romaji: 'a',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like an axe',
    examples: [
      {
        word: 'アイス',
        romaji: 'aisu',
        meaning: 'ice cream',
      },
      {
        word: 'アメリカ',
        romaji: 'amerika',
        meaning: 'America',
      }
    ]
  },
  {
    id: 'i-kata',
    character: 'イ',
    romaji: 'i',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like the letter i with two strokes',
    examples: [
      {
        word: 'イギリス',
        romaji: 'igirisu',
        meaning: 'England',
      },
      {
        word: 'インド',
        romaji: 'indo',
        meaning: 'India',
      }
    ]
  },
  {
    id: 'u-kata',
    character: 'ウ',
    romaji: 'u',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a swimmer doing the backstroke',
    examples: [
      {
        word: 'ウール',
        romaji: 'ûru',
        meaning: 'wool',
      },
      {
        word: 'ウミ',
        romaji: 'umi',
        meaning: 'sea',
      }
    ]
  },
  {
    id: 'e-kata',
    character: 'エ',
    romaji: 'e',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like the letter F slanted',
    examples: [
      {
        word: 'エレベーター',
        romaji: 'erebêtâ',
        meaning: 'elevator',
      },
      {
        word: 'エビ',
        romaji: 'ebi',
        meaning: 'shrimp',
      }
    ]
  },
  {
    id: 'o-kata',
    character: 'オ',
    romaji: 'o',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a fish hook',
    examples: [
      {
        word: 'オレンジ',
        romaji: 'orenji',
        meaning: 'orange',
      },
      {
        word: 'オーストラリア',
        romaji: 'ôsutoraria',
        meaning: 'Australia',
      }
    ]
  },
];

// Mock Kana Groups
const kanaGroups: KanaGroup[] = [
  {
    id: "group1",
    name: "Vowels",
    type: "hiragana",
    description: "The five basic vowels in hiragana",
    characters: ["a", "i", "u", "e", "o"],
  },
  {
    id: "group2",
    name: "Vowels",
    type: "katakana",
    description: "The five basic vowels in katakana",
    characters: ["a-kata", "i-kata", "u-kata", "e-kata", "o-kata"],
  },
];

// Mock user progress data
const mockUserProgress: UserKanaProgress[] = [
  {
    id: "progress1",
    user_id: "user123",
    character_id: "a",
    proficiency: 85,
    mistake_count: 3,
    total_practice_count: 20,
    last_practiced: new Date(),
    review_due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
  },
  {
    id: "progress2",
    user_id: "user123",
    character_id: "i",
    proficiency: 70,
    mistake_count: 5,
    total_practice_count: 15,
    last_practiced: new Date(),
    review_due: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
  },
];

export const kanaService = {
  // Get all kana characters
  getAllKana: (): KanaCharacter[] => {
    return [...hiraganaCharacters, ...katakanaCharacters];
  },

  // Get kana by type (hiragana or katakana)
  getKanaByType: (type: KanaType): KanaCharacter[] => {
    return type === 'hiragana' ? hiraganaCharacters : katakanaCharacters;
  },

  // Get a specific kana by ID
  getKanaById: (id: string): KanaCharacter | undefined => {
    return [...hiraganaCharacters, ...katakanaCharacters].find((kana) => kana.id === id);
  },

  // Get kana groups
  getKanaGroups: (): KanaGroup[] => {
    return kanaGroups;
  },

  // Get kana group by ID
  getKanaGroupById: (id: string): KanaGroup | undefined => {
    return kanaGroups.find((group) => group.id === id);
  },

  // Get characters in a group
  getCharactersInGroup: (groupId: string): KanaCharacter[] => {
    const group = kanaGroups.find((g) => g.id === groupId);
    if (!group || !group.characters) return [];
    
    return group.characters.map((charId) => {
      const kana = [...hiraganaCharacters, ...katakanaCharacters].find((k) => k.id === charId);
      return kana!; // Non-null assertion, we know these IDs exist in our mock data
    });
  },

  // Get user progress for kana learning
  getUserKanaProgress: async (userId: string): Promise<UserKanaProgress[]> => {
    // In a real app, this would fetch from Supabase
    try {
      const { data, error } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      // Convert API response to UserKanaProgress type
      if (data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          character_id: item.character_id,
          proficiency: item.proficiency,
          mistake_count: item.mistake_count,
          total_practice_count: item.total_practice_count,
          last_practiced: new Date(item.last_practiced),
          review_due: new Date(item.review_due),
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
      }
      
      // Return mock data for development if no real data exists
      return mockUserProgress.filter(progress => progress.user_id === userId);
    } catch (error) {
      console.error('Error fetching user kana progress:', error);
      // Fall back to mock data for development
      return mockUserProgress.filter(progress => progress.user_id === userId);
    }
  },
};
