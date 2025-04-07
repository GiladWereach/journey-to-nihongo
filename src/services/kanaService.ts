import { supabaseClient } from '@/lib/supabase';
import { KanaCharacter, KanaGroup, KanaGroupCharacter, UserKanaProgress, KanaType } from '@/types/kana';
import { calculateNextReviewDate } from '@/lib/utils';

export const kanaService = {
  /**
   * Get all kana characters
   * @returns Array of KanaCharacter objects
   */
  getAllKana: (): KanaCharacter[] => {
    const hiragana: KanaCharacter[] = [
      { id: 'hiragana:a', character: 'あ', romaji: 'a', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '愛', reading: 'あい', meaning: 'love', romaji: 'ai' }] },
      { id: 'hiragana:i', character: 'い', romaji: 'i', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '家', reading: 'いえ', meaning: 'house', romaji: 'ie' }] },
      { id: 'hiragana:u', character: 'う', romaji: 'u', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '歌', reading: 'うた', meaning: 'song', romaji: 'uta' }] },
      { id: 'hiragana:e', character: 'え', romaji: 'e', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '絵', reading: 'え', meaning: 'painting', romaji: 'e' }] },
      { id: 'hiragana:o', character: 'お', romaji: 'o', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '音', reading: 'おと', meaning: 'sound', romaji: 'oto' }] },
      { id: 'hiragana:ka', character: 'か', romaji: 'ka', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '力', reading: 'ちから', meaning: 'power', romaji: 'chikara' }] },
      { id: 'hiragana:ki', character: 'き', romaji: 'ki', type: 'hiragana', stroke_count: 4, stroke_order: [], examples: [{ word: '木', reading: 'き', meaning: 'tree', romaji: 'ki' }] },
      { id: 'hiragana:ku', character: 'く', romaji: 'ku', type: 'hiragana', stroke_count: 1, stroke_order: [], examples: [{ word: '九', reading: 'きゅう', meaning: 'nine', romaji: 'kyuu' }] },
      { id: 'hiragana:ke', character: 'け', romaji: 'ke', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '毛', reading: 'け', meaning: 'hair', romaji: 'ke' }] },
      { id: 'hiragana:ko', character: 'こ', romaji: 'ko', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '子', reading: 'こ', meaning: 'child', romaji: 'ko' }] },
      { id: 'hiragana:sa', character: 'さ', romaji: 'sa', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '魚', reading: 'さかな', meaning: 'fish', romaji: 'sakana' }] },
      { id: 'hiragana:shi', character: 'し', romaji: 'shi', type: 'hiragana', stroke_count: 1, stroke_order: [], examples: [{ word: '四', reading: 'し', meaning: 'four', romaji: 'shi' }] },
      { id: 'hiragana:su', character: 'す', romaji: 'su', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '酢', reading: 'す', meaning: 'vinegar', romaji: 'su' }] },
      { id: 'hiragana:se', character: 'せ', romaji: 'se', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '背', reading: 'せ', meaning: 'back', romaji: 'se' }] },
      { id: 'hiragana:so', character: 'そ', romaji: 'so', type: 'hiragana', stroke_count: 1, stroke_order: [], examples: [{ word: '空', reading: 'そら', meaning: 'sky', romaji: 'sora' }] },
      { id: 'hiragana:ta', character: 'た', romaji: 'ta', type: 'hiragana', stroke_count: 4, stroke_order: [], examples: [{ word: '田', reading: 'た', meaning: 'rice field', romaji: 'ta' }] },
      { id: 'hiragana:chi', character: 'ち', romaji: 'chi', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '血', reading: 'ち', meaning: 'blood', romaji: 'chi' }] },
      { id: 'hiragana:tsu', character: 'つ', romaji: 'tsu', type: 'hiragana', stroke_count: 1, stroke_order: [], examples: [{ word: '月', reading: 'つき', meaning: 'moon', romaji: 'tsuki' }] },
      { id: 'hiragana:te', character: 'て', romaji: 'te', type: 'hiragana', stroke_count: 1, stroke_order: [], examples: [{ word: '手', reading: 'て', meaning: 'hand', romaji: 'te' }] },
      { id: 'hiragana:to', character: 'と', romaji: 'to', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '戸', reading: 'と', meaning: 'door', romaji: 'to' }] },
      { id: 'hiragana:na', character: 'な', romaji: 'na', type: 'hiragana', stroke_count: 4, stroke_order: [], examples: [{ word: '名', reading: 'な', meaning: 'name', romaji: 'na' }] },
      { id: 'hiragana:ni', character: 'に', romaji: 'ni', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '二', reading: 'に', meaning: 'two', romaji: 'ni' }] },
      { id: 'hiragana:nu', character: 'ぬ', romaji: 'nu', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '布', reading: 'ぬの', meaning: 'cloth', romaji: 'nuno' }] },
      { id: 'hiragana:ne', character: 'ね', romaji: 'ne', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '根', reading: 'ね', meaning: 'root', romaji: 'ne' }] },
      { id: 'hiragana:no', character: 'の', romaji: 'no', type: 'hiragana', stroke_count: 1, stroke_order: [], examples: [{ word: '野', reading: 'の', meaning: 'field', romaji: 'no' }] },
      { id: 'hiragana:ha', character: 'は', romaji: 'ha', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '歯', reading: 'は', meaning: 'tooth', romaji: 'ha' }] },
      { id: 'hiragana:hi', character: 'ひ', romaji: 'hi', type: 'hiragana', stroke_count: 1, stroke_order: [], examples: [{ word: '火', reading: 'ひ', meaning: 'fire', romaji: 'hi' }] },
      { id: 'hiragana:fu', character: 'ふ', romaji: 'fu', type: 'hiragana', stroke_count: 4, stroke_order: [], examples: [{ word: '風', reading: 'ふ', meaning: 'wind', romaji: 'fu' }] },
      { id: 'hiragana:he', character: 'へ', romaji: 'he', type: 'hiragana', stroke_count: 1, stroke_order: [], examples: [{ word: '屁', reading: 'へ', meaning: 'fart', romaji: 'he' }] },
      { id: 'hiragana:ho', character: 'ほ', romaji: 'ho', type: 'hiragana', stroke_count: 4, stroke_order: [], examples: [{ word: '帆', reading: 'ほ', meaning: 'sail', romaji: 'ho' }] },
      { id: 'hiragana:ma', character: 'ま', romaji: 'ma', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '間', reading: 'ま', meaning: 'space', romaji: 'ma' }] },
      { id: 'hiragana:mi', character: 'み', romaji: 'mi', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '身', reading: 'み', meaning: 'body', romaji: 'mi' }] },
      { id: 'hiragana:mu', character: 'む', romaji: 'mu', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '夢', reading: 'む', meaning: 'dream', romaji: 'mu' }] },
      { id: 'hiragana:me', character: 'め', romaji: 'me', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '目', reading: 'め', meaning: 'eye', romaji: 'me' }] },
      { id: 'hiragana:mo', character: 'も', romaji: 'mo', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '桃', reading: 'もも', meaning: 'peach', romaji: 'momo' }] },
      { id: 'hiragana:ya', character: 'や', romaji: 'ya', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '矢', reading: 'や', meaning: 'arrow', romaji: 'ya' }] },
      { id: 'hiragana:yu', character: 'ゆ', romaji: 'yu', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '湯', reading: 'ゆ', meaning: 'hot water', romaji: 'yu' }] },
      { id: 'hiragana:yo', character: 'よ', romaji: 'yo', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '夜', reading: 'よる', meaning: 'night', romaji: 'yoru' }] },
      { id: 'hiragana:ra', character: 'ら', romaji: 'ra', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '楽', reading: 'らく', meaning: 'comfort', romaji: 'raku' }] },
      { id: 'hiragana:ri', character: 'り', romaji: 'ri', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '理', reading: 'り', meaning: 'reason', romaji: 'ri' }] },
      { id: 'hiragana:ru', character: 'る', romaji: 'ru', type: 'hiragana', stroke_count: 1, stroke_order: [], examples: [{ word: '留', reading: 'る', meaning: 'fasten', romaji: 'ru' }] },
      { id: 'hiragana:re', character: 'れ', romaji: 're', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '礼', reading: 'れい', meaning: 'thanks', romaji: 'rei' }] },
      { id: 'hiragana:ro', character: 'ろ', romaji: 'ro', type: 'hiragana', stroke_count: 1, stroke_order: [], examples: [{ word: '路', reading: 'ろ', meaning: 'road', romaji: 'ro' }] },
      { id: 'hiragana:wa', character: 'わ', romaji: 'wa', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '和', reading: 'わ', meaning: 'peace', romaji: 'wa' }] },
      { id: 'hiragana:wo', character: 'を', romaji: 'wo', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '〜を', reading: '...', meaning: 'particle', romaji: 'o' }] },
      { id: 'hiragana:n', character: 'ん', romaji: 'n', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '運', reading: 'うん', meaning: 'luck', romaji: 'un' }] }
    ];
    
    const katakana: KanaCharacter[] = [
      { id: 'katakana:a', character: 'ア', romaji: 'a', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'アメリカ', reading: 'アメリカ', meaning: 'America', romaji: 'amerika' }] },
      { id: 'katakana:i', character: 'イ', romaji: 'i', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'イギリス', reading: 'イギリス', meaning: 'England', romaji: 'igirisu' }] },
      { id: 'katakana:u', character: 'ウ', romaji: 'u', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'ウイルス', reading: 'ウイルス', meaning: 'virus', romaji: 'uirusu' }] },
      { id: 'katakana:e', character: 'エ', romaji: 'e', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'エネルギー', reading: 'エネルギー', meaning: 'energy', romaji: 'enerugii' }] },
      { id: 'katakana:o', character: 'オ', romaji: 'o', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'オーストラリア', reading: 'オーストラリア', meaning: 'Australia', romaji: 'oosutoraria' }] },
      { id: 'katakana:ka', character: 'カ', romaji: 'ka', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'カメラ', reading: 'カメラ', meaning: 'camera', romaji: 'kamera' }] },
      { id: 'katakana:ki', character: 'キ', romaji: 'ki', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'ケーキ', reading: 'ケーキ', meaning: 'cake', romaji: 'keeki' }] },
      { id: 'katakana:ku', character: 'ク', romaji: 'ku', type: 'katakana', stroke_count: 1, stroke_order: [], examples: [{ word: 'クリスマス', reading: 'クリスマス', meaning: 'Christmas', romaji: 'kurisumasu' }] },
      { id: 'katakana:ke', character: 'ケ', romaji: 'ke', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'ゲーム', reading: 'ゲーム', meaning: 'game', romaji: 'geemu' }] },
      { id: 'katakana:ko', character: 'コ', romaji: 'ko', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'コーヒー', reading: 'コーヒー', meaning: 'coffee', romaji: 'koohii' }] },
      { id: 'katakana:sa', character: 'サ', romaji: 'sa', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'サッカー', reading: 'サッカー', meaning: 'soccer', romaji: 'sakkaa' }] },
      { id: 'katakana:shi', character: 'シ', romaji: 'shi', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'システム', reading: 'システム', meaning: 'system', romaji: 'shisutemu' }] },
      { id: 'katakana:su', character: 'ス', romaji: 'su', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'スープ', reading: 'スープ', meaning: 'soup', romaji: 'suupu' }] },
      { id: 'katakana:se', character: 'セ', romaji: 'se', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'セーター', reading: 'セーター', meaning: 'sweater', romaji: 'seetaa' }] },
      { id: 'katakana:so', character: 'ソ', romaji: 'so', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'ソフト', reading: 'ソフト', meaning: 'soft', romaji: 'sofuto' }] },
      { id: 'katakana:ta', character: 'タ', romaji: 'ta', type: 'katakana', stroke_count: 4, stroke_order: [], examples: [{ word: 'タクシー', reading: 'タクシー', meaning: 'taxi', romaji: 'takushii' }] },
      { id: 'katakana:chi', character: 'チ', romaji: 'chi', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'チーズ', reading: 'チーズ', meaning: 'cheese', romaji: 'chiizu' }] },
      { id: 'katakana:tsu', character: 'ツ', romaji: 'tsu', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'ツアー', reading: 'ツアー', meaning: 'tour', romaji: 'tsuaa' }] },
      { id: 'katakana:te', character: 'テ', romaji: 'te', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'テレビ', reading: 'テレビ', meaning: 'television', romaji: 'terebi' }] },
      { id: 'katakana:to', character: 'ト', romaji: 'to', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'トマト', reading: 'トマト', meaning: 'tomato', romaji: 'tomato' }] },
      { id: 'katakana:na', character: 'ナ', romaji: 'na', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'ナイフ', reading: 'ナイフ', meaning: 'knife', romaji: 'naifu' }] },
      { id: 'katakana:ni', character: 'ニ', romaji: 'ni', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'ニュース', reading: 'ニュース', meaning: 'news', romaji: 'nyuusu' }] },
      { id: 'katakana:nu', character: 'ヌ', romaji: 'nu', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'ぬいぐるみ', reading: 'ぬいぐるみ', meaning: 'stuffed animal', romaji: 'nuigurumi' }] },
      { id: 'katakana:ne', character: 'ネ', romaji: 'ne', type: 'katakana', stroke_count: 4, stroke_order: [], examples: [{ word: 'ネクタイ', reading: 'ネクタイ', meaning: 'necktie', romaji: 'nekutai' }] },
      { id: 'katakana:no', character: 'ノ', romaji: 'no', type: 'katakana', stroke_count: 1, stroke_order: [], examples: [{ word: 'ノート', reading: 'ノート', meaning: 'note', romaji: 'nooto' }] },
      { id: 'katakana:ha', character: 'ハ', romaji: 'ha', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'ハンバーグ', reading: 'ハンバーグ', meaning: 'hamburg', romaji: 'hanbaagu' }] },
      { id: 'katakana:hi', character: 'ヒ', romaji: 'hi', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'ビール', reading: 'ビール', meaning: 'beer', romaji: 'biiru' }] },
      { id: 'katakana:fu', character: 'フ', romaji: 'fu', type: 'katakana', stroke_count: 1, stroke_order: [], examples: [{ word: 'フランス', reading: 'フランス', meaning: 'France', romaji: 'furansu' }] },
      { id: 'katakana:he', character: 'ヘ', romaji: 'he', type: 'katakana', stroke_count: 1, stroke_order: [], examples: [{ word: 'ヘリコプター', reading: 'ヘリコプター', meaning: 'helicopter', romaji: 'herikoputaa' }] },
      { id: 'katakana:ho', character: 'ホ', romaji: 'ho', type: 'katakana', stroke_count: 4, stroke_order: [], examples: [{ word: 'ホテル', reading: 'ホテル', meaning: 'hotel', romaji: 'hoteru' }] },
      { id: 'katakana:ma', character: 'マ', romaji: 'ma', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'マイク', reading: 'マイク', meaning: 'microphone', romaji: 'maiku' }] },
      { id: 'katakana:mi', character: 'ミ', romaji: 'mi', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'ミルク', reading: 'ミルク', meaning: 'milk', romaji: 'miruku' }] },
      { id: 'katakana:mu', character: 'ム', romaji: 'mu', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'ムービー', reading: 'ムービー', meaning: 'movie', romaji: 'muubii' }] },
      { id: 'katakana:me', character: 'メ', romaji: 'me', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'メガネ', reading: 'メガネ', meaning: 'glasses', romaji: 'megane' }] },
      { id: 'katakana:mo', character: 'モ', romaji: 'mo', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'モデル', reading: 'モデル', meaning: 'model', romaji: 'moderu' }] },
      { id: 'katakana:ya', character: 'ヤ', romaji: 'ya', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'ヤフー', reading: 'ヤフー', meaning: 'Yahoo', romaji: 'yahuu' }] },
      { id: 'katakana:yu', character: 'ユ', romaji: 'yu', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'ユーモア', reading: 'ユーモア', meaning: 'humor', romaji: 'yuumoa' }] },
      { id: 'katakana:yo', character: 'ヨ', romaji: 'yo', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'ヨーロッパ', reading: 'ヨーロッパ', meaning: 'Europe', romaji: 'yooroppa' }] },
      { id: 'katakana:ra', character: 'ラ', romaji: 'ra', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'ラーメン', reading: 'ラーメン', meaning: 'ramen', romaji: 'raamen' }] },
      { id: 'katakana:ri', character: 'リ', romaji: 'ri', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'リズム', reading: 'リズム', meaning: 'rhythm', romaji: 'rizumu' }] },
      { id: 'katakana:ru', character: 'ル', romaji: 'ru', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'ルール', reading: 'ルール', meaning: 'rule', romaji: 'ruuru' }] },
      { id: 'katakana:re', character: 'レ', romaji: 're', type: 'katakana', stroke_count: 1, stroke_order: [], examples: [{ word: 'レストラン', reading: 'レストラン', meaning: 'restaurant', romaji: 'resutoran' }] },
      { id: 'katakana:ro', character: 'ロ', romaji: 'ro', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: 'ロボット', reading: 'ロボット', meaning: 'robot', romaji: 'robotto' }] },
      { id: 'katakana:wa', character: 'ワ', romaji: 'wa', type: 'katakana', stroke_count: 2, stroke_order: [], examples: [{ word: 'ワイン', reading: 'ワイン', meaning: 'wine', romaji: 'wain' }] },
      { id: 'katakana:wo', character: 'ヲ', romaji: 'wo', type: 'katakana', stroke_count: 3, stroke_order: [], examples: [{ word: '〜ヲ', reading: '...', meaning: 'archaic particle', romaji: 'o' }] },
      { id: 'katakana:n', character: 'ン', romaji: 'n', type: 'katakana', stroke_count: 1, stroke_order: [], examples: [{ word: 'パン', reading: 'パン', meaning: 'bread', romaji: 'pan' }] }
    ];

    return [...hiragana, ...katakana];
  },

  /**
   * Get kana characters by type
   * @param type Type of kana ('hiragana' or 'katakana')
   * @returns Array of KanaCharacter objects
   */
  getKanaByType: (type: 'hiragana' | 'katakana'): KanaCharacter[] => {
    return kanaService.getAllKana().filter(kana => kana.type === type);
  },
  
  /**
   * Get user's kana progress from Supabase
   * @param userId User ID
   * @param type Type of kana ('hiragana', 'katakana', or 'all')
   * @returns Array of UserKanaProgress objects
   */
  getUserKanaProgress: async (userId: string, type: KanaType | 'all' = 'all'): Promise<UserKanaProgress[]> => {
    try {
      let query = supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);
        
      if (type !== 'all') {
        const kanaType = type === 'hiragana' ? 'hiragana' : 'katakana';
        query = query.like('character_id', `${kanaType}:%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Convert last_practiced and review_due to Date objects
      const progressWithDates = data.map(item => ({
        ...item,
        last_practiced: new Date(item.last_practiced),
        review_due: new Date(item.review_due)
      })) as UserKanaProgress[];
      
      return progressWithDates;
    } catch (error) {
      console.error('Error fetching user kana progress:', error);
      return [];
    }
  },

  /**
   * Calculate proficiency based on user progress
   * @param progress UserKanaProgress object
   * @returns Proficiency score (0-100)
   */
  calculateProficiency: (progress: UserKanaProgress): number => {
    // Base proficiency on total practice and correct answers
    let proficiency = Math.min(100, (progress.total_practice_count - progress.mistake_count) / progress.total_practice_count * 100);
    
    // Adjustments based on consecutive correct answers
    if (progress.consecutive_correct > 5) {
      proficiency += 10;
    } else if (progress.consecutive_correct < 2) {
      proficiency -= 5;
    }
    
    return Math.max(0, Math.min(100, Math.round(proficiency)));
  },

  /**
   * Calculate overall proficiency for a collection of kana
   * @param userId User ID
   * @param type Type of kana ('hiragana', 'katakana', or 'all')
   * @returns Average proficiency (0-100)
   */
  calculateOverallProficiency: async (userId: string, type: KanaType | 'all' = 'all') => {
    try {
      // Get user progress first
      const progressEntries = await kanaService.getUserKanaProgress(userId, type);
      
      if (!progressEntries || progressEntries.length === 0) return 0;
      
      // Filter entries by type if specified and not already filtered
      let filteredEntries = progressEntries;
      
      // Calculate total proficiency
      const totalProficiency = filteredEntries.reduce((sum, entry) => 
        sum + kanaService.calculateProficiency(entry), 0);
      
      return Math.round(totalProficiency / filteredEntries.length);
    } catch (error) {
      console.error('Error calculating overall proficiency:', error);
      return 0;
    }
  },

  /**
   * Update user's kana progress in Supabase
   * @param userId User ID
   * @param characterId Kana character ID
   * @param correct Whether the practice was correct or not
   * @returns Promise resolving to success status
   */
  updateProgress: async (userId: string, characterId: string, correct: boolean): Promise<boolean> => {
    try {
      // Fetch existing progress
      const { data: existingProgress, error: selectError } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('character_id', characterId)
        .single();
        
      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error fetching existing progress:', selectError);
        return false;
      }
      
      let newProficiency = 0;
      let newMistakeCount = 0;
      let newTotalPracticeCount = 1;
      let newConsecutiveCorrect = correct ? 1 : 0;
      let newMasteryLevel = 0;
      let lastPracticed = new Date();
      let reviewDue = calculateNextReviewDate(newProficiency, newMasteryLevel);
      
      if (existingProgress) {
        // Update existing progress
        newProficiency = kanaService.calculateProficiency({
          ...existingProgress,
          total_practice_count: existingProgress.total_practice_count + 1,
          mistake_count: existingProgress.mistake_count + (correct ? 0 : 1),
          consecutive_correct: correct ? existingProgress.consecutive_correct + 1 : 0
        });
        
        newMistakeCount = existingProgress.mistake_count + (correct ? 0 : 1);
        newTotalPracticeCount = existingProgress.total_practice_count + 1;
        newConsecutiveCorrect = correct ? existingProgress.consecutive_correct + 1 : 0;
        newMasteryLevel = existingProgress.mastery_level || 0;
        lastPracticed = new Date();
        
        // Mastery level updates
        if (newConsecutiveCorrect >= 5 && newMasteryLevel < 3) {
          newMasteryLevel = Math.min(3, newMasteryLevel + 1);
        }
        
        reviewDue = calculateNextReviewDate(newProficiency, newMasteryLevel);
        
        const { error: updateError } = await supabaseClient
          .from('user_kana_progress')
          .update({
            proficiency: newProficiency,
            mistake_count: newMistakeCount,
            total_practice_count: newTotalPracticeCount,
            consecutive_correct: newConsecutiveCorrect,
            mastery_level: newMasteryLevel,
            last_practiced: lastPracticed.toISOString(),
            review_due: reviewDue.toISOString()
          })
          .eq('id', existingProgress.id);
          
        if (updateError) {
          console.error('Error updating progress:', updateError);
          return false;
        }
      } else {
        // Insert new progress
        const { error: insertError } = await supabaseClient
          .from('user_kana_progress')
          .insert({
            user_id: userId,
            character_id: characterId,
            proficiency: 0,
            mistake_count: 0,
            total_practice_count: 1,
            consecutive_correct: correct ? 1 : 0,
            mastery_level: 0,
            last_practiced: lastPracticed.toISOString(),
            review_due: reviewDue.toISOString()
          });
          
        if (insertError) {
          console.error('Error creating progress:', insertError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error updating kana progress:', error);
      return false;
    }
  },

  /**
   * Update progress based on practice results
   * @param userId User ID
   * @param results Array of practice results
   * @returns Promise
