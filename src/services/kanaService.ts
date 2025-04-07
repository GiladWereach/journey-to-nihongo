import { supabaseClient } from '@/lib/supabase';
import { KanaCharacter, KanaType, UserKanaProgress } from '@/types/kana';

// Export the kanaService object with all necessary functions
export const kanaService = {
  /**
   * Get all kana characters
   * @returns Array of all kana characters
   */
  getAllKana: (): KanaCharacter[] => {
    // Map the internal data structure to match the KanaCharacter type
    return kanaData.map(kana => ({
      id: kana.id,
      character: kana.character,
      romaji: kana.romaji,
      type: kana.type as KanaType,
      stroke_count: kana.strokes,
      stroke_order: Array.from({ length: kana.strokes }, (_, i) => (i + 1).toString()),
      mnemonic: kana.mnemonic,
      examples: kana.examples
    }));
  },

  /**
   * Get kana characters by type
   * @param type Type of kana to return ('hiragana', 'katakana', or 'all')
   * @returns Array of kana characters of the specified type
   */
  getKanaByType: (type: KanaType | 'all'): KanaCharacter[] => {
    const allKana = kanaService.getAllKana();
    if (type === 'all') {
      return allKana;
    }
    return allKana.filter(kana => kana.type === type);
  },

  /**
   * Calculate proficiency for a single character
   * @param progress User progress for a character
   * @returns Proficiency value (0-100)
   */
  calculateProficiency: (progress: UserKanaProgress) => {
    // If no practice yet, proficiency is 0
    if (progress.total_practice_count === 0) return 0;

    // Calculate base proficiency based on correct answers ratio
    const correctRatio = (progress.total_practice_count - progress.mistake_count) / progress.total_practice_count;
    
    // Scale to 0-100
    let proficiency = Math.round(correctRatio * 100);
    
    // Bonus for consecutive correct answers
    proficiency += Math.min(progress.consecutive_correct * 2, 10);
    
    // Bonus for mastery level
    proficiency += progress.mastery_level * 5;
    
    // Cap at 100
    return Math.min(proficiency, 100);
  },

  /**
   * Calculate overall proficiency for a collection of kana
   * @param progressEntries Array of progress entries
   * @returns Average proficiency (0-100)
   */
  calculateOverallProficiency: (progressEntries: UserKanaProgress[]) => {
    if (!progressEntries || progressEntries.length === 0) return 0;
    
    const totalProficiency = progressEntries.reduce((sum, entry) => 
      sum + kanaService.calculateProficiency(entry), 0);
    
    return Math.round(totalProficiency / progressEntries.length);
  },

  /**
   * Update progress based on practice results
   * @param userId User ID
   * @param characterId Character ID
   * @param isCorrect Whether the answer was correct
   * @returns Promise resolving to success status
   */
  updateProgressFromResults: async (userId: string, characterId: string, isCorrect: boolean) => {
    try {
      // Get current progress
      const { data: existingProgress, error: progressError } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('character_id', characterId)
        .single();
      
      if (progressError && progressError.code !== 'PGRST116') {
        console.error('Error fetching progress:', progressError);
        return false;
      }
      
      if (!existingProgress) {
        // Create new progress entry
        const { error: insertError } = await supabaseClient
          .from('user_kana_progress')
          .insert({
            user_id: userId,
            character_id: characterId,
            total_practice_count: 1,
            mistake_count: isCorrect ? 0 : 1,
            consecutive_correct: isCorrect ? 1 : 0,
            proficiency: isCorrect ? 20 : 0,
            last_practiced: new Date().toISOString(),
            review_due: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('Error creating progress:', insertError);
          return false;
        }
      } else {
        // Update existing progress
        const updatedProgress = {
          total_practice_count: existingProgress.total_practice_count + 1,
          mistake_count: isCorrect ? existingProgress.mistake_count : existingProgress.mistake_count + 1,
          consecutive_correct: isCorrect ? isCorrect ? existingProgress.consecutive_correct + 1 : 0 : 0,
          last_practiced: new Date().toISOString()
        };
        
        // Update proficiency and review date based on mastery level
        const newProficiency = kanaService.calculateProficiency({
          ...existingProgress,
          ...updatedProgress
        });
        
        // Update the database record
        const { error: updateError } = await supabaseClient
          .from('user_kana_progress')
          .update({
            ...updatedProgress,
            proficiency: newProficiency
          })
          .eq('id', existingProgress.id);
        
        if (updateError) {
          console.error('Error updating progress:', updateError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateProgressFromResults:', error);
      return false;
    }
  },

  /**
   * Get user progress for kana characters
   * @param userId User ID
   * @param kanaType Optional type filter
   * @returns Promise resolving to progress entries
   */
  getUserKanaProgress: async (userId: any, kanaType?: any) => {
    try {
      let query = supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);
      
      if (kanaType && kanaType !== 'all') {
        const charactersOfType = kanaService.getKanaByType(kanaType).map(k => k.id);
        query = query.in('character_id', charactersOfType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching kana progress:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getUserKanaProgress:', error);
      return [];
    }
  },

  /**
   * Recalculate all progress entries for a user
   * @param userId User ID
   * @returns Promise resolving to success status
   */
  recalculateAllProgress: async (userId: string) => {
    try {
      // Get all progress entries
      const { data: progressEntries, error: progressError } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);
        
      if (progressError) {
        console.error('Error fetching progress entries:', progressError);
        return false;
      }
      
      // Recalculate and update proficiency values
      for (const entry of (progressEntries || [])) {
        const newProficiency = kanaService.calculateProficiency(entry);
        
        const { error: updateError } = await supabaseClient
          .from('user_kana_progress')
          .update({ proficiency: newProficiency })
          .eq('id', entry.id);
        
        if (updateError) {
          console.error(`Error updating proficiency for ${entry.character_id}:`, updateError);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in recalculateAllProgress:', error);
      return false;
    }
  }
};

// Internal data structure for kana characters
const kanaData = [
  { id: 'hiragana-a', type: 'hiragana', character: 'あ', romaji: 'a', group: 'vowels', strokes: 3, position: 1, examples: [{ word: '愛', romaji: 'ai', meaning: 'love' }], mnemonic: "Looks like an 'a' with a roof" },
  { id: 'hiragana-i', type: 'hiragana', character: 'い', romaji: 'i', group: 'vowels', strokes: 2, position: 2, examples: [{ word: '家', romaji: 'ie', meaning: 'house' }], mnemonic: "Two short vertical lines, like 'i' without the dot" },
  { id: 'hiragana-u', type: 'hiragana', character: 'う', romaji: 'u', group: 'vowels', strokes: 2, position: 3, examples: [{ word: '歌', romaji: 'uta', meaning: 'song' }], mnemonic: "Resembles a horseshoe or 'u' shape" },
  { id: 'hiragana-e', type: 'hiragana', character: 'え', romaji: 'e', group: 'vowels', strokes: 2, position: 4, examples: [{ word: '絵', romaji: 'e', meaning: 'picture' }], mnemonic: "Similar to a backward '3', forming an 'e'" },
  { id: 'hiragana-o', type: 'hiragana', character: 'お', romaji: 'o', group: 'vowels', strokes: 3, position: 5, examples: [{ word: '音', romaji: 'oto', meaning: 'sound' }], mnemonic: "Circular shape, like the letter 'o'" },
  {
    id: 'hiragana-ka',
    character: 'か',
    romaji: 'ka',
    type: 'hiragana',
    group: 'k-row',
    strokes: 3,
    position: 6,
    examples: [
      {
        word: 'かさ',
        romaji: 'kasa',
        meaning: 'umbrella'
      }
    ],
    mnemonic: 'Looks like a key'
  },
  {
    id: 'hiragana-ki',
    character: 'き',
    romaji: 'ki',
    type: 'hiragana',
    group: 'k-row',
    strokes: 4,
    position: 7,
    examples: [
      {
        word: 'きいろ',
        romaji: 'kiiro',
        meaning: 'yellow'
      }
    ],
    mnemonic: 'Looks like crossed sticks'
  },
  {
    id: 'hiragana-ku',
    character: 'く',
    romaji: 'ku',
    type: 'hiragana',
    group: 'k-row',
    strokes: 1,
    position: 8,
    examples: [
      {
        word: 'くるま',
        romaji: 'kuruma',
        meaning: 'car'
      }
    ],
    mnemonic: 'Looks like a beak'
  },
  {
    id: 'hiragana-ke',
    character: 'け',
    romaji: 'ke',
    type: 'hiragana',
    group: 'k-row',
    strokes: 3,
    position: 9,
    examples: [
      {
        word: 'ケーキ',
        romaji: 'ke-ki',
        meaning: 'cake'
      }
    ],
    mnemonic: 'Looks like a hairy caterpillar'
  },
  {
    id: 'hiragana-ko',
    character: 'こ',
    romaji: 'ko',
    type: 'hiragana',
    group: 'k-row',
    strokes: 2,
    position: 10,
    examples: [
      {
        word: 'こども',
        romaji: 'kodomo',
        meaning: 'child'
      }
    ],
    mnemonic: 'Looks like two seeds'
  },
  {
    id: 'hiragana-sa',
    character: 'さ',
    romaji: 'sa',
    type: 'hiragana',
    group: 's-row',
    strokes: 3,
    position: 11,
    examples: [
      {
        word: 'さかな',
        romaji: 'sakana',
        meaning: 'fish'
      }
    ],
    mnemonic: 'Looks like a samurai sword'
  },
  {
    id: 'hiragana-shi',
    character: 'し',
    romaji: 'shi',
    type: 'hiragana',
    group: 's-row',
    strokes: 1,
    position: 12,
    examples: [
      {
        word: 'しか',
        romaji: 'shika',
        meaning: 'deer'
      }
    ],
    mnemonic: 'Looks like a fishing hook'
  },
  {
    id: 'hiragana-su',
    character: 'す',
    romaji: 'su',
    type: 'hiragana',
    group: 's-row',
    strokes: 2,
    position: 13,
    examples: [
      {
        word: 'すし',
        romaji: 'sushi',
        meaning: 'sushi'
      }
    ],
    mnemonic: 'Looks like a swing'
  },
  {
    id: 'hiragana-se',
    character: 'せ',
    romaji: 'se',
    type: 'hiragana',
    group: 's-row',
    strokes: 3,
    position: 14,
    examples: [
      {
        word: 'せんせい',
        romaji: 'sensei',
        meaning: 'teacher'
      }
    ],
    mnemonic: 'Looks like a sailboat'
  },
  {
    id: 'hiragana-so',
    character: 'そ',
    romaji: 'so',
    type: 'hiragana',
    group: 's-row',
    strokes: 1,
    position: 15,
    examples: [
      {
        word: 'そら',
        romaji: 'sora',
        meaning: 'sky'
      }
    ],
    mnemonic: 'Looks like a thread'
  },
  {
    id: 'hiragana-ta',
    character: 'た',
    romaji: 'ta',
    type: 'hiragana',
    group: 't-row',
    strokes: 4,
    position: 16,
    examples: [
      {
        word: 'たこ',
        romaji: 'tako',
        meaning: 'octopus'
      }
    ],
    mnemonic: 'Looks like a tie'
  },
  {
    id: 'hiragana-chi',
    character: 'ち',
    romaji: 'chi',
    type: 'hiragana',
    group: 't-row',
    strokes: 2,
    position: 17,
    examples: [
      {
        word: 'ちかい',
        romaji: 'chikai',
        meaning: 'near'
      }
    ],
    mnemonic: 'Looks like a cheerleader pompom'
  },
  {
    id: 'hiragana-tsu',
    character: 'つ',
    romaji: 'tsu',
    type: 'hiragana',
    group: 't-row',
    strokes: 1,
    position: 18,
    examples: [
      {
        word: 'つき',
        romaji: 'tsuki',
        meaning: 'moon'
      }
    ],
    mnemonic: 'Looks like a tsunami wave'
  },
  {
    id: 'hiragana-te',
    character: 'て',
    romaji: 'te',
    type: 'hiragana',
    group: 't-row',
    strokes: 1,
    position: 19,
    examples: [
      {
        word: 'てがみ',
        romaji: 'tegami',
        meaning: 'letter'
      }
    ],
    mnemonic: 'Looks like a hand'
  },
  {
    id: 'hiragana-to',
    character: 'と',
    romaji: 'to',
    type: 'hiragana',
    group: 't-row',
    strokes: 2,
    position: 20,
    examples: [
      {
        word: 'とり',
        romaji: 'tori',
        meaning: 'bird'
      }
    ],
    mnemonic: 'Looks like a toe'
  },
  {
    id: 'hiragana-na',
    character: 'な',
    romaji: 'na',
    type: 'hiragana',
    group: 'n-row',
    strokes: 4,
    position: 21,
    examples: [
      {
        word: 'なまえ',
        romaji: 'namae',
        meaning: 'name'
      }
    ],
    mnemonic: 'Looks like a cross'
  },
  {
    id: 'hiragana-ni',
    character: 'に',
    romaji: 'ni',
    type: 'hiragana',
    group: 'n-row',
    strokes: 2,
    position: 22,
    examples: [
      {
        word: 'にほん',
        romaji: 'nihon',
        meaning: 'Japan'
      }
    ],
    mnemonic: 'Looks like two lines'
  },
  {
    id: 'hiragana-nu',
    character: 'ぬ',
    romaji: 'nu',
    type: 'hiragana',
    group: 'n-row',
    strokes: 2,
    position: 23,
    examples: [
      {
        word: 'ぬの',
        romaji: 'nuno',
        meaning: 'cloth'
      }
    ],
    mnemonic: 'Looks like a cloth hanging'
  },
  {
    id: 'hiragana-ne',
    character: 'ね',
    romaji: 'ne',
    type: 'hiragana',
    group: 'n-row',
    strokes: 2,
    position: 24,
    examples: [
      {
        word: 'ねこ',
        romaji: 'neko',
        meaning: 'cat'
      }
    ],
    mnemonic: 'Looks like a necklace'
  },
  {
    id: 'hiragana-no',
    character: 'の',
    romaji: 'no',
    type: 'hiragana',
    group: 'n-row',
    strokes: 1,
    position: 25,
    examples: [
      {
        word: 'のみもの',
        romaji: 'nomimono',
        meaning: 'drink'
      }
    ],
    mnemonic: 'Looks like a nose'
  },
  {
    id: 'hiragana-ha',
    character: 'は',
    romaji: 'ha',
    type: 'hiragana',
    group: 'h-row',
    strokes: 3,
    position: 26,
    examples: [
      {
        word: 'はな',
        romaji: 'hana',
        meaning: 'flower'
      }
    ],
    mnemonic: 'Looks like a feather'
  },
  {
    id: 'hiragana-hi',
    character: 'ひ',
    romaji: 'hi',
    type: 'hiragana',
    group: 'h-row',
    strokes: 1,
    position: 27,
    examples: [
      {
        word: 'ひ',
        romaji: 'hi',
        meaning: 'fire'
      }
    ],
    mnemonic: 'Looks like a flame'
  },
  {
    id: 'hiragana-fu',
    character: 'ふ',
    romaji: 'fu',
    type: 'hiragana',
    group: 'h-row',
    strokes: 4,
    position: 28,
    examples: [
      {
        word: 'ふね',
        romaji: 'fune',
        meaning: 'ship'
      }
    ],
    mnemonic: 'Looks like Mt. Fuji'
  },
  {
    id: 'hiragana-he',
    character: 'へ',
    romaji: 'he',
    type: 'hiragana',
    group: 'h-row',
    strokes: 1,
    position: 29,
    examples: [
      {
        word: 'へや',
        romaji: 'heya',
        meaning: 'room'
      }
    ],
    mnemonic: 'Looks like a mountain'
  },
  {
    id: 'hiragana-ho',
    character: 'ほ',
    romaji: 'ho',
    type: 'hiragana',
    group: 'h-row',
    strokes: 5,
    position: 30,
    examples: [
      {
        word: 'ほし',
        romaji: 'hoshi',
        meaning: 'star'
      }
    ],
    mnemonic: 'Looks like a flag'
  },
  {
    id: 'hiragana-ma',
    character: 'ま',
    romaji: 'ma',
    type: 'hiragana',
    group: 'm-row',
    strokes: 3,
    position: 31,
    examples: [
      {
        word: 'まち',
        romaji: 'machi',
        meaning: 'town'
      }
    ],
    mnemonic: 'Looks like a gate'
  },
  {
    id: 'hiragana-mi',
    character: 'み',
    romaji: 'mi',
    type: 'hiragana',
    group: 'm-row',
    strokes: 2,
    position: 32,
    examples: [
      {
        word: 'みず',
        romaji: 'mizu',
        meaning: 'water'
      }
    ],
    mnemonic: 'Looks like three lines'
  },
  {
    id: 'hiragana-mu',
    character: 'む',
    romaji: 'mu',
    type: 'hiragana',
    group: 'm-row',
    strokes: 3,
    position: 33,
    examples: [
      {
        word: 'むし',
        romaji: 'mushi',
        meaning: 'insect'
      }
    ],
    mnemonic: 'Looks like a cow'
  },
  {
    id: 'hiragana-me',
    character: 'め',
    romaji: 'me',
    type: 'hiragana',
    group: 'm-row',
    strokes: 2,
    position: 34,
    examples: [
      {
        word: 'め',
        romaji: 'me',
        meaning: 'eye'
      }
    ],
    mnemonic: 'Looks like an eye'
  },
  {
    id: 'hiragana-mo',
    character: 'も',
    romaji: 'mo',
    type: 'hiragana',
    group: 'm-row',
    strokes: 3,
    position: 35,
    examples: [
      {
        word: 'もも',
        romaji: 'momo',
        meaning: 'peach'
      }
    ],
    mnemonic: 'Looks like a fishing hook'
  },
  {
    id: 'hiragana-ya',
    character: 'や',
    romaji: 'ya',
    type: 'hiragana',
    group: 'y-row',
    strokes: 3,
    position: 36,
    examples: [
      {
        word: 'やま',
        romaji: 'yama',
        meaning: 'mountain'
      }
    ],
    mnemonic: 'Looks like an arrow'
  },
  {
    id: 'hiragana-yu',
    character: 'ゆ',
    romaji: 'yu',
    type: 'hiragana',
    group: 'y-row',
    strokes: 2,
    position: 37,
    examples: [
      {
        word: 'ゆき',
        romaji: 'yuki',
        meaning: 'snow'
      }
    ],
    mnemonic: 'Looks like a hook'
  },
  {
    id: 'hiragana-yo',
    character: 'よ',
    romaji: 'yo',
    type: 'hiragana',
    group: 'y-row',
    strokes: 2,
    position: 38,
    examples: [
      {
        word: 'よる',
        romaji: 'yoru',
        meaning: 'night'
      }
    ],
    mnemonic: 'Looks like a key'
  },
  {
    id: 'hiragana-ra',
    character: 'ら',
    romaji: 'ra',
    type: 'hiragana',
    group: 'r-row',
    strokes: 2,
    position: 39,
    examples: [
      {
        word: 'ラーメン',
        romaji: 'ra-men',
        meaning: 'ramen'
      }
    ],
    mnemonic: 'Looks like a slide'
  },
  {
    id: 'hiragana-ri',
    character: 'り',
    romaji: 'ri',
    type: 'hiragana',
    group: 'r-row',
    strokes: 2,
    position: 40,
    examples: [
      {
        word: 'りす',
        romaji: 'risu',
        meaning: 'squirrel'
      }
    ],
    mnemonic: 'Looks like a ribbon'
  },
  {
    id: 'hiragana-ru',
    character: 'る',
    romaji: 'ru',
    type: 'hiragana',
    group: 'r-row',
    strokes: 1,
    position: 41,
    examples: [
      {
        word: 'るす',
        romaji: 'rusu',
        meaning: 'absence'
      }
    ],
    mnemonic: 'Looks like a loop'
  },
  {
    id: 'hiragana-re',
    character: 'れ',
    romaji: 're',
    type: 'hiragana',
    group: 'r-row',
    strokes: 2,
    position: 42,
    examples: [
      {
        word: 'れきし',
        romaji: 'rekishi',
        meaning: 'history'
      }
    ],
    mnemonic: 'Looks like a ray'
  },
  {
    id: 'hiragana-ro',
    character: 'ろ',
    romaji: 'ro',
    type: 'hiragana',
    group: 'r-row',
    strokes: 1,
    position: 43,
    examples: [
      {
        word: 'ろうそく',
        romaji: 'rousoku',
        meaning: 'candle'
      }
    ],
    mnemonic: 'Looks like a road'
  },
  {
    id: 'hiragana-wa',
    character: 'わ',
    romaji: 'wa',
    type: 'hiragana',
    group: 'w-row',
    strokes: 2,
    position: 44,
    examples: [
      {
        word: 'わたし',
        romaji: 'watashi',
        meaning: 'I'
      }
    ],
    mnemonic: 'Looks like a slide'
  },
  {
    id: 'hiragana-wo',
    character: 'を',
    romaji: 'wo',
    type: 'hiragana',
    group: 'w-row',
    strokes: 3,
    position: 45,
    examples: [
      {
        word: 'ボールをなげる',
        romaji: 'bo-ru wo nageru',
        meaning: 'throw a ball'
      }
    ],
    mnemonic: 'Looks like a person'
  },
  {
    id: 'hiragana-n',
    character: 'ん',
    romaji: 'n',
    type: 'hiragana',
    group: 'n',
    strokes: 1,
    position: 46,
    examples: [
      {
        word: 'ほん',
        romaji: 'hon',
        meaning: 'book'
      }
    ],
    mnemonic: 'Looks like a hook'
  },
  {
    id: 'hiragana-ga',
    character: 'が',
    romaji: 'ga',
    type: 'hiragana',
    group: 'g-row',
    strokes: 3,
    position: 47,
    examples: [
      {
        word: 'がっこう',
        romaji: 'gakkou',
        meaning: 'school'
      }
    ],
    mnemonic: 'Ka with dakuten'
  },
  {
    id: 'hiragana-gi',
    character: 'ぎ',
    romaji: 'gi',
    type: 'hiragana',
    group: 'g-row',
    strokes: 4,
    position: 48,
    examples: [
      {
        word: 'ぎゅうにゅう',
        romaji: 'gyuunyuu',
        meaning: 'milk'
      }
    ],
    mnemonic: 'Ki with dakuten'
  },
  {
    id: 'hiragana-gu',
    character: 'ぐ',
    romaji: 'gu',
    type: 'hiragana',
    group: 'g-row',
    strokes: 1,
    position: 49,
    examples: [
      {
        word: 'ぐあい',
        romaji: 'guai',
        meaning: 'condition'
      }
    ],
    mnemonic: 'Ku with dakuten'
  },
  {
    id: 'hiragana-ge',
    character: 'げ',
    romaji: 'ge',
    type: 'hiragana',
    group: 'g-row',
    strokes: 3,
    position: 50,
    examples: [
      {
        word: 'げんき',
        romaji: 'genki',
        meaning: 'healthy'
      }
    ],
    mnemonic: 'Ke with dakuten'
  },
  {
    id: 'hiragana-go',
    character: 'ご',
    romaji: 'go',
    type: 'hiragana',
    group: 'g-row',
    strokes: 2,
    position: 51,
    examples: [
      {
        word: 'ごはん',
        romaji: 'gohan',
        meaning: 'rice'
      }
    ],
    mnemonic: 'Ko with dakuten'
  },
  {
    id: 'hiragana-za',
    character: 'ざ',
    romaji: 'za',
    type: 'hiragana',
    group: 'z-row',
    strokes: 3,
    position: 52,
    examples: [
      {
        word: 'ざっし',
        romaji: 'zasshi',
        meaning: 'magazine'
      }
    ],
    mnemonic: 'Sa with dakuten'
  },
  {
    id: 'hiragana-ji',
    character: 'じ',
    romaji: 'ji',
    type: 'hiragana',
    group: 'z-row',
    strokes: 1,
    position: 53,
    examples: [
      {
        word: 'じかん',
        romaji: 'jikan',
        meaning: 'time'
      }
    ],
    mnemonic: 'Shi with dakuten'
  },
  {
    id: 'hiragana-zu',
    character: 'ず',
    romaji: 'zu',
    type: 'hiragana',
    group: 'z-row',
    strokes: 2,
    position: 54,
    examples: [
      {
        word: 'ずぼん',
        romaji: 'zubon',
        meaning: 'trousers'
      }
    ],
    mnemonic: 'Su with dakuten'
  },
  {
    id: 'hiragana-ze',
    character: 'ぜ',
    romaji: 'ze',
    type: 'hiragana',
    group: 'z-row',
    strokes: 3,
    position: 55,
    examples: [
      {
        word: 'ぜひ',
        romaji: 'zehi',
        meaning: 'by all means'
      }
    ],
    mnemonic: 'Se with dakuten'
  },
  {
    id: 'hiragana-zo',
    character: 'ぞ',
    romaji: 'zo',
    type: 'hiragana',
    group: 'z-row',
    strokes: 1,
    position: 56,
    examples: [
      {
        word: 'ぞう',
        romaji: 'zou',
        meaning: 'elephant'
      }
    ],
    mnemonic: 'So with dakuten'
  },
  {
    id: 'hiragana-da',
    character: 'だ',
    romaji: 'da',
    type: 'hiragana',
    group: 'd-row',
    strokes: 4,
    position: 57,
    examples: [
      {
        word: 'だいがく',
        romaji: 'daigaku',
        meaning: 'university'
      }
    ],
    mnemonic: 'Ta with dakuten'
  },
  {
    id: 'hiragana-di',
    character: 'ぢ',
    romaji: 'ji',
    type: 'hiragana',
    group: 'd-row',
    strokes: 2,
    position: 58,
    examples: [
      {
        word: 'ぢしん',
        romaji: 'jishin',
        meaning: 'earthquake'
      }
    ],
    mnemonic: 'Chi with dakuten'
  },
  {
    id: 'hiragana-du',
    character: 'づ',
    romaji: 'zu',
    type: 'hiragana',
    group: 'd-row',
    strokes: 1,
    position: 59,
    examples: [
      {
        word: 'みかづき',
        romaji: 'mikazuki',
        meaning: 'crescent moon'
      }
    ],
    mnemonic: 'Tsu with dakuten'
  },
  {
    id: 'hiragana-de',
    character: 'で',
    romaji: 'de',
    type: 'hiragana',
    group: 'd-row',
    strokes: 1,
    position: 60,
    examples: [
      {
        word: 'でんわ',
        romaji: 'denwa',
        meaning: 'telephone'
      }
    ],
    mnemonic: 'Te with dakuten'
  },
  {
    id: 'hiragana-do',
    character: 'ど',
    romaji: 'do',
    type: 'hiragana',
    group: 'd-row',
    strokes: 2,
    position: 61,
    examples: [
      {
        word: 'どこ',
        romaji: 'doko',
        meaning: 'where'
      }
    ],
    mnemonic: 'To with dakuten'
  },
  {
    id: 'hiragana-ba',
    character: 'ば',
    romaji: 'ba',
    type: 'hiragana',
    group: 'b-row',
    strokes: 3,
    position: 62,
    examples: [
      {
        word: 'ばす',
        romaji: 'basu',
        meaning: 'bus'
      }
    ],
    mnemonic: 'Ha with dakuten'
  },
  {
    id: 'hiragana-bi',
    character: 'び',
    romaji: 'bi',
    type: 'hiragana',
    group: 'b-row',
    strokes: 1,
    position: 63,
    examples: [
      {
        word: 'えんぴつ',
        romaji: 'enpitsu',
        meaning: 'pencil'
      }
    ],
    mnemonic: 'Hi with dakuten'
  },
  {
    id: 'hiragana-bu',
    character: 'ぶ',
    romaji: 'bu',
    type: 'hiragana',
    group: 'b-row',
    strokes: 4,
    position: 64,
    examples: [
      {
        word: 'ぶどう',
        romaji: 'budou',
        meaning: 'grapes'
      }
    ],
    mnemonic: 'Fu with dakuten'
  },
  {
    id: 'hiragana-be',
    character: 'べ',
    romaji: 'be',
    type: 'hiragana',
    group: 'b-row',
    strokes: 1,
    position: 65,
    examples: [
      {
        word: 'べんきょう',
        romaji: 'benkyou',
        meaning: 'study'
      }
    ],
    mnemonic: 'He with dakuten'
  },
  {
    id: 'hiragana-bo',
    character: 'ぼ',
    romaji: 'bo',
    type: 'hiragana',
    group: 'b-row',
    strokes: 5,
    position: 66,
    examples: [
      {
        word: 'ぼうし',
        romaji: 'boushi',
        meaning: 'hat'
      }
    ],
    mnemonic: 'Ho with dakuten'
  },
  {
    id: 'hiragana-pa',
    character: 'ぱ',
    romaji: 'pa',
    type: 'hiragana',
    group: 'p-row',
    strokes: 3,
    position: 67,
    examples: [
      {
        word: 'ぱん',
        romaji: 'pan',
        meaning: 'bread'
      }
    ],
    mnemonic: 'Ha with handakuten'
  },
  {
    id: 'hiragana-pi',
    character: 'ぴ',
    romaji: 'pi',
    type: 'hiragana',
    group: 'p-row',
    strokes: 1,
    position: 68,
    examples: [
      {
        word: 'ぴあの',
        romaji: 'piano',
        meaning: 'piano'
      }
    ],
    mnemonic: 'Hi with handakuten'
  },
  {
    id: 'hiragana-pu',
    character: 'ぷ',
    romaji: 'pu',
    type: 'hiragana',
    group: 'p-row',
    strokes: 4,
    position: 69,
    examples: [
      {
        word: 'コンピュータ',
        romaji: 'conpyu-ta',
        meaning: 'computer'
      }
    ],
    mnemonic: 'Fu with handakuten'
  },
  {
    id: 'hiragana-pe',
    character: 'ぺ',
    romaji: 'pe',
    type: 'hiragana',
    group: 'p-row',
    strokes: 1,
    position: 70,
    examples: [
      {
        word: 'ぺん',
        romaji: 'pen',
        meaning: 'pen'
      }
    ],
    mnemonic: 'He with handakuten'
  },
  {
    id: 'hiragana-po',
    character: 'ぽ',
    romaji: 'po',
    type: 'hiragana',
    group: 'p-row',
    strokes: 5,
    position: 71,
    examples: [
      {
        word: 'ぽけっと',
        romaji: 'poketto',
        meaning: 'pocket'
      }
    ],
    mnemonic: 'Ho with handakuten'
  },
  
  // Katakana characters
  {
    id: 'katakana-a',
    character: 'ア',
    romaji: 'a',
    type: 'katakana',
    group: 'vowels',
    strokes: 2,
    position: 1,
    examples: [
      {
        word: 'アイス',
        romaji: 'aisu',
        meaning: 'ice cream'
      }
    ],
    mnemonic: 'Looks like an A with missing middle bar'
  },
  {
    id: 'katakana-i',
    character: 'イ',
    romaji: 'i',
    type: 'katakana',
    group: 'vowels',
    strokes: 2,
    position: 2,
    examples: [
      {
        word: 'イチゴ',
        romaji: 'ichigo',
        meaning: 'strawberry'
      }
    ],
    mnemonic: 'Looks like a half-drawn E'
  },
  {
    id: 'katakana-u',
    character: 'ウ',
    romaji: 'u',
    type: 'katakana',
    group: 'vowels',
    strokes: 2,
    position: 3,
    examples: [
      {
        word: 'ウソ',
        romaji: 'uso',
        meaning: 'lie'
      }
    ],
    mnemonic: 'Looks like a smile'
  },
  {
    id: 'katakana-e',
    character: 'エ',
    romaji: 'e',
    type: 'katakana',
    group: 'vowels',
    strokes: 3,
    position: 4,
    examples: [
      {
        word: 'エレベーター',
        romaji: 'erebe-ta-',
        meaning: 'elevator'
      }
    ],
    mnemonic: 'Looks like a ヨ without the right stroke'
  },
  {
    id: 'katakana-o',
    character: 'オ',
    romaji: 'o',
    type: 'katakana',
    group: 'vowels',
    strokes: 3,
    position: 5,
    examples: [
      {
        word: 'オレンジ',
        romaji: 'orenji',
        meaning: 'orange'
      }
    ],
    mnemonic: 'Looks like a slightly bent T'
  },
  {
    id: 'katakana-ka',
    character: 'カ',
    romaji: 'ka',
    type: 'katakana',
    group: 'k-row',
    strokes: 2,
    position: 6,
    examples: [
      {
        word: 'カメラ',
        romaji: 'kamera',
        meaning: 'camera'
      }
    ],
    mnemonic: 'Looks like a K without the vertical line'
  },
  {
    id: 'katakana-ki',
    character: 'キ',
    romaji: 'ki',
    type: 'katakana',
    group: 'k-row',
    strokes: 3,
    position: 7,
    examples: [
      {
        word: 'キーボード',
        romaji: 'ki-bo-do',
        meaning: 'keyboard'
      }
    ],
    mnemonic: 'Looks like a key'
  },
  {
    id: 'katakana-ku',
    character: 'ク',
    romaji: 'ku',
    type: 'katakana',
    group: 'k-row',
    strokes: 2,
    position: 8,
    examples: [
      {
        word: 'クッキー',
        romaji: 'kukki-',
        meaning: 'cookie'
      }
    ],
    mnemonic: 'Looks like the number 7'
  },
  {
    id: 'katakana-ke',
    character: 'ケ',
    romaji: 'ke',
    type: 'katakana',
    group: 'k-row',
    strokes: 3,
    position: 9,
    examples: [
      {
        word: 'ケーキ',
        romaji: 'ke-ki',
        meaning: 'cake'
      }
    ],
    mnemonic: 'Looks like a backward 7 with a line'
  },
  {
    id: 'katakana-ko',
    character: 'コ',
    romaji: 'ko',
    type: 'katakana',
    group: 'k-row',
    strokes: 2,
    position: 10,
    examples: [
      {
        word: 'コーヒー',
        romaji: 'ko-hi-',
        meaning: 'coffee'
      }
    ],
    mnemonic: 'Looks like a lowercase c'
  }
];
