
import { supabaseClient } from '@/lib/supabase';
import { KanaCharacter, KanaGroup, KanaGroupCharacter, KanaType, UserKanaProgress } from '@/types/kana';

// Complete hiragana character set
const hiraganaCharacters: KanaCharacter[] = [
  // Basic vowels
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
        reading: 'あかい'
      },
      {
        word: 'あさ',
        romaji: 'asa',
        meaning: 'morning',
        reading: 'あさ'
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
        reading: 'いけ'
      },
      {
        word: 'いいえ',
        romaji: 'iie',
        meaning: 'no',
        reading: 'いいえ'
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
        reading: 'うみ'
      },
      {
        word: 'うた',
        romaji: 'uta',
        meaning: 'song',
        reading: 'うた'
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
        reading: 'えいが'
      },
      {
        word: 'えき',
        romaji: 'eki',
        meaning: 'station',
        reading: 'えき'
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
        reading: 'おかし'
      },
      {
        word: 'おと',
        romaji: 'oto',
        meaning: 'sound',
        reading: 'おと'
      }
    ]
  },

  // K-row
  {
    id: 'ka',
    character: 'か',
    romaji: 'ka',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a key, which starts with "k"',
    examples: [
      {
        word: 'かばん',
        romaji: 'kaban',
        meaning: 'bag',
        reading: 'かばん'
      },
      {
        word: 'かく',
        romaji: 'kaku',
        meaning: 'to write',
        reading: 'かく'
      }
    ]
  },
  {
    id: 'ki',
    character: 'き',
    romaji: 'ki',
    type: 'hiragana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'Looks like a key with teeth',
    examples: [
      {
        word: 'きもの',
        romaji: 'kimono',
        meaning: 'kimono',
        reading: 'きもの'
      },
      {
        word: 'きく',
        romaji: 'kiku',
        meaning: 'to listen',
        reading: 'きく'
      }
    ]
  },
  {
    id: 'ku',
    character: 'く',
    romaji: 'ku',
    type: 'hiragana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a coo-coo bird opening its beak',
    examples: [
      {
        word: 'くに',
        romaji: 'kuni',
        meaning: 'country',
        reading: 'くに'
      },
      {
        word: 'くる',
        romaji: 'kuru',
        meaning: 'to come',
        reading: 'くる'
      }
    ]
  },
  {
    id: 'ke',
    character: 'け',
    romaji: 'ke',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a keg with a line',
    examples: [
      {
        word: 'けいさつ',
        romaji: 'keisatsu',
        meaning: 'police',
        reading: 'けいさつ'
      },
      {
        word: 'けす',
        romaji: 'kesu',
        meaning: 'to erase',
        reading: 'けす'
      }
    ]
  },
  {
    id: 'ko',
    character: 'こ',
    romaji: 'ko',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a coconut with a line',
    examples: [
      {
        word: 'こども',
        romaji: 'kodomo',
        meaning: 'child',
        reading: 'こども'
      },
      {
        word: 'ここ',
        romaji: 'koko',
        meaning: 'here',
        reading: 'ここ'
      }
    ]
  },

  // S-row
  {
    id: 'sa',
    character: 'さ',
    romaji: 'sa',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a sail with wind',
    examples: [
      {
        word: 'さくら',
        romaji: 'sakura',
        meaning: 'cherry blossom',
        reading: 'さくら'
      },
      {
        word: 'さむい',
        romaji: 'samui',
        meaning: 'cold',
        reading: 'さむい'
      }
    ]
  },
  {
    id: 'shi',
    character: 'し',
    romaji: 'shi',
    type: 'hiragana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a fishing hook',
    examples: [
      {
        word: 'しんぶん',
        romaji: 'shinbun',
        meaning: 'newspaper',
        reading: 'しんぶん'
      },
      {
        word: 'しお',
        romaji: 'shio',
        meaning: 'salt',
        reading: 'しお'
      }
    ]
  },
  {
    id: 'su',
    character: 'す',
    romaji: 'su',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a swing set',
    examples: [
      {
        word: 'すし',
        romaji: 'sushi',
        meaning: 'sushi',
        reading: 'すし'
      },
      {
        word: 'すき',
        romaji: 'suki',
        meaning: 'to like',
        reading: 'すき'
      }
    ]
  },
  {
    id: 'se',
    character: 'せ',
    romaji: 'se',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a sail boat',
    examples: [
      {
        word: 'せなか',
        romaji: 'senaka',
        meaning: 'back (body)',
        reading: 'せなか'
      },
      {
        word: 'せかい',
        romaji: 'sekai',
        meaning: 'world',
        reading: 'せかい'
      }
    ]
  },
  {
    id: 'so',
    character: 'そ',
    romaji: 'so',
    type: 'hiragana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a sewing needle',
    examples: [
      {
        word: 'そら',
        romaji: 'sora',
        meaning: 'sky',
        reading: 'そら'
      },
      {
        word: 'そと',
        romaji: 'soto',
        meaning: 'outside',
        reading: 'そと'
      }
    ]
  },

  // T-row
  {
    id: 'ta',
    character: 'た',
    romaji: 'ta',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a tie on a hanger',
    examples: [
      {
        word: 'たべる',
        romaji: 'taberu',
        meaning: 'to eat',
        reading: 'たべる'
      },
      {
        word: 'たかい',
        romaji: 'takai',
        meaning: 'expensive/high',
        reading: 'たかい'
      }
    ]
  },
  {
    id: 'chi',
    character: 'ち',
    romaji: 'chi',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a cheerleader\'s pom-pom',
    examples: [
      {
        word: 'ちいさい',
        romaji: 'chiisai',
        meaning: 'small',
        reading: 'ちいさい'
      },
      {
        word: 'ちち',
        romaji: 'chichi',
        meaning: 'father',
        reading: 'ちち'
      }
    ]
  },
  {
    id: 'tsu',
    character: 'つ',
    romaji: 'tsu',
    type: 'hiragana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a tsu-nami wave',
    examples: [
      {
        word: 'つくえ',
        romaji: 'tsukue',
        meaning: 'desk',
        reading: 'つくえ'
      },
      {
        word: 'つかう',
        romaji: 'tsukau',
        meaning: 'to use',
        reading: 'つかう'
      }
    ]
  },
  {
    id: 'te',
    character: 'て',
    romaji: 'te',
    type: 'hiragana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a telephone receiver',
    examples: [
      {
        word: 'てがみ',
        romaji: 'tegami',
        meaning: 'letter',
        reading: 'てがみ'
      },
      {
        word: 'てら',
        romaji: 'tera',
        meaning: 'temple',
        reading: 'てら'
      }
    ]
  },
  {
    id: 'to',
    character: 'と',
    romaji: 'to',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a toe with a nail',
    examples: [
      {
        word: 'とり',
        romaji: 'tori',
        meaning: 'bird',
        reading: 'とり'
      },
      {
        word: 'とけい',
        romaji: 'tokei',
        meaning: 'clock/watch',
        reading: 'とけい'
      }
    ]
  },

  // N-row
  {
    id: 'na',
    character: 'な',
    romaji: 'na',
    type: 'hiragana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'Looks like a knock at the door',
    examples: [
      {
        word: 'なつ',
        romaji: 'natsu',
        meaning: 'summer',
        reading: 'なつ'
      },
      {
        word: 'なか',
        romaji: 'naka',
        meaning: 'inside/middle',
        reading: 'なか'
      }
    ]
  },
  {
    id: 'ni',
    character: 'に',
    romaji: 'ni',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a needle and thread',
    examples: [
      {
        word: 'にく',
        romaji: 'niku',
        meaning: 'meat',
        reading: 'にく'
      },
      {
        word: 'にわ',
        romaji: 'niwa',
        meaning: 'garden',
        reading: 'にわ'
      }
    ]
  },
  {
    id: 'nu',
    character: 'ぬ',
    romaji: 'nu',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like noodles hanging',
    examples: [
      {
        word: 'ぬの',
        romaji: 'nuno',
        meaning: 'cloth',
        reading: 'ぬの'
      },
      {
        word: 'ぬる',
        romaji: 'nuru',
        meaning: 'to paint',
        reading: 'ぬる'
      }
    ]
  },
  {
    id: 'ne',
    character: 'ね',
    romaji: 'ne',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a necklace',
    examples: [
      {
        word: 'ねこ',
        romaji: 'neko',
        meaning: 'cat',
        reading: 'ねこ'
      },
      {
        word: 'ねむい',
        romaji: 'nemui',
        meaning: 'sleepy',
        reading: 'ねむい'
      }
    ]
  },
  {
    id: 'no',
    character: 'の',
    romaji: 'no',
    type: 'hiragana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a nose',
    examples: [
      {
        word: 'のみもの',
        romaji: 'nomimono',
        meaning: 'drink',
        reading: 'のみもの'
      },
      {
        word: 'のる',
        romaji: 'noru',
        meaning: 'to ride',
        reading: 'のる'
      }
    ]
  },

  // H-row
  {
    id: 'ha',
    character: 'は',
    romaji: 'ha',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a house with a window',
    examples: [
      {
        word: 'はな',
        romaji: 'hana',
        meaning: 'flower',
        reading: 'はな'
      },
      {
        word: 'はし',
        romaji: 'hashi',
        meaning: 'chopsticks',
        reading: 'はし'
      }
    ]
  },
  {
    id: 'hi',
    character: 'ひ',
    romaji: 'hi',
    type: 'hiragana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a matchstick',
    examples: [
      {
        word: 'ひと',
        romaji: 'hito',
        meaning: 'person',
        reading: 'ひと'
      },
      {
        word: 'ひる',
        romaji: 'hiru',
        meaning: 'daytime',
        reading: 'ひる'
      }
    ]
  },
  {
    id: 'fu',
    character: 'ふ',
    romaji: 'fu',
    type: 'hiragana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'Looks like Mount Fuji',
    examples: [
      {
        word: 'ふゆ',
        romaji: 'fuyu',
        meaning: 'winter',
        reading: 'ふゆ'
      },
      {
        word: 'ふとん',
        romaji: 'futon',
        meaning: 'futon',
        reading: 'ふとん'
      }
    ]
  },
  {
    id: 'he',
    character: 'へ',
    romaji: 'he',
    type: 'hiragana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like someone doing a headstand',
    examples: [
      {
        word: 'へや',
        romaji: 'heya',
        meaning: 'room',
        reading: 'へや'
      },
      {
        word: 'へび',
        romaji: 'hebi',
        meaning: 'snake',
        reading: 'へび'
      }
    ]
  },
  {
    id: 'ho',
    character: 'ほ',
    romaji: 'ho',
    type: 'hiragana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'Looks like a sail on a boat',
    examples: [
      {
        word: 'ほん',
        romaji: 'hon',
        meaning: 'book',
        reading: 'ほん'
      },
      {
        word: 'ほし',
        romaji: 'hoshi',
        meaning: 'star',
        reading: 'ほし'
      }
    ]
  },

  // M-row
  {
    id: 'ma',
    character: 'ま',
    romaji: 'ma',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a mama holding a baby',
    examples: [
      {
        word: 'まど',
        romaji: 'mado',
        meaning: 'window',
        reading: 'まど'
      },
      {
        word: 'まち',
        romaji: 'machi',
        meaning: 'town',
        reading: 'まち'
      }
    ]
  },
  {
    id: 'mi',
    character: 'み',
    romaji: 'mi',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a mini three-pronged fork',
    examples: [
      {
        word: 'みず',
        romaji: 'mizu',
        meaning: 'water',
        reading: 'みず'
      },
      {
        word: 'みみ',
        romaji: 'mimi',
        meaning: 'ear',
        reading: 'みみ'
      }
    ]
  },
  {
    id: 'mu',
    character: 'む',
    romaji: 'mu',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a cow\'s muzzle',
    examples: [
      {
        word: 'むし',
        romaji: 'mushi',
        meaning: 'insect',
        reading: 'むし'
      },
      {
        word: 'むら',
        romaji: 'mura',
        meaning: 'village',
        reading: 'むら'
      }
    ]
  },
  {
    id: 'me',
    character: 'め',
    romaji: 'me',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like an eye (me means eye in Japanese)',
    examples: [
      {
        word: 'め',
        romaji: 'me',
        meaning: 'eye',
        reading: 'め'
      },
      {
        word: 'めがね',
        romaji: 'megane',
        meaning: 'glasses',
        reading: 'めがね'
      }
    ]
  },
  {
    id: 'mo',
    character: 'も',
    romaji: 'mo',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a mole coming out of the ground',
    examples: [
      {
        word: 'もの',
        romaji: 'mono',
        meaning: 'thing',
        reading: 'もの'
      },
      {
        word: 'もり',
        romaji: 'mori',
        meaning: 'forest',
        reading: 'もり'
      }
    ]
  },

  // Y-row
  {
    id: 'ya',
    character: 'や',
    romaji: 'ya',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a yacht with a sail',
    examples: [
      {
        word: 'やま',
        romaji: 'yama',
        meaning: 'mountain',
        reading: 'やま'
      },
      {
        word: 'やさい',
        romaji: 'yasai',
        meaning: 'vegetable',
        reading: 'やさい'
      }
    ]
  },
  {
    id: 'yu',
    character: 'ゆ',
    romaji: 'yu',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a hook for your yukata',
    examples: [
      {
        word: 'ゆき',
        romaji: 'yuki',
        meaning: 'snow',
        reading: 'ゆき'
      },
      {
        word: 'ゆび',
        romaji: 'yubi',
        meaning: 'finger',
        reading: 'ゆび'
      }
    ]
  },
  {
    id: 'yo',
    character: 'よ',
    romaji: 'yo',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like someone doing yoga',
    examples: [
      {
        word: 'よる',
        romaji: 'yoru',
        meaning: 'night',
        reading: 'よる'
      },
      {
        word: 'よん',
        romaji: 'yon',
        meaning: 'four',
        reading: 'よん'
      }
    ]
  },

  // R-row
  {
    id: 'ra',
    character: 'ら',
    romaji: 'ra',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a rabbit\'s face',
    examples: [
      {
        word: 'らいねん',
        romaji: 'rainen',
        meaning: 'next year',
        reading: 'らいねん'
      },
      {
        word: 'らく',
        romaji: 'raku',
        meaning: 'comfortable',
        reading: 'らく'
      }
    ]
  },
  {
    id: 'ri',
    character: 'り',
    romaji: 'ri',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a ribbon',
    examples: [
      {
        word: 'りんご',
        romaji: 'ringo',
        meaning: 'apple',
        reading: 'りんご'
      },
      {
        word: 'りょうり',
        romaji: 'ryouri',
        meaning: 'cooking',
        reading: 'りょうり'
      }
    ]
  },
  {
    id: 'ru',
    character: 'る',
    romaji: 'ru',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a loop (a hoop you run through)',
    examples: [
      {
        word: 'るす',
        romaji: 'rusu',
        meaning: 'absence',
        reading: 'るす'
      },
      {
        word: 'かえる',
        romaji: 'kaeru',
        meaning: 'to return',
        reading: 'かえる'
      }
    ]
  },
  {
    id: 're',
    character: 'れ',
    romaji: 're',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a ray of light',
    examples: [
      {
        word: 'れきし',
        romaji: 'rekishi',
        meaning: 'history',
        reading: 'れきし'
      },
      {
        word: 'れもん',
        romaji: 'remon',
        meaning: 'lemon',
        reading: 'れもん'
      }
    ]
  },
  {
    id: 'ro',
    character: 'ろ',
    romaji: 'ro',
    type: 'hiragana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a road',
    examples: [
      {
        word: 'ろく',
        romaji: 'roku',
        meaning: 'six',
        reading: 'ろく'
      },
      {
        word: 'いろ',
        romaji: 'iro',
        meaning: 'color',
        reading: 'いろ'
      }
    ]
  },

  // W-row
  {
    id: 'wa',
    character: 'わ',
    romaji: 'wa',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a wasp',
    examples: [
      {
        word: 'わたし',
        romaji: 'watashi',
        meaning: 'I/me',
        reading: 'わたし'
      },
      {
        word: 'わらう',
        romaji: 'warau',
        meaning: 'to laugh',
        reading: 'わらう'
      }
    ]
  },
  {
    id: 'wo',
    character: 'を',
    romaji: 'wo',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a witch on a broomstick',
    examples: [
      {
        word: 'ほんを',
        romaji: 'hon wo',
        meaning: 'book (object marker)',
        reading: 'ほんを'
      },
      {
        word: 'みずを',
        romaji: 'mizu wo',
        meaning: 'water (object marker)',
        reading: 'みずを'
      }
    ]
  },

  // N
  {
    id: 'n',
    character: 'ん',
    romaji: 'n',
    type: 'hiragana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like the letter n',
    examples: [
      {
        word: 'でんわ',
        romaji: 'denwa',
        meaning: 'telephone',
        reading: 'でんわ'
      },
      {
        word: 'ほん',
        romaji: 'hon',
        meaning: 'book',
        reading: 'ほん'
      }
    ]
  },

  // B-row (Variations of H-row with dakuten)
  {
    id: 'ba',
    character: 'ば',
    romaji: 'ba',
    type: 'hiragana',
    stroke_count: 6,
    stroke_order: ['1', '2', '3', '4', '5', '6'],
    mnemonic: 'は (ha) with two dots becomes ば (ba)',
    examples: [
      {
        word: 'ばか',
        romaji: 'baka',
        meaning: 'fool',
        reading: 'ばか'
      },
      {
        word: 'ばなな',
        romaji: 'banana',
        meaning: 'banana',
        reading: 'ばなな'
      }
    ]
  },
  {
    id: 'bi',
    character: 'び',
    romaji: 'bi',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'ひ (hi) with two dots becomes び (bi)',
    examples: [
      {
        word: 'びん',
        romaji: 'bin',
        meaning: 'bottle',
        reading: 'びん'
      },
      {
        word: 'えんぴつ',
        romaji: 'enpitsu',
        meaning: 'pencil',
        reading: 'えんぴつ'
      }
    ]
  },
  {
    id: 'bu',
    character: 'ぶ',
    romaji: 'bu',
    type: 'hiragana',
    stroke_count: 6,
    stroke_order: ['1', '2', '3', '4', '5', '6'],
    mnemonic: 'ふ (fu) with two dots becomes ぶ (bu)',
    examples: [
      {
        word: 'ぶた',
        romaji: 'buta',
        meaning: 'pig',
        reading: 'ぶた'
      },
      {
        word: 'ぶどう',
        romaji: 'budou',
        meaning: 'grape',
        reading: 'ぶどう'
      }
    ]
  },
  {
    id: 'be',
    character: 'べ',
    romaji: 'be',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'へ (he) with two dots becomes べ (be)',
    examples: [
      {
        word: 'べんきょう',
        romaji: 'benkyou',
        meaning: 'study',
        reading: 'べんきょう'
      },
      {
        word: 'へや',
        romaji: 'heya',
        meaning: 'room',
        reading: 'へや'
      }
    ]
  },
  {
    id: 'bo',
    character: 'ぼ',
    romaji: 'bo',
    type: 'hiragana',
    stroke_count: 6,
    stroke_order: ['1', '2', '3', '4', '5', '6'],
    mnemonic: 'ほ (ho) with two dots becomes ぼ (bo)',
    examples: [
      {
        word: 'ぼく',
        romaji: 'boku',
        meaning: 'I (male)',
        reading: 'ぼく'
      },
      {
        word: 'ぼうし',
        romaji: 'boushi',
        meaning: 'hat',
        reading: 'ぼうし'
      }
    ]
  },

  // D-row (Variations of T-row with dakuten)
  {
    id: 'da',
    character: 'だ',
    romaji: 'da',
    type: 'hiragana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'た (ta) with two dots becomes だ (da)',
    examples: [
      {
        word: 'だいがく',
        romaji: 'daigaku',
        meaning: 'university',
        reading: 'だいがく'
      },
      {
        word: 'だれ',
        romaji: 'dare',
        meaning: 'who',
        reading: 'だれ'
      }
    ]
  },
  {
    id: 'di',
    character: 'ぢ',
    romaji: 'di',
    type: 'hiragana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ち (chi) with two dots becomes ぢ (di)',
    examples: [
      {
        word: 'ぢしん',
        romaji: 'dishin',
        meaning: 'earthquake',
        reading: 'ぢしん'
      },
      {
        word: 'はなぢ',
        romaji: 'hanadi',
        meaning: 'nosebleed',
        reading: 'はなぢ'
      }
    ]
  },
  {
    id: 'du',
    character: 'づ',
    romaji: 'du',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'つ (tsu) with two dots becomes づ (du)',
    examples: [
      {
        word: 'つづく',
        romaji: 'tsuzuku',
        meaning: 'to continue',
        reading: 'つづく'
      },
      {
        word: 'みかづき',
        romaji: 'mikazuki',
        meaning: 'crescent moon',
        reading: 'みかづき'
      }
    ]
  },
  {
    id: 'de',
    character: 'で',
    romaji: 'de',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'て (te) with two dots becomes で (de)',
    examples: [
      {
        word: 'でんわ',
        romaji: 'denwa',
        meaning: 'telephone',
        reading: 'でんわ'
      },
      {
        word: 'でも',
        romaji: 'demo',
        meaning: 'but',
        reading: 'でも'
      }
    ]
  },
  {
    id: 'do',
    character: 'ど',
    romaji: 'do',
    type: 'hiragana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'と (to) with two dots becomes ど (do)',
    examples: [
      {
        word: 'どこ',
        romaji: 'doko',
        meaning: 'where',
        reading: 'どこ'
      },
      {
        word: 'どれ',
        romaji: 'dore',
        meaning: 'which one',
        reading: 'どれ'
      }
    ]
  },

  // G-row (Variations of K-row with dakuten)
  {
    id: 'ga',
    character: 'が',
    romaji: 'ga',
    type: 'hiragana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'か (ka) with two dots becomes が (ga)',
    examples: [
      {
        word: 'がっこう',
        romaji: 'gakkou',
        meaning: 'school',
        reading: 'がっこう'
      },
      {
        word: 'がまん',
        romaji: 'gaman',
        meaning: 'patience',
        reading: 'がまん'
      }
    ]
  },
  {
    id: 'gi',
    character: 'ぎ',
    romaji: 'gi',
    type: 'hiragana',
    stroke_count: 6,
    stroke_order: ['1', '2', '3', '4', '5', '6'],
    mnemonic: 'き (ki) with two dots becomes ぎ (gi)',
    examples: [
      {
        word: 'ぎん',
        romaji: 'gin',
        meaning: 'silver',
        reading: 'ぎん'
      },
      {
        word: 'ぎゅうにゅう',
        romaji: 'gyuunyuu',
        meaning: 'milk',
        reading: 'ぎゅうにゅう'
      }
    ]
  },
  {
    id: 'gu',
    character: 'ぐ',
    romaji: 'gu',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'く (ku) with two dots becomes ぐ (gu)',
    examples: [
      {
        word: 'ぐち',
        romaji: 'guchi',
        meaning: 'complaint',
        reading: 'ぐち'
      },
      {
        word: 'さぐる',
        romaji: 'saguru',
        meaning: 'to search',
        reading: 'さぐる'
      }
    ]
  },
  {
    id: 'ge',
    character: 'げ',
    romaji: 'ge',
    type: 'hiragana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'け (ke) with two dots becomes げ (ge)',
    examples: [
      {
        word: 'げんき',
        romaji: 'genki',
        meaning: 'healthy/energetic',
        reading: 'げんき'
      },
      {
        word: 'げつようび',
        romaji: 'getsuyoubi',
        meaning: 'Monday',
        reading: 'げつようび'
      }
    ]
  },
  {
    id: 'go',
    character: 'ご',
    romaji: 'go',
    type: 'hiragana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'こ (ko) with two dots becomes ご (go)',
    examples: [
      {
        word: 'ごはん',
        romaji: 'gohan',
        meaning: 'rice/meal',
        reading: 'ごはん'
      },
      {
        word: 'ごご',
        romaji: 'gogo',
        meaning: 'afternoon',
        reading: 'ごご'
      }
    ]
  },

  // Z-row (Variations of S-row with dakuten)
  {
    id: 'za',
    character: 'ざ',
    romaji: 'za',
    type: 'hiragana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'さ (sa) with two dots becomes ざ (za)',
    examples: [
      {
        word: 'ざっし',
        romaji: 'zasshi',
        meaning: 'magazine',
        reading: 'ざっし'
      },
      {
        word: 'ざぶとん',
        romaji: 'zabuton',
        meaning: 'sitting cushion',
        reading: 'ざぶとん'
      }
    ]
  },
  {
    id: 'ji',
    character: 'じ',
    romaji: 'ji',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'し (shi) with two dots becomes じ (ji)',
    examples: [
      {
        word: 'じかん',
        romaji: 'jikan',
        meaning: 'time',
        reading: 'じかん'
      },
      {
        word: 'じぶん',
        romaji: 'jibun',
        meaning: 'self',
        reading: 'じぶん'
      }
    ]
  },
  {
    id: 'zu',
    character: 'ず',
    romaji: 'zu',
    type: 'hiragana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'す (su) with two dots becomes ず (zu)',
    examples: [
      {
        word: 'ずっと',
        romaji: 'zutto',
        meaning: 'always',
        reading: 'ずっと'
      },
      {
        word: 'えんぴつ',
        romaji: 'enpitsu',
        meaning: 'pencil',
        reading: 'えんぴつ'
      }
    ]
  },
  {
    id: 'ze',
    character: 'ぜ',
    romaji: 'ze',
    type: 'hiragana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'せ (se) with two dots becomes ぜ (ze)',
    examples: [
      {
        word: 'ぜんぶ',
        romaji: 'zenbu',
        meaning: 'all',
        reading: 'ぜんぶ'
      },
      {
        word: 'ぜんぜん',
        romaji: 'zenzen',
        meaning: 'not at all',
        reading: 'ぜんぜん'
      }
    ]
  },
  {
    id: 'zo',
    character: 'ぞ',
    romaji: 'zo',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'そ (so) with two dots becomes ぞ (zo)',
    examples: [
      {
        word: 'ぞう',
        romaji: 'zou',
        meaning: 'elephant',
        reading: 'ぞう'
      },
      {
        word: 'ぞくご',
        romaji: 'zokugo',
        meaning: 'slang',
        reading: 'ぞくご'
      }
    ]
  },

  // P-row (Variations of H-row with circle)
  {
    id: 'pa',
    character: 'ぱ',
    romaji: 'pa',
    type: 'hiragana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'は (ha) with a circle becomes ぱ (pa)',
    examples: [
      {
        word: 'ぱん',
        romaji: 'pan',
        meaning: 'bread',
        reading: 'ぱん'
      },
      {
        word: 'ぱらぱら',
        romaji: 'parapara',
        meaning: 'scattered',
        reading: 'ぱらぱら'
      }
    ]
  },
  {
    id: 'pi',
    character: 'ぴ',
    romaji: 'pi',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'ひ (hi) with a circle becomes ぴ (pi)',
    examples: [
      {
        word: 'ぴんと',
        romaji: 'pinto',
        meaning: 'taut',
        reading: 'ぴんと'
      },
      {
        word: 'ぴかぴか',
        romaji: 'pikapika',
        meaning: 'shiny',
        reading: 'ぴかぴか'
      }
    ]
  },
  {
    id: 'pu',
    character: 'ぷ',
    romaji: 'pu',
    type: 'hiragana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'ふ (fu) with a circle becomes ぷ (pu)',
    examples: [
      {
        word: 'ぷれぜんと',
        romaji: 'purezento',
        meaning: 'present/gift',
        reading: 'ぷれぜんと'
      },
      {
        word: 'ぷりん',
        romaji: 'purin',
        meaning: 'pudding',
        reading: 'ぷりん'
      }
    ]
  },
  {
    id: 'pe',
    character: 'ぺ',
    romaji: 'pe',
    type: 'hiragana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'へ (he) with a circle becomes ぺ (pe)',
    examples: [
      {
        word: 'ぺん',
        romaji: 'pen',
        meaning: 'pen',
        reading: 'ぺん'
      },
      {
        word: 'ぺこぺこ',
        romaji: 'pekopeko',
        meaning: 'hungry',
        reading: 'ぺこぺこ'
      }
    ]
  },
  {
    id: 'po',
    character: 'ぽ',
    romaji: 'po',
    type: 'hiragana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'ほ (ho) with a circle becomes ぽ (po)',
    examples: [
      {
        word: 'ぽけっと',
        romaji: 'poketto',
        meaning: 'pocket',
        reading: 'ぽけっと'
      },
      {
        word: 'ぽんず',
        romaji: 'ponzu',
        meaning: 'ponzu sauce',
        reading: 'ぽんず'
      }
    ]
  }
];

// Complete katakana character set
const katakanaCharacters: KanaCharacter[] = [
  // Basic vowels
  {
    id: 'katakana-a',
    character: 'ア',
    romaji: 'a',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like an axe',
    examples: [
      {
        word: 'アメリカ',
        romaji: 'amerika',
        meaning: 'America',
        reading: 'アメリカ'
      },
      {
        word: 'アニメ',
        romaji: 'anime',
        meaning: 'animation',
        reading: 'アニメ'
      }
    ]
  },
  {
    id: 'katakana-i',
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
        reading: 'イギリス'
      },
      {
        word: 'イチゴ',
        romaji: 'ichigo',
        meaning: 'strawberry',
        reading: 'イチゴ'
      }
    ]
  },
  {
    id: 'katakana-u',
    character: 'ウ',
    romaji: 'u',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a person doing yoga',
    examples: [
      {
        word: 'ウサギ',
        romaji: 'usagi',
        meaning: 'rabbit',
        reading: 'ウサギ'
      },
      {
        word: 'ウソ',
        romaji: 'uso',
        meaning: 'lie',
        reading: 'ウソ'
      }
    ]
  },
  {
    id: 'katakana-e',
    character: 'エ',
    romaji: 'e',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like the letter F facing backward',
    examples: [
      {
        word: 'エレベーター',
        romaji: 'erebētā',
        meaning: 'elevator',
        reading: 'エレベーター'
      },
      {
        word: 'エビ',
        romaji: 'ebi',
        meaning: 'shrimp',
        reading: 'エビ'
      }
    ]
  },
  {
    id: 'katakana-o',
    character: 'オ',
    romaji: 'o',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a slanted number 7',
    examples: [
      {
        word: 'オレンジ',
        romaji: 'orenji',
        meaning: 'orange',
        reading: 'オレンジ'
      },
      {
        word: 'オス',
        romaji: 'osu',
        meaning: 'male',
        reading: 'オス'
      }
    ]
  },
  
  // K-row
  {
    id: 'katakana-ka',
    character: 'カ',
    romaji: 'ka',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like the letter K',
    examples: [
      {
        word: 'カメラ',
        romaji: 'kamera',
        meaning: 'camera',
        reading: 'カメラ'
      },
      {
        word: 'カレー',
        romaji: 'karē',
        meaning: 'curry',
        reading: 'カレー'
      }
    ]
  },
  {
    id: 'katakana-ki',
    character: 'キ',
    romaji: 'ki',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a key',
    examples: [
      {
        word: 'キーボード',
        romaji: 'kībōdo',
        meaning: 'keyboard',
        reading: 'キーボード'
      },
      {
        word: 'キス',
        romaji: 'kisu',
        meaning: 'kiss',
        reading: 'キス'
      }
    ]
  },
  {
    id: 'katakana-ku',
    character: 'ク',
    romaji: 'ku',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a corner (kūna)',
    examples: [
      {
        word: 'クッキー',
        romaji: 'kukkī',
        meaning: 'cookie',
        reading: 'クッキー'
      },
      {
        word: 'クラス',
        romaji: 'kurasu',
        meaning: 'class',
        reading: 'クラス'
      }
    ]
  },
  {
    id: 'katakana-ke',
    character: 'ケ',
    romaji: 'ke',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a keg on its side',
    examples: [
      {
        word: 'ケーキ',
        romaji: 'kēki',
        meaning: 'cake',
        reading: 'ケーキ'
      },
      {
        word: 'ケース',
        romaji: 'kēsu',
        meaning: 'case',
        reading: 'ケース'
      }
    ]
  },
  {
    id: 'katakana-ko',
    character: 'コ',
    romaji: 'ko',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like an angle bracket',
    examples: [
      {
        word: 'コーヒー',
        romaji: 'kōhī',
        meaning: 'coffee',
        reading: 'コーヒー'
      },
      {
        word: 'コップ',
        romaji: 'koppu',
        meaning: 'cup',
        reading: 'コップ'
      }
    ]
  },
  
  // S-row
  {
    id: 'katakana-sa',
    character: 'サ',
    romaji: 'sa',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a sideways S',
    examples: [
      {
        word: 'サラダ',
        romaji: 'sarada',
        meaning: 'salad',
        reading: 'サラダ'
      },
      {
        word: 'サンダル',
        romaji: 'sandaru',
        meaning: 'sandal',
        reading: 'サンダル'
      }
    ]
  },
  {
    id: 'katakana-shi',
    character: 'シ',
    romaji: 'shi',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a smiling face (smile)',
    examples: [
      {
        word: 'シャツ',
        romaji: 'shatsu',
        meaning: 'shirt',
        reading: 'シャツ'
      },
      {
        word: 'シェア',
        romaji: 'shea',
        meaning: 'share',
        reading: 'シェア'
      }
    ]
  },
  {
    id: 'katakana-su',
    character: 'ス',
    romaji: 'su',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a noose (hang)',
    examples: [
      {
        word: 'スープ',
        romaji: 'sūpu',
        meaning: 'soup',
        reading: 'スープ'
      },
      {
        word: 'スカート',
        romaji: 'sukāto',
        meaning: 'skirt',
        reading: 'スカート'
      }
    ]
  },
  {
    id: 'katakana-se',
    character: 'セ',
    romaji: 'se',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a c with a line',
    examples: [
      {
        word: 'セーター',
        romaji: 'sētā',
        meaning: 'sweater',
        reading: 'セーター'
      },
      {
        word: 'センター',
        romaji: 'sentā',
        meaning: 'center',
        reading: 'センター'
      }
    ]
  },
  {
    id: 'katakana-so',
    character: 'ソ',
    romaji: 'so',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a skier going down a slope',
    examples: [
      {
        word: 'ソファ',
        romaji: 'sofa',
        meaning: 'sofa',
        reading: 'ソファ'
      },
      {
        word: 'ソース',
        romaji: 'sōsu',
        meaning: 'sauce',
        reading: 'ソース'
      }
    ]
  },
  
  // T-row
  {
    id: 'katakana-ta',
    character: 'タ',
    romaji: 'ta',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a tie hanging',
    examples: [
      {
        word: 'タクシー',
        romaji: 'takushī',
        meaning: 'taxi',
        reading: 'タクシー'
      },
      {
        word: 'タオル',
        romaji: 'taoru',
        meaning: 'towel',
        reading: 'タオル'
      }
    ]
  },
  {
    id: 'katakana-chi',
    character: 'チ',
    romaji: 'chi',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a check mark',
    examples: [
      {
        word: 'チーズ',
        romaji: 'chīzu',
        meaning: 'cheese',
        reading: 'チーズ'
      },
      {
        word: 'チケット',
        romaji: 'chiketto',
        meaning: 'ticket',
        reading: 'チケット'
      }
    ]
  },
  {
    id: 'katakana-tsu',
    character: 'ツ',
    romaji: 'tsu',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a smiley face with the mouth going "tsu"',
    examples: [
      {
        word: 'ツアー',
        romaji: 'tsuā',
        meaning: 'tour',
        reading: 'ツアー'
      },
      {
        word: 'バケツ',
        romaji: 'baketsu',
        meaning: 'bucket',
        reading: 'バケツ'
      }
    ]
  },
  {
    id: 'katakana-te',
    character: 'テ',
    romaji: 'te',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a TV antenna',
    examples: [
      {
        word: 'テーブル',
        romaji: 'tēburu',
        meaning: 'table',
        reading: 'テーブル'
      },
      {
        word: 'テスト',
        romaji: 'tesuto',
        meaning: 'test',
        reading: 'テスト'
      }
    ]
  },
  {
    id: 'katakana-to',
    character: 'ト',
    romaji: 'to',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a toll booth',
    examples: [
      {
        word: 'トイレ',
        romaji: 'toire',
        meaning: 'toilet',
        reading: 'トイレ'
      },
      {
        word: 'トマト',
        romaji: 'tomato',
        meaning: 'tomato',
        reading: 'トマト'
      }
    ]
  },
  
  // N-row
  {
    id: 'katakana-na',
    character: 'ナ',
    romaji: 'na',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a number 7',
    examples: [
      {
        word: 'ナイフ',
        romaji: 'naifu',
        meaning: 'knife',
        reading: 'ナイフ'
      },
      {
        word: 'ナス',
        romaji: 'nasu',
        meaning: 'eggplant',
        reading: 'ナス'
      }
    ]
  },
  {
    id: 'katakana-ni',
    character: 'ニ',
    romaji: 'ni',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like the number two (ni means two in Japanese)',
    examples: [
      {
        word: 'ニュース',
        romaji: 'nyūsu',
        meaning: 'news',
        reading: 'ニュース'
      },
      {
        word: 'ニワトリ',
        romaji: 'niwatori',
        meaning: 'chicken',
        reading: 'ニワトリ'
      }
    ]
  },
  {
    id: 'katakana-nu',
    character: 'ヌ',
    romaji: 'nu',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a bent noodle',
    examples: [
      {
        word: 'ヌードル',
        romaji: 'nūdoru',
        meaning: 'noodle',
        reading: 'ヌードル'
      },
      {
        word: 'イヌ',
        romaji: 'inu',
        meaning: 'dog',
        reading: 'イヌ'
      }
    ]
  },
  {
    id: 'katakana-ne',
    character: 'ネ',
    romaji: 'ne',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a snail (its shell is bent)',
    examples: [
      {
        word: 'ネコ',
        romaji: 'neko',
        meaning: 'cat',
        reading: 'ネコ'
      },
      {
        word: 'ネット',
        romaji: 'netto',
        meaning: 'net/internet',
        reading: 'ネット'
      }
    ]
  },
  {
    id: 'katakana-no',
    character: 'ノ',
    romaji: 'no',
    type: 'katakana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a forward slash',
    examples: [
      {
        word: 'ノート',
        romaji: 'nōto',
        meaning: 'notebook',
        reading: 'ノート'
      },
      {
        word: 'ピアノ',
        romaji: 'piano',
        meaning: 'piano',
        reading: 'ピアノ'
      }
    ]
  },
  
  // H-row
  {
    id: 'katakana-ha',
    character: 'ハ',
    romaji: 'ha',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like the letter H upside down',
    examples: [
      {
        word: 'ハンバーガー',
        romaji: 'hanbāgā',
        meaning: 'hamburger',
        reading: 'ハンバーガー'
      },
      {
        word: 'ハワイ',
        romaji: 'hawai',
        meaning: 'Hawaii',
        reading: 'ハワイ'
      }
    ]
  },
  {
    id: 'katakana-hi',
    character: 'ヒ',
    romaji: 'hi',
    type: 'katakana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a person standing (human)',
    examples: [
      {
        word: 'ヒーター',
        romaji: 'hītā',
        meaning: 'heater',
        reading: 'ヒーター'
      },
      {
        word: 'ヒント',
        romaji: 'hinto',
        meaning: 'hint',
        reading: 'ヒント'
      }
    ]
  },
  {
    id: 'katakana-fu',
    character: 'フ',
    romaji: 'fu',
    type: 'katakana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a hook where you can hang things',
    examples: [
      {
        word: 'フォーク',
        romaji: 'fōku',
        meaning: 'fork',
        reading: 'フォーク'
      },
      {
        word: 'フランス',
        romaji: 'furansu',
        meaning: 'France',
        reading: 'フランス'
      }
    ]
  },
  {
    id: 'katakana-he',
    character: 'ヘ',
    romaji: 'he',
    type: 'katakana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like an upside-down hat',
    examples: [
      {
        word: 'ヘア',
        romaji: 'hea',
        meaning: 'hair',
        reading: 'ヘア'
      },
      {
        word: 'ヘビ',
        romaji: 'hebi',
        meaning: 'snake',
        reading: 'ヘビ'
      }
    ]
  },
  {
    id: 'katakana-ho',
    character: 'ホ',
    romaji: 'ho',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a chimney with smoke coming out (home)',
    examples: [
      {
        word: 'ホテル',
        romaji: 'hoteru',
        meaning: 'hotel',
        reading: 'ホテル'
      },
      {
        word: 'ホール',
        romaji: 'hōru',
        meaning: 'hall',
        reading: 'ホール'
      }
    ]
  },
  
  // M-row
  {
    id: 'katakana-ma',
    character: 'マ',
    romaji: 'ma',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a window (mado)',
    examples: [
      {
        word: 'マンゴー',
        romaji: 'mangō',
        meaning: 'mango',
        reading: 'マンゴー'
      },
      {
        word: 'マウス',
        romaji: 'mausu',
        meaning: 'mouse',
        reading: 'マウス'
      }
    ]
  },
  {
    id: 'katakana-mi',
    character: 'ミ',
    romaji: 'mi',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like three scratch marks',
    examples: [
      {
        word: 'ミルク',
        romaji: 'miruku',
        meaning: 'milk',
        reading: 'ミルク'
      },
      {
        word: 'ミス',
        romaji: 'misu',
        meaning: 'miss/mistake',
        reading: 'ミス'
      }
    ]
  },
  {
    id: 'katakana-mu',
    character: 'ム',
    romaji: 'mu',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a cow\'s face saying "moo"',
    examples: [
      {
        word: 'ムード',
        romaji: 'mūdo',
        meaning: 'mood',
        reading: 'ムード'
      },
      {
        word: 'ムシ',
        romaji: 'mushi',
        meaning: 'insect',
        reading: 'ムシ'
      }
    ]
  },
  {
    id: 'katakana-me',
    character: 'メ',
    romaji: 'me',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like an eye (me means eye in Japanese)',
    examples: [
      {
        word: 'メール',
        romaji: 'mēru',
        meaning: 'mail/email',
        reading: 'メール'
      },
      {
        word: 'メニュー',
        romaji: 'menyū',
        meaning: 'menu',
        reading: 'メニュー'
      }
    ]
  },
  {
    id: 'katakana-mo',
    character: 'モ',
    romaji: 'mo',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a monocle',
    examples: [
      {
        word: 'モデル',
        romaji: 'moderu',
        meaning: 'model',
        reading: 'モデル'
      },
      {
        word: 'モンスター',
        romaji: 'monsutā',
        meaning: 'monster',
        reading: 'モンスター'
      }
    ]
  },
  
  // Y-row
  {
    id: 'katakana-ya',
    character: 'ヤ',
    romaji: 'ya',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like the letter Y with a line',
    examples: [
      {
        word: 'ヤキソバ',
        romaji: 'yakisoba',
        meaning: 'fried noodles',
        reading: 'ヤキソバ'
      },
      {
        word: 'ヤマハ',
        romaji: 'yamaha',
        meaning: 'Yamaha',
        reading: 'ヤマハ'
      }
    ]
  },
  {
    id: 'katakana-yu',
    character: 'ユ',
    romaji: 'yu',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a fish hook',
    examples: [
      {
        word: 'ユニコーン',
        romaji: 'yunikōn',
        meaning: 'unicorn',
        reading: 'ユニコーン'
      },
      {
        word: 'ユーザー',
        romaji: 'yūzā',
        meaning: 'user',
        reading: 'ユーザー'
      }
    ]
  },
  {
    id: 'katakana-yo',
    character: 'ヨ',
    romaji: 'yo',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a yo-yo',
    examples: [
      {
        word: 'ヨーロッパ',
        romaji: 'yōroppa',
        meaning: 'Europe',
        reading: 'ヨーロッパ'
      },
      {
        word: 'ヨガ',
        romaji: 'yoga',
        meaning: 'yoga',
        reading: 'ヨガ'
      }
    ]
  },
  
  // R-row
  {
    id: 'katakana-ra',
    character: 'ラ',
    romaji: 'ra',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a lasso',
    examples: [
      {
        word: 'ラーメン',
        romaji: 'rāmen',
        meaning: 'ramen',
        reading: 'ラーメン'
      },
      {
        word: 'ラジオ',
        romaji: 'rajio',
        meaning: 'radio',
        reading: 'ラジオ'
      }
    ]
  },
  {
    id: 'katakana-ri',
    character: 'リ',
    romaji: 'ri',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a ribbon',
    examples: [
      {
        word: 'リンゴ',
        romaji: 'ringo',
        meaning: 'apple',
        reading: 'リンゴ'
      },
      {
        word: 'リボン',
        romaji: 'ribon',
        meaning: 'ribbon',
        reading: 'リボン'
      }
    ]
  },
  {
    id: 'katakana-ru',
    character: 'ル',
    romaji: 'ru',
    type: 'katakana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a loop',
    examples: [
      {
        word: 'ルール',
        romaji: 'rūru',
        meaning: 'rule',
        reading: 'ルール'
      },
      {
        word: 'ホテル',
        romaji: 'hoteru',
        meaning: 'hotel',
        reading: 'ホテル'
      }
    ]
  },
  {
    id: 'katakana-re',
    character: 'レ',
    romaji: 're',
    type: 'katakana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a checkmark',
    examples: [
      {
        word: 'レストラン',
        romaji: 'resutoran',
        meaning: 'restaurant',
        reading: 'レストラン'
      },
      {
        word: 'レモン',
        romaji: 'remon',
        meaning: 'lemon',
        reading: 'レモン'
      }
    ]
  },
  {
    id: 'katakana-ro',
    character: 'ロ',
    romaji: 'ro',
    type: 'katakana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like a square mouth saying "ro"',
    examples: [
      {
        word: 'ロボット',
        romaji: 'robotto',
        meaning: 'robot',
        reading: 'ロボット'
      },
      {
        word: 'ロック',
        romaji: 'rokku',
        meaning: 'rock (music)',
        reading: 'ロック'
      }
    ]
  },
  
  // W-row
  {
    id: 'katakana-wa',
    character: 'ワ',
    romaji: 'wa',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like a water slide',
    examples: [
      {
        word: 'ワイン',
        romaji: 'wain',
        meaning: 'wine',
        reading: 'ワイン'
      },
      {
        word: 'ワンピース',
        romaji: 'wanpīsu',
        meaning: 'one-piece dress',
        reading: 'ワンピース'
      }
    ]
  },
  {
    id: 'katakana-wo',
    character: 'ヲ',
    romaji: 'wo',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a person carrying a load',
    examples: [
      {
        word: 'ヲタク',
        romaji: 'wotaku',
        meaning: 'otaku/nerd',
        reading: 'ヲタク'
      },
      {
        word: 'カメラヲ',
        romaji: 'kamera wo',
        meaning: 'camera (object marker)',
        reading: 'カメラヲ'
      }
    ]
  },
  
  // N
  {
    id: 'katakana-n',
    character: 'ン',
    romaji: 'n',
    type: 'katakana',
    stroke_count: 1,
    stroke_order: ['1'],
    mnemonic: 'Looks like the letter n',
    examples: [
      {
        word: 'パン',
        romaji: 'pan',
        meaning: 'bread',
        reading: 'パン'
      },
      {
        word: 'ペン',
        romaji: 'pen',
        meaning: 'pen',
        reading: 'ペン'
      }
    ]
  },
  
  // Dakuten and Handakuten variations (G-row, Z-row, D-row, B-row, P-row)
  // I'll include a few examples from each group
  
  // G-row (Variations of K-row with dakuten)
  {
    id: 'katakana-ga',
    character: 'ガ',
    romaji: 'ga',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'カ (ka) with two dots becomes ガ (ga)',
    examples: [
      {
        word: 'ガム',
        romaji: 'gamu',
        meaning: 'gum',
        reading: 'ガム'
      },
      {
        word: 'ガレージ',
        romaji: 'garēji',
        meaning: 'garage',
        reading: 'ガレージ'
      }
    ]
  },
  
  // Z-row (Variations of S-row with dakuten)
  {
    id: 'katakana-za',
    character: 'ザ',
    romaji: 'za',
    type: 'katakana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'サ (sa) with two dots becomes ザ (za)',
    examples: [
      {
        word: 'ピザ',
        romaji: 'piza',
        meaning: 'pizza',
        reading: 'ピザ'
      },
      {
        word: 'ザル',
        romaji: 'zaru',
        meaning: 'colander',
        reading: 'ザル'
      }
    ]
  },
  
  // P-row (Variations of H-row with circle)
  {
    id: 'katakana-pa',
    character: 'パ',
    romaji: 'pa',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ハ (ha) with a circle becomes パ (pa)',
    examples: [
      {
        word: 'パン',
        romaji: 'pan',
        meaning: 'bread',
        reading: 'パン'
      },
      {
        word: 'パーティー',
        romaji: 'pātī',
        meaning: 'party',
        reading: 'パーティー'
      }
    ]
  }
];

// Create and export the kanaService
export const kanaService = {
  getAllKana: (): KanaCharacter[] => {
    // Return all kana characters (both hiragana and katakana)
    return [...hiraganaCharacters, ...katakanaCharacters];
  },
  
  getKanaByType: (type: KanaType): KanaCharacter[] => {
    // Return kana filtered by type
    return type === 'hiragana' 
      ? hiraganaCharacters 
      : katakanaCharacters;
  },
  
  getUserKanaProgress: async (userId: string): Promise<UserKanaProgress[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('user_kana_progress')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        throw error;
      }
      
      return data.map((progress: any) => ({
        id: progress.id,
        user_id: progress.user_id,
        character_id: progress.character_id,
        proficiency: progress.proficiency,
        mistake_count: progress.mistake_count,
        total_practice_count: progress.total_practice_count,
        last_practiced: new Date(progress.last_practiced),
        review_due: new Date(progress.review_due)
      }));
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  }
};
