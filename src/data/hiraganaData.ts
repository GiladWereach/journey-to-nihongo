import { KanaCharacter } from '@/types/kana';

// Complete hiragana character set
export const hiraganaCharacters: KanaCharacter[] = [
  {
    id: 'hiragana-a',
    character: 'あ',
    romaji: 'a',
    type: 'hiragana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'Looks like a person with their mouth open saying "a"',
    examples: [
      {
        word: 'あか',
        romaji: 'aka',
        meaning: 'red',
        reading: 'あか'
      },
      {
        word: 'あめ',
        romaji: 'ame',
        meaning: 'rain',
        reading: 'あめ'
      }
    ]
  },
  {
    id: 'hiragana-i',
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
    id: 'hiragana-u',
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
    id: 'hiragana-e',
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
    id: 'hiragana-o',
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
    id: 'hiragana-ka',
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
    id: 'hiragana-ki',
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
    id: 'hiragana-ku',
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
    id: 'hiragana-ke',
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
    id: 'hiragana-ko',
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
    id: 'hiragana-sa',
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
    id: 'hiragana-shi',
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
    id: 'hiragana-su',
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
    id: 'hiragana-se',
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
    id: 'hiragana-so',
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
    id: 'hiragana-ta',
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
    id: 'hiragana-chi',
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
    id: 'hiragana-tsu',
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
    id: 'hiragana-te',
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
    id: 'hiragana-to',
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
    id: 'hiragana-na',
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
    id: 'hiragana-ni',
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
    id: 'hiragana-nu',
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
    id: 'hiragana-ne',
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
    id: 'hiragana-no',
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
    id: 'hiragana-ha',
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
    id: 'hiragana-hi',
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
    id: 'hiragana-fu',
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
    id: 'hiragana-he',
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
    id: 'hiragana-ho',
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
    id: 'hiragana-ma',
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
    id: 'hiragana-mi',
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
    id: 'hiragana-mu',
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
    id: 'hiragana-me',
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
    id: 'hiragana-mo',
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
    id: 'hiragana-ya',
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
    id: 'hiragana-yu',
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
    id: 'hiragana-yo',
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
    id: 'hiragana-ra',
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
    id: 'hiragana-ri',
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
    id: 'hiragana-ru',
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
    id: 'hiragana-re',
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
    id: 'hiragana-ro',
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
    id: 'hiragana-wa',
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
    id: 'hiragana-wo',
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
    id: 'hiragana-n',
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
    id: 'hiragana-ba',
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
    id: 'hiragana-bi',
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
    id: 'hiragana-bu',
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
    id: 'hiragana-be',
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
    id: 'hiragana-bo',
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
