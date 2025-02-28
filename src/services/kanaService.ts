
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
  },
  // K-row (か行)
  {
    id: 'hiragana-ka',
    character: 'か',
    romaji: 'ka',
    type: 'hiragana',
    strokeCount: 3,
    strokeOrder: ['left vertical', 'top right diagonal', 'bottom horizontal with hook'],
    mnemonic: 'Looks like a mouth with a tongue sticking out saying "kah"',
    examples: [
      { word: 'かばん', romaji: 'kaban', meaning: 'bag' },
      { word: 'かみ', romaji: 'kami', meaning: 'paper' }
    ]
  },
  {
    id: 'hiragana-ki',
    character: 'き',
    romaji: 'ki',
    type: 'hiragana',
    strokeCount: 4,
    strokeOrder: ['top horizontal', 'vertical line', 'middle horizontal', 'bottom right diagonal'],
    mnemonic: 'Looks like a key (ki) with its teeth',
    examples: [
      { word: 'きょう', romaji: 'kyou', meaning: 'today' },
      { word: 'きく', romaji: 'kiku', meaning: 'to listen' }
    ]
  },
  {
    id: 'hiragana-ku',
    character: 'く',
    romaji: 'ku',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['curved line'],
    mnemonic: 'Looks like a mouth making the "ku" sound',
    examples: [
      { word: 'くに', romaji: 'kuni', meaning: 'country' },
      { word: 'くも', romaji: 'kumo', meaning: 'cloud' }
    ]
  },
  {
    id: 'hiragana-ke',
    character: 'け',
    romaji: 'ke',
    type: 'hiragana',
    strokeCount: 3,
    strokeOrder: ['top horizontal', 'vertical line', 'diagonal stroke'],
    mnemonic: 'Looks like a broken ketchup bottle',
    examples: [
      { word: 'けいたい', romaji: 'keitai', meaning: 'mobile phone' },
      { word: 'けさ', romaji: 'kesa', meaning: 'this morning' }
    ]
  },
  {
    id: 'hiragana-ko',
    character: 'こ',
    romaji: 'ko',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['top curve', 'bottom horizontal'],
    mnemonic: 'Looks like a fishing hook (ko for hook)',
    examples: [
      { word: 'こども', romaji: 'kodomo', meaning: 'child' },
      { word: 'ここ', romaji: 'koko', meaning: 'here' }
    ]
  },
  // S-row (さ行)
  {
    id: 'hiragana-sa',
    character: 'さ',
    romaji: 'sa',
    type: 'hiragana',
    strokeCount: 3,
    strokeOrder: ['top horizontal', 'middle curve', 'bottom right diagonal'],
    mnemonic: 'Resembles a sail on a sailboat',
    examples: [
      { word: 'さくら', romaji: 'sakura', meaning: 'cherry blossom' },
      { word: 'さんぽ', romaji: 'sanpo', meaning: 'walk' }
    ]
  },
  {
    id: 'hiragana-shi',
    character: 'し',
    romaji: 'shi',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['curved line'],
    mnemonic: 'Looks like a hook or a fishing rod',
    examples: [
      { word: 'しごと', romaji: 'shigoto', meaning: 'work' },
      { word: 'しずか', romaji: 'shizuka', meaning: 'quiet' }
    ]
  },
  {
    id: 'hiragana-su',
    character: 'す',
    romaji: 'su',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['vertical with loop', 'diagonal'],
    mnemonic: 'Like a spiral noodle with a chopstick through it',
    examples: [
      { word: 'すし', romaji: 'sushi', meaning: 'sushi' },
      { word: 'すき', romaji: 'suki', meaning: 'like' }
    ]
  },
  {
    id: 'hiragana-se',
    character: 'せ',
    romaji: 'se',
    type: 'hiragana',
    strokeCount: 3,
    strokeOrder: ['top horizontal', 'vertical line', 'bottom curved line'],
    mnemonic: 'Looks like a sail on a boat with a mast',
    examples: [
      { word: 'せんせい', romaji: 'sensei', meaning: 'teacher' },
      { word: 'せかい', romaji: 'sekai', meaning: 'world' }
    ]
  },
  {
    id: 'hiragana-so',
    character: 'そ',
    romaji: 'so',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['single curved stroke'],
    mnemonic: 'Looks like a bent wire or paperclip',
    examples: [
      { word: 'そら', romaji: 'sora', meaning: 'sky' },
      { word: 'そこ', romaji: 'soko', meaning: 'there' }
    ]
  },
  // T-row (た行)
  {
    id: 'hiragana-ta',
    character: 'た',
    romaji: 'ta',
    type: 'hiragana',
    strokeCount: 4,
    strokeOrder: ['top horizontal', 'vertical line', 'middle horizontal', 'right diagonal'],
    mnemonic: 'Resembles a table with one leg',
    examples: [
      { word: 'たべる', romaji: 'taberu', meaning: 'to eat' },
      { word: 'たのしい', romaji: 'tanoshii', meaning: 'fun' }
    ]
  },
  {
    id: 'hiragana-chi',
    character: 'ち',
    romaji: 'chi',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['left vertical with hook', 'right downward curve'],
    mnemonic: 'Looks like a small chair from the side',
    examples: [
      { word: 'ちかい', romaji: 'chikai', meaning: 'close/near' },
      { word: 'ちいさい', romaji: 'chiisai', meaning: 'small' }
    ]
  },
  {
    id: 'hiragana-tsu',
    character: 'つ',
    romaji: 'tsu',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['curved stroke'],
    mnemonic: 'Looks like a tsunami wave',
    examples: [
      { word: 'つくえ', romaji: 'tsukue', meaning: 'desk' },
      { word: 'つよい', romaji: 'tsuyoi', meaning: 'strong' }
    ]
  },
  {
    id: 'hiragana-te',
    character: 'て',
    romaji: 'te',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['single curved stroke'],
    mnemonic: 'Resembles a hand (te means hand in Japanese)',
    examples: [
      { word: 'てがみ', romaji: 'tegami', meaning: 'letter' },
      { word: 'てん', romaji: 'ten', meaning: 'point/dot' }
    ]
  },
  {
    id: 'hiragana-to',
    character: 'と',
    romaji: 'to',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['vertical line', 'horizontal line with hook'],
    mnemonic: 'Looks like a toe with a toenail',
    examples: [
      { word: 'とり', romaji: 'tori', meaning: 'bird' },
      { word: 'とけい', romaji: 'tokei', meaning: 'clock/watch' }
    ]
  }
];

const hiraganaSecondary: KanaCharacter[] = [
  // N-row (な行)
  {
    id: 'hiragana-na',
    character: 'な',
    romaji: 'na',
    type: 'hiragana',
    strokeCount: 4,
    strokeOrder: ['top horizontal', 'left vertical', 'right diagonal', 'bottom horizontal'],
    mnemonic: 'Looks like a sideways "na" with the top bar for emphasis',
    examples: [
      { word: 'なまえ', romaji: 'namae', meaning: 'name' },
      { word: 'なつ', romaji: 'natsu', meaning: 'summer' }
    ]
  },
  {
    id: 'hiragana-ni',
    character: 'に',
    romaji: 'ni',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['top horizontal', 'bottom curved horizontal'],
    mnemonic: 'Looks like two (ni) horizontal lines',
    examples: [
      { word: 'にほん', romaji: 'nihon', meaning: 'Japan' },
      { word: 'にく', romaji: 'niku', meaning: 'meat' }
    ]
  },
  {
    id: 'hiragana-nu',
    character: 'ぬ',
    romaji: 'nu',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['left loop', 'right curved sweep'],
    mnemonic: 'Looks like noodles in a bowl',
    examples: [
      { word: 'ぬの', romaji: 'nuno', meaning: 'cloth' },
      { word: 'ぬる', romaji: 'nuru', meaning: 'to paint' }
    ]
  },
  {
    id: 'hiragana-ne',
    character: 'ね',
    romaji: 'ne',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['left spiral', 'right curve'],
    mnemonic: 'Looks like a sleeping cat curled up (neko means cat)',
    examples: [
      { word: 'ねこ', romaji: 'neko', meaning: 'cat' },
      { word: 'ねる', romaji: 'neru', meaning: 'to sleep' }
    ]
  },
  {
    id: 'hiragana-no',
    character: 'の',
    romaji: 'no',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['curved stroke'],
    mnemonic: 'Looks like a note of music',
    examples: [
      { word: 'のみもの', romaji: 'nomimono', meaning: 'drink' },
      { word: 'のる', romaji: 'noru', meaning: 'to ride' }
    ]
  },
  // H-row (は行)
  {
    id: 'hiragana-ha',
    character: 'は',
    romaji: 'ha',
    type: 'hiragana',
    strokeCount: 3,
    strokeOrder: ['top horizontal', 'left vertical', 'right diagonal'],
    mnemonic: 'Looks like a house with a roof',
    examples: [
      { word: 'はな', romaji: 'hana', meaning: 'flower' },
      { word: 'はし', romaji: 'hashi', meaning: 'chopsticks' }
    ]
  },
  {
    id: 'hiragana-hi',
    character: 'ひ',
    romaji: 'hi',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['single curved stroke'],
    mnemonic: 'Looks like a match or a flame (hi means fire)',
    examples: [
      { word: 'ひと', romaji: 'hito', meaning: 'person' },
      { word: 'ひる', romaji: 'hiru', meaning: 'daytime' }
    ]
  },
  {
    id: 'hiragana-fu',
    character: 'ふ',
    romaji: 'fu',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['curved stroke with hook'],
    mnemonic: 'Looks like steam rising from food',
    examples: [
      { word: 'ふゆ', romaji: 'fuyu', meaning: 'winter' },
      { word: 'ふね', romaji: 'fune', meaning: 'ship' }
    ]
  },
  {
    id: 'hiragana-he',
    character: 'へ',
    romaji: 'he',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['single diagonal stroke'],
    mnemonic: 'Looks like an arrow pointing to "head" in that direction',
    examples: [
      { word: 'へや', romaji: 'heya', meaning: 'room' },
      { word: 'へん', romaji: 'hen', meaning: 'strange' }
    ]
  },
  {
    id: 'hiragana-ho',
    character: 'ほ',
    romaji: 'ho',
    type: 'hiragana',
    strokeCount: 4,
    strokeOrder: ['left vertical', 'top right diagonal', 'middle right horizontal', 'bottom cross'],
    mnemonic: 'Looks like a sail on a boat with a cross for a mast',
    examples: [
      { word: 'ほん', romaji: 'hon', meaning: 'book' },
      { word: 'ほし', romaji: 'hoshi', meaning: 'star' }
    ]
  },
  // M-row (ま行)
  {
    id: 'hiragana-ma',
    character: 'ま',
    romaji: 'ma',
    type: 'hiragana',
    strokeCount: 3,
    strokeOrder: ['top horizontal', 'vertical with hook', 'right cross'],
    mnemonic: 'Looks like a window with a curtain',
    examples: [
      { word: 'まど', romaji: 'mado', meaning: 'window' },
      { word: 'まち', romaji: 'machi', meaning: 'town' }
    ]
  },
  {
    id: 'hiragana-mi',
    character: 'み',
    romaji: 'mi',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['vertical line', 'curved line'],
    mnemonic: 'Resembles a snake (mimizu is a type of worm)',
    examples: [
      { word: 'みず', romaji: 'mizu', meaning: 'water' },
      { word: 'みせ', romaji: 'mise', meaning: 'store' }
    ]
  },
  {
    id: 'hiragana-mu',
    character: 'む',
    romaji: 'mu',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['top horizontal with hook', 'curved sweep'],
    mnemonic: 'Looks like a cow\'s face with horns (moo)',
    examples: [
      { word: 'むし', romaji: 'mushi', meaning: 'insect' },
      { word: 'むら', romaji: 'mura', meaning: 'village' }
    ]
  },
  {
    id: 'hiragana-me',
    character: 'め',
    romaji: 'me',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['vertical line', 'curved stroke'],
    mnemonic: 'Looks like an eye (me means eye)',
    examples: [
      { word: 'めがね', romaji: 'megane', meaning: 'glasses' },
      { word: 'あめ', romaji: 'ame', meaning: 'rain' }
    ]
  },
  {
    id: 'hiragana-mo',
    character: 'も',
    romaji: 'mo',
    type: 'hiragana',
    strokeCount: 3,
    strokeOrder: ['top horizontal', 'left vertical', 'right curved downstroke'],
    mnemonic: 'Looks like a monster with an arm',
    examples: [
      { word: 'もの', romaji: 'mono', meaning: 'thing' },
      { word: 'もり', romaji: 'mori', meaning: 'forest' }
    ]
  }
];

const hiraganaAdvanced: KanaCharacter[] = [
  // Y-row (や行)
  {
    id: 'hiragana-ya',
    character: 'や',
    romaji: 'ya',
    type: 'hiragana',
    strokeCount: 3,
    strokeOrder: ['top curve', 'middle horizontal', 'vertical with hook'],
    mnemonic: 'Looks like a person yawning with mouth open',
    examples: [
      { word: 'やま', romaji: 'yama', meaning: 'mountain' },
      { word: 'やさい', romaji: 'yasai', meaning: 'vegetable' }
    ]
  },
  {
    id: 'hiragana-yu',
    character: 'ゆ',
    romaji: 'yu',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['left curve', 'right loop'],
    mnemonic: 'Looks like steam rising from a hot spring (yu means hot water)',
    examples: [
      { word: 'ゆき', romaji: 'yuki', meaning: 'snow' },
      { word: 'ゆび', romaji: 'yubi', meaning: 'finger' }
    ]
  },
  {
    id: 'hiragana-yo',
    character: 'よ',
    romaji: 'yo',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['left vertical', 'right curve'],
    mnemonic: 'Looks like a yoga pose with one arm up',
    examples: [
      { word: 'よる', romaji: 'yoru', meaning: 'night' },
      { word: 'よわい', romaji: 'yowai', meaning: 'weak' }
    ]
  },
  // R-row (ら行)
  {
    id: 'hiragana-ra',
    character: 'ら',
    romaji: 'ra',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['top curve', 'right diagonal'],
    mnemonic: 'Looks like a radio antenna',
    examples: [
      { word: 'らくだ', romaji: 'rakuda', meaning: 'camel' },
      { word: 'らいねん', romaji: 'rainen', meaning: 'next year' }
    ]
  },
  {
    id: 'hiragana-ri',
    character: 'り',
    romaji: 'ri',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['left vertical', 'right downward curve'],
    mnemonic: 'Looks like a ribbon tied up',
    examples: [
      { word: 'りんご', romaji: 'ringo', meaning: 'apple' },
      { word: 'りゅう', romaji: 'ryuu', meaning: 'dragon' }
    ]
  },
  {
    id: 'hiragana-ru',
    character: 'る',
    romaji: 'ru',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['curved stroke'],
    mnemonic: 'Looks like a loop in a running track',
    examples: [
      { word: 'かる', romaji: 'karu', meaning: 'to cut' },
      { word: 'はる', romaji: 'haru', meaning: 'spring' }
    ]
  },
  {
    id: 'hiragana-re',
    character: 'れ',
    romaji: 're',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['curved stroke'],
    mnemonic: 'Looks like a person doing a leg raise exercise',
    examples: [
      { word: 'れきし', romaji: 'rekishi', meaning: 'history' },
      { word: 'それ', romaji: 'sore', meaning: 'that' }
    ]
  },
  {
    id: 'hiragana-ro',
    character: 'ろ',
    romaji: 'ro',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['curved stroke'],
    mnemonic: 'Looks like a road with a curve',
    examples: [
      { word: 'ろく', romaji: 'roku', meaning: 'six' },
      { word: 'いろ', romaji: 'iro', meaning: 'color' }
    ]
  },
  // W-row (わ行)
  {
    id: 'hiragana-wa',
    character: 'わ',
    romaji: 'wa',
    type: 'hiragana',
    strokeCount: 2,
    strokeOrder: ['left curve', 'right curve'],
    mnemonic: 'Looks like a wave in the water',
    examples: [
      { word: 'わたし', romaji: 'watashi', meaning: 'I/me' },
      { word: 'わらう', romaji: 'warau', meaning: 'to laugh' }
    ]
  },
  {
    id: 'hiragana-wo',
    character: 'を',
    romaji: 'wo',
    type: 'hiragana',
    strokeCount: 3,
    strokeOrder: ['top horizontal', 'left curve', 'right diagonal'],
    mnemonic: 'Looks like a mouth wide open saying "whoa!"',
    examples: [
      { word: 'えをかく', romaji: 'e wo kaku', meaning: 'to draw a picture' },
      { word: 'ほんをよむ', romaji: 'hon wo yomu', meaning: 'to read a book' }
    ]
  },
  // N (ん)
  {
    id: 'hiragana-n',
    character: 'ん',
    romaji: 'n',
    type: 'hiragana',
    strokeCount: 1,
    strokeOrder: ['curved stroke'],
    mnemonic: 'Looks like the letter n',
    examples: [
      { word: 'にほん', romaji: 'nihon', meaning: 'Japan' },
      { word: 'でんわ', romaji: 'denwa', meaning: 'telephone' }
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
  },
  // K-row (カ行)
  {
    id: 'katakana-ka',
    character: 'カ',
    romaji: 'ka',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['vertical stroke', 'angled stroke'],
    mnemonic: 'Like the letter K',
    examples: [
      { word: 'カメラ', romaji: 'kamera', meaning: 'camera' },
      { word: 'カレー', romaji: 'karē', meaning: 'curry' }
    ]
  },
  {
    id: 'katakana-ki',
    character: 'キ',
    romaji: 'ki',
    type: 'katakana',
    strokeCount: 3,
    strokeOrder: ['vertical stroke', 'top horizontal', 'bottom horizontal'],
    mnemonic: 'Looks like a key with its teeth',
    examples: [
      { word: 'キッチン', romaji: 'kicchin', meaning: 'kitchen' },
      { word: 'キス', romaji: 'kisu', meaning: 'kiss' }
    ]
  },
  {
    id: 'katakana-ku',
    character: 'ク',
    romaji: 'ku',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['horizontal stroke', 'angled stroke'],
    mnemonic: 'Like someone doing a deep knee bend',
    examples: [
      { word: 'クラス', romaji: 'kurasu', meaning: 'class' },
      { word: 'クッキー', romaji: 'kukkī', meaning: 'cookie' }
    ]
  },
  {
    id: 'katakana-ke',
    character: 'ケ',
    romaji: 'ke',
    type: 'katakana',
    strokeCount: 3,
    strokeOrder: ['vertical stroke', 'top horizontal', 'bottom diagonal'],
    mnemonic: 'Resembles an old-fashioned key',
    examples: [
      { word: 'ケーキ', romaji: 'kēki', meaning: 'cake' },
      { word: 'ケース', romaji: 'kēsu', meaning: 'case' }
    ]
  },
  {
    id: 'katakana-ko',
    character: 'コ',
    romaji: 'ko',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['top horizontal', 'vertical line'],
    mnemonic: 'Looks like a computer co-processor chip',
    examples: [
      { word: 'コーヒー', romaji: 'kōhī', meaning: 'coffee' },
      { word: 'コピー', romaji: 'kopī', meaning: 'copy' }
    ]
  },
  // S-row (サ行)
  {
    id: 'katakana-sa',
    character: 'サ',
    romaji: 'sa',
    type: 'katakana',
    strokeCount: 3,
    strokeOrder: ['horizontal stroke', 'vertical stroke', 'diagonal stroke'],
    mnemonic: 'Looks like a sideways 3',
    examples: [
      { word: 'サッカー', romaji: 'sakkā', meaning: 'soccer' },
      { word: 'サラダ', romaji: 'sarada', meaning: 'salad' }
    ]
  },
  {
    id: 'katakana-shi',
    character: 'シ',
    romaji: 'shi',
    type: 'katakana',
    strokeCount: 3,
    strokeOrder: ['top right diagonal', 'middle right diagonal', 'bottom right diagonal'],
    mnemonic: 'Looks like three smiles (shi for smile)',
    examples: [
      { word: 'シャツ', romaji: 'shatsu', meaning: 'shirt' },
      { word: 'シューズ', romaji: 'shūzu', meaning: 'shoes' }
    ]
  },
  {
    id: 'katakana-su',
    character: 'ス',
    romaji: 'su',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['diagonal stroke', 'vertical stroke with hook'],
    mnemonic: 'Looks like a noose hanging (su for suspend)',
    examples: [
      { word: 'スープ', romaji: 'sūpu', meaning: 'soup' },
      { word: 'スマホ', romaji: 'sumaho', meaning: 'smartphone' }
    ]
  },
  {
    id: 'katakana-se',
    character: 'セ',
    romaji: 'se',
    type: 'katakana',
    strokeCount: 1,
    strokeOrder: ['curved stroke with hook'],
    mnemonic: 'Looks like a sail catching the wind',
    examples: [
      { word: 'セーター', romaji: 'sētā', meaning: 'sweater' },
      { word: 'センター', romaji: 'sentā', meaning: 'center' }
    ]
  },
  {
    id: 'katakana-so',
    character: 'ソ',
    romaji: 'so',
    type: 'katakana',
    strokeCount: 1,
    strokeOrder: ['curved diagonal stroke'],
    mnemonic: 'Looks like someone sowing seeds',
    examples: [
      { word: 'ソファー', romaji: 'sofā', meaning: 'sofa' },
      { word: 'ソース', romaji: 'sōsu', meaning: 'sauce' }
    ]
  }
];

const katakanaSecondary: KanaCharacter[] = [
  // T-row (タ行)
  {
    id: 'katakana-ta',
    character: 'タ',
    romaji: 'ta',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['vertical stroke', 'horizontal stroke with hook'],
    mnemonic: 'Looks like a person standing next to a target',
    examples: [
      { word: 'タクシー', romaji: 'takushī', meaning: 'taxi' },
      { word: 'タイム', romaji: 'taimu', meaning: 'time' }
    ]
  },
  // Add remaining katakanaSecondary characters
  {
    id: 'katakana-chi',
    character: 'チ',
    romaji: 'chi',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['horizontal stroke', 'vertical stroke with hook'],
    mnemonic: 'Looks like a checkmark',
    examples: [
      { word: 'チーズ', romaji: 'chīzu', meaning: 'cheese' },
      { word: 'チケット', romaji: 'chiketto', meaning: 'ticket' }
    ]
  },
  {
    id: 'katakana-tsu',
    character: 'ツ',
    romaji: 'tsu',
    type: 'katakana',
    strokeCount: 3,
    strokeOrder: ['top right diagonal', 'middle right diagonal', 'bottom right diagonal'],
    mnemonic: 'Looks like three quotation marks in a row',
    examples: [
      { word: 'ツアー', romaji: 'tsuā', meaning: 'tour' },
      { word: 'ツール', romaji: 'tsūru', meaning: 'tool' }
    ]
  },
  {
    id: 'katakana-te',
    character: 'テ',
    romaji: 'te',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['horizontal stroke', 'vertical stroke with hook'],
    mnemonic: 'Looks like a telephone pole',
    examples: [
      { word: 'テレビ', romaji: 'terebi', meaning: 'television' },
      { word: 'テニス', romaji: 'tenisu', meaning: 'tennis' }
    ]
  },
  {
    id: 'katakana-to',
    character: 'ト',
    romaji: 'to',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['vertical stroke', 'horizontal stroke'],
    mnemonic: 'Looks like a doorknob',
    examples: [
      { word: 'トマト', romaji: 'tomato', meaning: 'tomato' },
      { word: 'トイレ', romaji: 'toire', meaning: 'toilet' }
    ]
  }
];

const katakanaAdvanced: KanaCharacter[] = [
  // N-row (ナ行)
  {
    id: 'katakana-na',
    character: 'ナ',
    romaji: 'na',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['vertical stroke', 'diagonal stroke'],
    mnemonic: 'Looks like the number 7',
    examples: [
      { word: 'ナイフ', romaji: 'naifu', meaning: 'knife' },
      { word: 'ナツ', romaji: 'natsu', meaning: 'summer' }
    ]
  },
  {
    id: 'katakana-ni',
    character: 'ニ',
    romaji: 'ni',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['top horizontal', 'bottom horizontal'],
    mnemonic: 'Looks like two (ni) horizontal lines',
    examples: [
      { word: 'ニュース', romaji: 'nyūsu', meaning: 'news' },
      { word: 'ニンジン', romaji: 'ninjin', meaning: 'carrot' }
    ]
  },
  {
    id: 'katakana-nu',
    character: 'ヌ',
    romaji: 'nu',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['vertical stroke with hook', 'diagonal stroke'],
    mnemonic: 'Looks like a noodle hanging from chopsticks',
    examples: [
      { word: 'ヌガー', romaji: 'nugā', meaning: 'nougat' },
      { word: 'ヌル', romaji: 'nuru', meaning: 'null (programming)' }
    ]
  },
  {
    id: 'katakana-ne',
    character: 'ネ',
    romaji: 'ne',
    type: 'katakana',
    strokeCount: 2,
    strokeOrder: ['horizontal stroke', 'vertical curve with hook'],
    mnemonic: 'Looks like a bent nail',
    examples: [
      { word: 'ネコ', romaji: 'neko', meaning: 'cat' },
      { word: 'ネット', romaji: 'netto', meaning: 'internet/net' }
    ]
  },
  {
    id: 'katakana-no',
    character: 'ノ',
    romaji: 'no',
    type: 'katakana',
    strokeCount: 1,
    strokeOrder: ['diagonal stroke'],
    mnemonic: 'Looks like a forward slash',
    examples: [
      { word: 'ノート', romaji: 'nōto', meaning: 'notebook' },
      { word: 'ノミ', romaji: 'nomi', meaning: 'flea' }
    ]
  }
];

// Group data for UI organization
const kanaGroups: KanaGroup[] = [
  {
    id: 'hiragana-basic',
    name: 'Basic Hiragana',
    characters: hiraganaBasic,
    type: 'hiragana'
  },
  {
    id: 'hiragana-secondary',
    name: 'Secondary Hiragana',
    characters: hiraganaSecondary,
    type: 'hiragana'
  },
  {
    id: 'hiragana-advanced',
    name: 'Advanced Hiragana',
    characters: hiraganaAdvanced,
    type: 'hiragana'
  },
  {
    id: 'katakana-basic',
    name: 'Basic Katakana',
    characters: katakanaBasic, 
    type: 'katakana'
  },
  {
    id: 'katakana-secondary',
    name: 'Secondary Katakana',
    characters: katakanaSecondary,
    type: 'katakana'
  },
  {
    id: 'katakana-advanced',
    name: 'Advanced Katakana',
    characters: katakanaAdvanced,
    type: 'katakana'
  }
];

// Service functions
const getKanaGroups = (): KanaGroup[] => {
  return kanaGroups;
};

const getKanaGroup = (groupId: string): KanaGroup | undefined => {
  return kanaGroups.find(group => group.id === groupId);
};

const getKanaCharacter = (characterId: string): KanaCharacter | undefined => {
  for (const group of kanaGroups) {
    const character = group.characters.find(char => char.id === characterId);
    if (character) return character;
  }
  return undefined;
};

const getAllKana = (): KanaCharacter[] => {
  const allCharacters: KanaCharacter[] = [];
  
  for (const group of kanaGroups) {
    allCharacters.push(...group.characters);
  }
  
  return allCharacters;
};

const getKanaByType = (type: KanaType): KanaCharacter[] => {
  const filteredKana: KanaCharacter[] = [];
  
  for (const group of kanaGroups) {
    if (group.type === type) {
      filteredKana.push(...group.characters);
    }
  }
  
  return filteredKana;
};

const getUserKanaProgress = async (userId: string): Promise<UserKanaProgress[]> => {
  try {
    const { data, error } = await supabase
      .from('user_kana_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (!data) return [];
    
    // Convert to our internal format
    return data.map(item => ({
      userId: item.user_id,
      characterId: item.character_id,
      proficiency: item.proficiency,
      lastPracticed: new Date(item.last_practiced),
      reviewDue: new Date(item.review_due),
      mistakeCount: item.mistake_count,
      totalPracticeCount: item.total_practice_count
    }));
  } catch (error) {
    console.error('Error fetching kana progress:', error);
    return [];
  }
};

interface UpdateProgressParams {
  userId: string;
  characterId: string;
  proficiency: number;
  mistakeCount: number;
  totalPracticeCount: number;
}

const updateUserKanaProgress = async (params: UpdateProgressParams): Promise<boolean> => {
  try {
    const { userId, characterId, proficiency, mistakeCount, totalPracticeCount } = params;
    
    const { data: existing, error: fetchError } = await supabase
      .from('user_kana_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('character_id', characterId)
      .maybeSingle();
    
    if (fetchError) {
      throw fetchError;
    }
    
    const now = new Date();
    // Calculate review due date (simple algorithm - in a production app this would be more sophisticated)
    const reviewDue = new Date();
    reviewDue.setDate(now.getDate() + (proficiency > 80 ? 7 : proficiency > 50 ? 3 : 1));
    
    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_kana_progress')
        .update({
          proficiency,
          mistake_count: mistakeCount,
          total_practice_count: totalPracticeCount,
          last_practiced: now.toISOString(),
          review_due: reviewDue.toISOString()
        })
        .eq('id', existing.id);
      
      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('user_kana_progress')
        .insert({
          user_id: userId,
          character_id: characterId,
          proficiency,
          mistake_count: mistakeCount,
          total_practice_count: totalPracticeCount,
          last_practiced: now.toISOString(),
          review_due: reviewDue.toISOString()
        });
        
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating kana progress:', error);
    return false;
  }
};

// Export the service functions as an object
export const kanaService = {
  getKanaGroups,
  getKanaGroup,
  getKanaCharacter,
  getAllKana,
  getKanaByType,
  getUserKanaProgress,
  updateUserKanaProgress
};
