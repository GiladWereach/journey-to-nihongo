
// This is a partial update focusing on the user progress calculation
import { supabaseClient } from '@/lib/supabase';

// Add this function to the kanaService object
export const kanaService = {
  /**
   * Get all kana characters
   * @returns Array of all kana characters
   */
  getAllKana: () => {
    return [
      { id: 'hiragana-a', type: 'hiragana', character: 'あ', romaji: 'a', group: 'vowels', strokes: 3, position: 1, examples: [{ word: '愛', romaji: 'ai', meaning: 'love' }], mnemonic: "Looks like an 'a' with a roof" },
      { id: 'hiragana-i', type: 'hiragana', character: 'い', romaji: 'i', group: 'vowels', strokes: 2, position: 2, examples: [{ word: '家', romaji: 'ie', meaning: 'house' }], mnemonic: "Two short vertical lines, like 'i' without the dot" },
      { id: 'hiragana-u', type: 'hiragana', character: 'う', romaji: 'u', group: 'vowels', strokes: 2, position: 3, examples: [{ word: '歌', romaji: 'uta', meaning: 'song' }], mnemonic: "Resembles a horseshoe or 'u' shape" },
      { id: 'hiragana-e', type: 'hiragana', character: 'え', romaji: 'e', group: 'vowels', strokes: 2, position: 4, examples: [{ word: '絵', romaji: 'e', meaning: 'picture' }], mnemonic: "Similar to a backward '3', forming an 'e'" },
      { id: 'hiragana-o', type: 'hiragana', character: 'お', romaji: 'o', group: 'vowels', strokes: 3, position: 5, examples: [{ word: '音', romaji: 'oto', meaning: 'sound' }], mnemonic: "Circular shape, like the letter 'o'" },
      { id: 'hiragana-ka', type: 'hiragana', character: 'か', romaji: 'ka', group: 'k', strokes: 3, position: 6, examples: [{ word: '力', romaji: 'chikara', meaning: 'power' }], mnemonic: "Looks like a 'k' with an extra line" },
      { id: 'hiragana-ki', type: 'hiragana', character: 'き', romaji: 'ki', group: 'k', strokes: 4, position: 7, examples: [{ word: '木', romaji: 'ki', meaning: 'tree' }], mnemonic: "Two keys hanging on a line" },
      { id: 'hiragana-ku', type: 'hiragana', character: 'く', romaji: 'ku', group: 'k', strokes: 1, position: 8, examples: [{ word: '九', romaji: 'kyuu', meaning: 'nine' }], mnemonic: "Looks like a beak" },
      { id: 'hiragana-ke', type: 'hiragana', character: 'け', romaji: 'ke', group: 'k', strokes: 3, position: 9, examples: [{ word: '毛', romaji: 'ke', meaning: 'hair' }], mnemonic: "Like a hairy caterpillar" },
      { id: 'hiragana-ko', type: 'hiragana', character: 'こ', romaji: 'ko', group: 'k', strokes: 2, position: 10, examples: [{ word: '子', romaji: 'ko', meaning: 'child' }], mnemonic: "Two chairs facing each other" },
      { id: 'hiragana-sa', type: 'hiragana', character: 'さ', romaji: 'sa', group: 's', strokes: 3, position: 11, examples: [{ word: '魚', romaji: 'sakana', meaning: 'fish' }], mnemonic: "Three horizontal strokes, think 's' for 'sa'" },
      { id: 'hiragana-shi', type: 'hiragana', character: 'し', romaji: 'shi', group: 's', strokes: 1, position: 12, examples: [{ word: '四', romaji: 'shi', meaning: 'four' }], mnemonic: "Looks like a fishing hook" },
      { id: 'hiragana-su', type: 'hiragana', character: 'す', romaji: 'su', group: 's', strokes: 2, position: 13, examples: [{ word: '酢', romaji: 'su', meaning: 'vinegar' }], mnemonic: "Looks like a swing" },
      { id: 'hiragana-se', type: 'hiragana', character: 'せ', romaji: 'se', group: 's', strokes: 3, position: 14, examples: [{ word: '背', romaji: 'se', meaning: 'back' }], mnemonic: "Like a stream flowing" },
      { id: 'hiragana-so', type: 'hiragana', character: 'そ', romaji: 'so', group: 's', strokes: 1, position: 15, examples: [{ word: '空', romaji: 'sora', meaning: 'sky' }], mnemonic: "Looks like a thread" },
      { id: 'hiragana-ta', type: 'hiragana', character: 'た', romaji: 'ta', group: 't', strokes: 4, position: 16, examples: [{ word: '竹', romaji: 'take', meaning: 'bamboo' }], mnemonic: "Cross shape, like 't' in 'ta'" },
      { id: 'hiragana-chi', type: 'hiragana', character: 'ち', romaji: 'chi', group: 't', strokes: 2, position: 17, examples: [{ word: '血', romaji: 'chi', meaning: 'blood' }], mnemonic: "Looks like a question mark" },
      { id: 'hiragana-tsu', type: 'hiragana', character: 'つ', romaji: 'tsu', group: 't', strokes: 1, position: 18, examples: [{ word: '月', romaji: 'tsuki', meaning: 'moon' }], mnemonic: "Looks like a smile" },
      { id: 'hiragana-te', type: 'hiragana', character: 'て', romaji: 'te', group: 't', strokes: 1, position: 19, examples: [{ word: '手', romaji: 'te', meaning: 'hand' }], mnemonic: "Looks like a bent hand" },
      { id: 'hiragana-to', type: 'hiragana', character: 'と', romaji: 'to', group: 't', strokes: 2, position: 20, examples: [{ word: '鳥', romaji: 'tori', meaning: 'bird' }], mnemonic: "Looks like a toe" },
      { id: 'hiragana-na', type: 'hiragana', character: 'な', romaji: 'na', group: 'n', strokes: 4, position: 21, examples: [{ word: '夏', romaji: 'natsu', meaning: 'summer' }], mnemonic: "Like an 'n' with an extra mark" },
      { id: 'hiragana-ni', type: 'hiragana', character: 'に', romaji: 'ni', group: 'n', strokes: 3, position: 22, examples: [{ word: '二', romaji: 'ni', meaning: 'two' }], mnemonic: "Two strokes plus one" },
      { id: 'hiragana-nu', type: 'hiragana', character: 'ぬ', romaji: 'nu', group: 'n', strokes: 2, position: 23, examples: [{ word: '布', romaji: 'nuno', meaning: 'cloth' }], mnemonic: "Looks like a noodle" },
      { id: 'hiragana-ne', type: 'hiragana', character: 'ね', romaji: 'ne', group: 'n', strokes: 2, position: 24, examples: [{ word: '音', romaji: 'ne', meaning: 'sound' }], mnemonic: "Looks like a prayer" },
      { id: 'hiragana-no', type: 'hiragana', character: 'の', romaji: 'no', group: 'n', strokes: 1, position: 25, examples: [{ word: '野', romaji: 'no', meaning: 'field' }], mnemonic: "Simple curve, like a 'no' entry" },
      { id: 'hiragana-ha', type: 'hiragana', character: 'は', romaji: 'ha', group: 'h', strokes: 3, position: 26, examples: [{ word: '歯', romaji: 'ha', meaning: 'tooth' }], mnemonic: "Looks like a hat" },
      { id: 'hiragana-hi', type: 'hiragana', character: 'ひ', romaji: 'hi', group: 'h', strokes: 1, position: 27, examples: [{ word: '火', romaji: 'hi', meaning: 'fire' }], mnemonic: "Looks like a flame" },
      { id: 'hiragana-fu', type: 'hiragana', character: 'ふ', romaji: 'fu', group: 'h', strokes: 4, position: 28, examples: [{ word: '風', romaji: 'fū', meaning: 'wind' }], mnemonic: "Looks like a pair of headphones" },
      { id: 'hiragana-he', type: 'hiragana', character: 'へ', romaji: 'he', group: 'h', strokes: 1, position: 29, examples: [{ word: '部屋', romaji: 'heya', meaning: 'room' }], mnemonic: "Simple stroke, like a direction" },
      { id: 'hiragana-ho', type: 'hiragana', character: 'ほ', romaji: 'ho', group: 'h', strokes: 5, position: 30, examples: [{ word: '本', romaji: 'hon', meaning: 'book' }], mnemonic: "Looks like a sail" },
      { id: 'hiragana-ma', type: 'hiragana', character: 'ま', romaji: 'ma', group: 'm', strokes: 3, position: 31, examples: [{ word: '間', romaji: 'ma', meaning: 'space' }], mnemonic: "Three vertical lines, 'm' has three legs in cursive" },
      { id: 'hiragana-mi', type: 'hiragana', character: 'み', romaji: 'mi', group: 'm', strokes: 2, position: 32, examples: [{ word: '水', romaji: 'mizu', meaning: 'water' }], mnemonic: "Looks like a number 21" },
      { id: 'hiragana-mu', type: 'hiragana', character: 'む', romaji: 'mu', group: 'm', strokes: 3, position: 33, examples: [{ word: '虫', romaji: 'mushi', meaning: 'insect' }], mnemonic: "Looks like a cow" },
      { id: 'hiragana-me', type: 'hiragana', character: 'め', romaji: 'me', group: 'm', strokes: 2, position: 34, examples: [{ word: '目', romaji: 'me', meaning: 'eye' }], mnemonic: "Looks like a female symbol" },
      { id: 'hiragana-mo', type: 'hiragana', character: 'も', romaji: 'mo', group: 'm', strokes: 3, position: 35, examples: [{ word: '物', romaji: 'mono', meaning: 'thing' }], mnemonic: "Looks like a fishing hook with a line" },
      { id: 'hiragana-ya', type: 'hiragana', character: 'や', romaji: 'ya', group: 'y', strokes: 3, position: 36, examples: [{ word: '山', romaji: 'yama', meaning: 'mountain' }], mnemonic: "Resembles a 'y' shape" },
      { id: 'hiragana-yu', type: 'hiragana', character: 'ゆ', romaji: 'yu', group: 'y', strokes: 2, position: 37, examples: [{ word: '湯', romaji: 'yu', meaning: 'hot water' }], mnemonic: "Looks like a bow" },
      { id: 'hiragana-yo', type: 'hiragana', character: 'よ', romaji: 'yo', group: 'y', strokes: 2, position: 38, examples: [{ word: '夜', romaji: 'yoru', meaning: 'night' }], mnemonic: "Looks like a key" },
      { id: 'hiragana-ra', type: 'hiragana', character: 'ら', romaji: 'ra', group: 'r', strokes: 2, position: 39, examples: [{ word: '楽', romaji: 'raku', meaning: 'comfort' }], mnemonic: "Like an 'r' with a loop" },
      { id: 'hiragana-ri', type: 'hiragana', character: 'り', romaji: 'ri', group: 'r', strokes: 2, position: 40, examples: [{ word: '理', romaji: 'ri', meaning: 'reason' }], mnemonic: "Looks like a standing person" },
      { id: 'hiragana-ru', type: 'hiragana', character: 'る', romaji: 'ru', group: 'r', strokes: 1, position: 41, examples: [{ word: '留', romaji: 'ru', meaning: 'stay' }], mnemonic: "Looks like a loop" },
      { id: 'hiragana-re', type: 'hiragana', character: 'れ', romaji: 're', group: 'r', strokes: 2, position: 42, examples: [{ word: '礼', romaji: 'rei', meaning: 'thanks' }], mnemonic: "Looks like a 're'wind symbol" },
      { id: 'hiragana-ro', type: 'hiragana', character: 'ろ', romaji: 'ro', group: 'r', strokes: 1, position: 43, examples: [{ word: '路', romaji: 'ro', meaning: 'road' }], mnemonic: "Looks like a spiral" },
      { id: 'hiragana-wa', type: 'hiragana', character: 'わ', romaji: 'wa', group: 'w', strokes: 2, position: 44, examples: [{ word: '私', romaji: 'watashi', meaning: 'I' }], mnemonic: "Circle with a tail, like 'w' in cursive" },
      { id: 'hiragana-wo', type: 'hiragana', character: 'を', romaji: 'wo', group: 'w', strokes: 3, position: 45, examples: [{ word: '〜を', romaji: 'o', meaning: 'particle' }], mnemonic: "Similar to 'wa' but with an extra stroke" },
      { id: 'hiragana-n', type: 'hiragana', character: 'ん', romaji: 'n', group: 'special', strokes: 2, position: 46, examples: [{ word: '本', romaji: 'hon', meaning: 'book' }], mnemonic: "Looks like a small 'n'" },
      { id: 'katakana-a', type: 'katakana', character: 'ア', romaji: 'a', group: 'vowels', strokes: 2, position: 1, examples: [{ word: 'アメリカ', romaji: 'amerika', meaning: 'America' }], mnemonic: "Looks like an arrow" },
      { id: 'katakana-i', type: 'katakana', character: 'イ', romaji: 'i', group: 'vowels', strokes: 2, position: 2, examples: [{ word: 'イギリス', romaji: 'igirisu', meaning: 'England' }], mnemonic: "Looks like a capital 'I'" },
      { id: 'katakana-u', type: 'katakana', character: 'ウ', romaji: 'u', group: 'vowels', strokes: 3, position: 3, examples: [{ word: 'ウイルス', romaji: 'uirusu', meaning: 'virus' }], mnemonic: "Crown shape" },
      { id: 'katakana-e', type: 'katakana', character: 'エ', romaji: 'e', group: 'vowels', strokes: 3, position: 4, examples: [{ word: 'エネルギー', romaji: 'enerugī', meaning: 'energy' }], mnemonic: "Like a sideways capital 'E'" },
      { id: 'katakana-o', type: 'katakana', character: 'オ', romaji: 'o', group: 'vowels', strokes: 3, position: 5, examples: [{ word: 'オイル', romaji: 'oiru', meaning: 'oil' }], mnemonic: "Looks like a tick" },
      { id: 'katakana-ka', type: 'katakana', character: 'カ', romaji: 'ka', group: 'k', strokes: 2, position: 6, examples: [{ word: 'カメラ', romaji: 'kamera', meaning: 'camera' }], mnemonic: "Looks like power lines" },
      { id: 'katakana-ki', type: 'katakana', character: 'キ', romaji: 'ki', group: 'k', strokes: 3, position: 7, examples: [{ word: 'ケーキ', romaji: 'kēki', meaning: 'cake' }], mnemonic: "Looks like crossed knives" },
      { id: 'katakana-ku', type: 'katakana', character: 'ク', romaji: 'ku', group: 'k', strokes: 1, position: 8, examples: [{ word: 'クリスマス', romaji: 'kurisumasu', meaning: 'Christmas' }], mnemonic: "Looks like a parenthesis" },
      { id: 'katakana-ke', type: 'katakana', character: 'ケ', romaji: 'ke', group: 'k', strokes: 3, position: 9, examples: [{ word: 'ゲーム', romaji: 'gēmu', meaning: 'game' }], mnemonic: "Like a checkmark" },
      { id: 'katakana-ko', type: 'katakana', character: 'コ', romaji: 'ko', group: 'k', strokes: 2, position: 10, examples: [{ word: 'コーヒー', romaji: 'kōhī', meaning: 'coffee' }], mnemonic: "Two small lines" },
      { id: 'katakana-sa', type: 'katakana', character: 'サ', romaji: 'sa', group: 's', strokes: 3, position: 11, examples: [{ word: 'サービス', romaji: 'sābisu', meaning: 'service' }], mnemonic: "Looks like a cross" },
      { id: 'katakana-shi', type: 'katakana', character: 'シ', romaji: 'shi', group: 's', strokes: 3, position: 12, examples: [{ word: 'システム', romaji: 'shisutemu', meaning: 'system' }], mnemonic: "Looks like a smile" },
      { id: 'katakana-su', type: 'katakana', character: 'ス', romaji: 'su', group: 's', strokes: 2, position: 13, examples: [{ word: 'スーツ', romaji: 'sūtsu', meaning: 'suit' }], mnemonic: "Looks like a hook" },
      { id: 'katakana-se', type: 'katakana', character: 'セ', romaji: 'se', group: 's', strokes: 2, position: 14, examples: [{ word: 'セーター', romaji: 'sētā', meaning: 'sweater' }], mnemonic: "Looks like a 7" },
      { id: 'katakana-so', type: 'katakana', character: 'ソ', romaji: 'so', group: 's', strokes: 1, position: 15, examples: [{ word: 'ソース', romaji: 'sōsu', meaning: 'sauce' }], mnemonic: "Looks like a slash" },
      { id: 'katakana-ta', type: 'katakana', character: 'タ', romaji: 'ta', group: 't', strokes: 3, position: 16, examples: [{ word: 'タクシー', romaji: 'takushī', meaning: 'taxi' }], mnemonic: "Looks like a top" },
      { id: 'katakana-chi', type: 'katakana', character: 'チ', romaji: 'chi', group: 't', strokes: 2, position: 17, examples: [{ word: 'チーズ', romaji: 'chīzu', meaning: 'cheese' }], mnemonic: "Looks like a chair" },
      { id: 'katakana-tsu', type: 'katakana', character: 'ツ', romaji: 'tsu', group: 't', strokes: 3, position: 18, examples: [{ word: 'ツアー', romaji: 'tsuā', meaning: 'tour' }], mnemonic: "Two lines" },
      { id: 'katakana-te', type: 'katakana', character: 'テ', romaji: 'te', group: 't', strokes: 3, position: 19, examples: [{ word: 'テスト', romaji: 'tesuto', meaning: 'test' }], mnemonic: "Looks like a teepee" },
      { id: 'katakana-to', type: 'katakana', character: 'ト', romaji: 'to', group: 't', strokes: 2, position: 20, examples: [{ word: 'トマト', romaji: 'tomato', meaning: 'tomato' }], mnemonic: "Looks like a door" },
      { id: 'katakana-na', type: 'katakana', character: 'ナ', romaji: 'na', group: 'n', strokes: 2, position: 21, examples: [{ word: 'ナイフ', romaji: 'naifu', meaning: 'knife' }], mnemonic: "Looks like a plus sign" },
      { id: 'katakana-ni', type: 'katakana', character: 'ニ', romaji: 'ni', group: 'n', strokes: 2, position: 22, examples: [{ word: 'ニュース', romaji: 'nyūsu', meaning: 'news' }], mnemonic: "Two lines" },
      { id: 'katakana-nu', type: 'katakana', character: 'ヌ', romaji: 'nu', group: 'n', strokes: 2, position: 23, examples: [{ word: 'ヌードル', romaji: 'nūdoru', meaning: 'noodle' }], mnemonic: "Looks like a hook" },
      { id: 'katakana-ne', type: 'katakana', character: 'ネ', romaji: 'ne', group: 'n', strokes: 4, position: 24, examples: [{ word: 'ネクタイ', romaji: 'nekutai', meaning: 'necktie' }], mnemonic: "Looks like a net" },
      { id: 'katakana-no', type: 'katakana', character: 'ノ', romaji: 'no', group: 'n', strokes: 1, position: 25, examples: [{ word: 'ノート', romaji: 'nōto', meaning: 'note' }], mnemonic: "Looks like a stroke" },
      { id: 'katakana-ha', type: 'katakana', character: 'ハ', romaji: 'ha', group: 'h', strokes: 2, position: 26, examples: [{ word: 'ハンバーグ', romaji: 'hanbāgu', meaning: 'hamburger' }], mnemonic: "Looks like a laugh" },
      { id: 'katakana-hi', type: 'katakana', character: 'ヒ', romaji: 'hi', group: 'h', strokes: 2, position: 27, examples: [{ word: 'ヒーター', romaji: 'hītā', meaning: 'heater' }], mnemonic: "Looks like a smile" },
      { id: 'katakana-fu', type: 'katakana', character: 'フ', romaji: 'fu', group: 'h', strokes: 1, position: 28, examples: [{ word: 'フィルム', romaji: 'firumu', meaning: 'film' }], mnemonic: "Looks like a roof" },
      { id: 'katakana-he', type: 'katakana', character: 'ヘ', romaji: 'he', group: 'h', strokes: 1, position: 29, examples: [{ word: 'ヘリコプター', romaji: 'herikoputā', meaning: 'helicopter' }], mnemonic: "Looks like a hill" },
      { id: 'katakana-ho', type: 'katakana', character: 'ホ', romaji: 'ho', group: 'h', strokes: 4, position: 30, examples: [{ word: 'ホテル', romaji: 'hoteru', meaning: 'hotel' }], mnemonic: "Looks like a flag" },
      { id: 'katakana-ma', type: 'katakana', character: 'マ', romaji: 'ma', group: 'm', strokes: 3, position: 31, examples: [{ word: 'マイク', romaji: 'maiku', meaning: 'microphone' }], mnemonic: "Looks like a mother" },
      { id: 'katakana-mi', type: 'katakana', character: 'ミ', romaji: 'mi', group: 'm', strokes: 3, position: 32, examples: [{ word: 'ミルク', romaji: 'miruku', meaning: 'milk' }], mnemonic: "Three lines" },
      { id: 'katakana-mu', type: 'katakana', character: 'ム', romaji: 'mu', group: 'm', strokes: 3, position: 33, examples: [{ word: 'ムービー', romaji: 'mūbī', meaning: 'movie' }], mnemonic: "Looks like a mountain" },
      { id: 'katakana-me', type: 'katakana', character: 'メ', romaji: 'me', group: 'm', strokes: 2, position: 34, examples: [{ word: 'メモ', romaji: 'memo', meaning: 'memo' }], mnemonic: "Looks like an X" },
      { id: 'katakana-mo', type: 'katakana', character: 'モ', romaji: 'mo', group: 'm', strokes: 3, position: 35, examples: [{ word: 'モデル', romaji: 'moderu', meaning: 'model' }], mnemonic: "Looks like a mohawk" },
      { id: 'katakana-ya', type: 'katakana', character: 'ヤ', romaji: 'ya', group: 'y', strokes: 3, position: 36, examples: [{ word: 'ヤード', romaji: 'yādo', meaning: 'yard' }], mnemonic: "Looks like a yak" },
      { id: 'katakana-yu', type: 'katakana', character: 'ユ', romaji: 'yu', group: 'y', strokes: 2, position: 37, examples: [{ word: 'ユーモア', romaji: 'yūmoa', meaning: 'humor' }], mnemonic: "Looks like a U" },
      { id: 'katakana-yo', type: 'katakana', character: 'ヨ', romaji: 'yo', group: 'y', strokes: 3, position: 38, examples: [{ word: 'ヨーグルト', romaji: 'yōguruto', meaning: 'yogurt' }], mnemonic: "Looks like a fork" },
      { id: 'katakana-ra', type: 'katakana', character: 'ラ', romaji: 'ra', group: 'r', strokes: 2, position: 39, examples: [{ word: 'ラジオ', romaji: 'rajio', meaning: 'radio' }], mnemonic: "Looks like a ladder" },
      { id: 'katakana-ri', type: 'katakana', character: 'リ', romaji: 'ri', group: 'r', strokes: 2, position: 40, examples: [{ word: 'リズム', romaji: 'rizumu', meaning: 'rhythm' }], mnemonic: "Looks like a river" },
      { id: 'katakana-ru', type: 'katakana', character: 'ル', romaji: 'ru', group: 'r', strokes: 2, position: 41, examples: [{ word: 'ルール', romaji: 'rūru', meaning: 'rule' }], mnemonic: "Looks like a ruby" },
      { id: 'katakana-re', type: 'katakana', character: 'レ', romaji: 're', group: 'r', strokes: 1, position: 42, examples: [{ word: 'レストラン', romaji: 'resutoran', meaning: 'restaurant' }], mnemonic: "Looks like a leg" },
      { id: 'katakana-ro', type: 'katakana', character: 'ロ', romaji: 'ro', group: 'r', strokes: 3, position: 43, examples: [{ word: 'ロボット', romaji: 'robotto', meaning: 'robot' }], mnemonic: "Looks like a box" },
      { id: 'katakana-wa', type: 'katakana', character: 'ワ', romaji: 'wa', group: 'w', strokes: 2, position: 44, examples: [{ word: 'ワイン', romaji: 'wain', meaning: 'wine' }], mnemonic: "Looks like a wide V" },
      { id: 'katakana-wo', type: 'katakana', character: 'ヲ', romaji: 'wo', group: 'w', strokes: 3, position: 45, examples: [{ word: '〜ヲ', romaji: 'o', meaning: 'particle' }], mnemonic: "Similar to 'wa' but with an extra stroke" },
      { id: 'katakana-n', type: 'katakana', character: 'ン', romaji: 'n', group: 'special', strokes: 2, position: 46, examples: [{ word: 'ラーメン', romaji: 'rāmen', meaning: 'ramen' }], mnemonic: "Looks like a checkmark" },
      { id: 'katakana-vu', type: 'katakana', character: 'ヴ', romaji: 'vu', group: 'special', strokes: 2, position: 47, examples: [{ word: 'ヴォルト', romaji: 'voruto', meaning: 'volt' }], mnemonic: "Rare character for loanwords" },
      { id: 'katakana-ga', type: 'katakana', character: 'ガ', romaji: 'ga', group: 'g', strokes: 2, position: 48, examples: [{ word: 'ガソリン', romaji: 'gasorin', meaning: 'gasoline' }], mnemonic: "Like 'ka' with extra dots (voiced 'k' becomes 'g')" },
      { id: 'katakana-gi', type: 'katakana', character: 'ギ', romaji: 'gi', group: 'g', strokes: 3, position: 49, examples: [{ word: 'ギター', romaji: 'gitā', meaning: 'guitar' }], mnemonic: "Like 'ki' with extra dots (voiced 'k' becomes 'g')" },
      { id: 'katakana-gu', type: 'katakana', character: 'グ', romaji: 'gu', group: 'g', strokes: 1, position: 50, examples: [{ word: 'グループ', romaji: 'gurūpu', meaning: 'group' }], mnemonic: "Like 'ku' with extra dots (voiced 'k' becomes 'g')" },
      { id: 'katakana-ge', type: 'katakana', character: 'ゲ', romaji: 'ge', group: 'g', strokes: 3, position: 51, examples: [{ word: 'ゲーム', romaji: 'gēmu', meaning: 'game' }], mnemonic: "Like 'ke' with extra dots (voiced 'k' becomes 'g')" },
      { id: 'katakana-go', type: 'katakana', character: 'ゴ', romaji: 'go', group: 'g', strokes: 2, position: 52, examples: [{ word: 'ゴリラ', romaji: 'gorira', meaning: 'gorilla' }], mnemonic: "Like 'ko' with extra dots (voiced 'k' becomes 'g')" },
      { id: 'katakana-za', type: 'katakana', character: 'ザ', romaji: 'za', group: 'z', strokes: 3, position: 53, examples: [{ word: 'ザリガニ', romaji: 'zarigani', meaning: 'crayfish' }], mnemonic: "Like 'sa' with extra marks (voiced 's' becomes 'z')" },
      { id: 'katakana-ji', type: 'katakana', character: 'ジ', romaji: 'ji', group: 'z', strokes: 3, position: 54, examples: [{ word: 'ジーンズ', romaji: 'jīnzu', meaning: 'jeans' }], mnemonic: "Like 'shi' with extra marks (voiced 's' becomes 'z')" },
      { id: 'katakana-zu', type: 'katakana', character: 'ズ', romaji: 'zu', group: 'z', strokes: 2, position: 55, examples: [{ word: 'ズボン', romaji: 'zubon', meaning: 'trousers' }], mnemonic: "Like 'su' with extra marks (voiced 's' becomes 'z')" },
      { id: 'katakana-ze', type: 'katakana', character: 'ゼ', romaji: 'ze', group: 'z', strokes: 2, position: 56, examples: [{ word: 'ゼロ', romaji: 'zero', meaning: 'zero' }], mnemonic: "Like 'se' with extra marks (voiced 's' becomes 'z')" },
      { id: 'katakana-zo', type: 'katakana', character: 'ゾ', romaji: 'zo', group: 'z', strokes: 1, position: 57, examples: [{ word: 'ゾーン', romaji: 'zōn', meaning: 'zone' }], mnemonic: "Like 'so' with extra marks (voiced 's' becomes 'z')" },
      { id: 'katakana-da', type: 'katakana', character: 'ダ', romaji: 'da', group: 'd', strokes: 3, position: 58, examples: [{ word: 'ダム', romaji: 'damu', meaning: 'dam' }], mnemonic: "Like 'ta' with extra marks (voiced 't' becomes 'd')" },
      { id: 'katakana-di', type: 'katakana', character: 'ヂ', romaji: 'di', group: 'd', strokes: 2, position: 59, examples: [{ word: 'デジタル', romaji: 'dejitaru', meaning: 'digital' }], mnemonic: "Rarely used, same pronunciation as 'ji'" },
      { id: 'katakana-du', type: 'katakana', character: 'ヅ', romaji: 'du', group: 'd', strokes: 1, position: 60, examples: [{ word: 'ツヅキ', romaji: 'tsuzuki', meaning: 'continuation' }], mnemonic: "Like 'tsu' with extra marks (voiced 't' becomes 'd')" }
    ];
  },

  /**
   * Get user progress data for kana characters
   * @param userId - The user's ID
   * @param kanaType - hiragana or katakana
   * @returns Array of progress data for each character
   */
  getUserKanaProgress: async (userId, kanaType = null) => {
    try {
      const { data, error } = await supabaseClient
        .from('kana_progress')
        .select('*')
        .eq('user_id', userId)
        .eq(kanaType ? 'kana_type' : 'is_not_null', kanaType || true);

      if (error) {
        console.error('Error fetching kana progress:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getUserKanaProgress:', err);
      return [];
    }
  },

  /**
   * Calculate proficiency level for a character based on user progress
   * @param progressData - The progress data for a character
   * @returns Proficiency level as a percentage (0-100)
   */
  calculateProficiency: (progressData) => {
    if (!progressData) return 0;
    
    const { correct_count, incorrect_count } = progressData;
    const totalAttempts = correct_count + incorrect_count;
    
    if (totalAttempts === 0) return 0;
    
    // Calculate base accuracy
    let proficiency = Math.round((correct_count / totalAttempts) * 100);
    
    // Apply weight based on total attempts (more attempts = more reliable proficiency)
    if (totalAttempts >= 10) {
      // Full confidence in the proficiency at 10+ attempts
      return proficiency;
    } else {
      // Scale confidence with number of attempts
      const confidenceFactor = totalAttempts / 10;
      return Math.round(proficiency * confidenceFactor);
    }
  }
};
