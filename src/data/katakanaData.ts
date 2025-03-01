
import { KanaCharacter } from '@/types/kana';

// Complete katakana character set
export const katakanaCharacters: KanaCharacter[] = [
  {
    id: 'katakana-a',
    character: 'ア',
    romaji: 'a',
    type: 'katakana',
    stroke_count: 2,
    stroke_order: ['1', '2'],
    mnemonic: 'Looks like an "A" with a missing segment',
    examples: [
      {
        word: 'アイス',
        romaji: 'aisu',
        meaning: 'ice cream',
        reading: 'アイス'
      },
      {
        word: 'アメリカ',
        romaji: 'amerika',
        meaning: 'America',
        reading: 'アメリカ'
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
  {
    id: 'katakana-gi',
    character: 'ギ',
    romaji: 'gi',
    type: 'katakana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'キ (ki) with two dots becomes ギ (gi)',
    examples: [
      {
        word: 'ギター',
        romaji: 'gitā',
        meaning: 'guitar',
        reading: 'ギター'
      },
      {
        word: 'ギネス',
        romaji: 'ginesu',
        meaning: 'Guinness',
        reading: 'ギネス'
      }
    ]
  },
  {
    id: 'katakana-gu',
    character: 'グ',
    romaji: 'gu',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'ク (ku) with two dots becomes グ (gu)',
    examples: [
      {
        word: 'グループ',
        romaji: 'gurūpu',
        meaning: 'group',
        reading: 'グループ'
      },
      {
        word: 'グラス',
        romaji: 'gurasu',
        meaning: 'glass',
        reading: 'グラス'
      }
    ]
  },
  {
    id: 'katakana-ge',
    character: 'ゲ',
    romaji: 'ge',
    type: 'katakana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'ケ (ke) with two dots becomes ゲ (ge)',
    examples: [
      {
        word: 'ゲーム',
        romaji: 'gēmu',
        meaning: 'game',
        reading: 'ゲーム'
      },
      {
        word: 'ゲレンデ',
        romaji: 'gerende',
        meaning: 'ski slope',
        reading: 'ゲレンデ'
      }
    ]
  },
  {
    id: 'katakana-go',
    character: 'ゴ',
    romaji: 'go',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'コ (ko) with two dots becomes ゴ (go)',
    examples: [
      {
        word: 'ゴリラ',
        romaji: 'gorira',
        meaning: 'gorilla',
        reading: 'ゴリラ'
      },
      {
        word: 'ゴルフ',
        romaji: 'gorufu',
        meaning: 'golf',
        reading: 'ゴルフ'
      }
    ]
  },
  
  // Z-row (variations of S-row with dakuten)
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
        word: 'ザリガニ',
        romaji: 'zarigani',
        meaning: 'crayfish',
        reading: 'ザリガニ'
      },
      {
        word: 'バザール',
        romaji: 'bazāru',
        meaning: 'bazaar',
        reading: 'バザール'
      }
    ]
  },
  {
    id: 'katakana-ji',
    character: 'ジ',
    romaji: 'ji',
    type: 'katakana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'シ (shi) with two dots becomes ジ (ji)',
    examples: [
      {
        word: 'ジュース',
        romaji: 'jūsu',
        meaning: 'juice',
        reading: 'ジュース'
      },
      {
        word: 'ジーンズ',
        romaji: 'jīnzu',
        meaning: 'jeans',
        reading: 'ジーンズ'
      }
    ]
  },
  {
    id: 'katakana-zu',
    character: 'ズ',
    romaji: 'zu',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ス (su) with two dots becomes ズ (zu)',
    examples: [
      {
        word: 'ブルーズ',
        romaji: 'burūzu',
        meaning: 'blues',
        reading: 'ブルーズ'
      },
      {
        word: 'メガネズ',
        romaji: 'meganēzu',
        meaning: 'mayonnaise',
        reading: 'メガネズ'
      }
    ]
  },
  {
    id: 'katakana-ze',
    character: 'ゼ',
    romaji: 'ze',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'セ (se) with two dots becomes ゼ (ze)',
    examples: [
      {
        word: 'ゼロ',
        romaji: 'zero',
        meaning: 'zero',
        reading: 'ゼロ'
      },
      {
        word: 'ゼリー',
        romaji: 'zerī',
        meaning: 'jelly',
        reading: 'ゼリー'
      }
    ]
  },
  {
    id: 'katakana-zo',
    character: 'ゾ',
    romaji: 'zo',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ソ (so) with two dots becomes ゾ (zo)',
    examples: [
      {
        word: 'ゾウ',
        romaji: 'zō',
        meaning: 'elephant',
        reading: 'ゾウ'
      },
      {
        word: 'ホリゾン',
        romaji: 'horizon',
        meaning: 'horizon',
        reading: 'ホリゾン'
      }
    ]
  },
  
  // D-row (variations of T-row with dakuten)
  {
    id: 'katakana-da',
    character: 'ダ',
    romaji: 'da',
    type: 'katakana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'タ (ta) with two dots becomes ダ (da)',
    examples: [
      {
        word: 'ダンス',
        romaji: 'dansu',
        meaning: 'dance',
        reading: 'ダンス'
      },
      {
        word: 'ダイヤ',
        romaji: 'daiya',
        meaning: 'diamond',
        reading: 'ダイヤ'
      }
    ]
  },
  {
    id: 'katakana-ji2',
    character: 'ヂ',
    romaji: 'ji',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'チ (chi) with two dots becomes ヂ (ji) - alternate form of ジ',
    examples: [
      {
        word: 'カヂ',
        romaji: 'kaji',
        meaning: 'fire',
        reading: 'カヂ'
      },
      {
        word: 'ヂョウ',
        romaji: 'jō',
        meaning: 'lock',
        reading: 'ヂョウ'
      }
    ]
  },
  {
    id: 'katakana-zu2',
    character: 'ヅ',
    romaji: 'zu',
    type: 'katakana',
    stroke_count: 5,
    stroke_order: ['1', '2', '3', '4', '5'],
    mnemonic: 'ツ (tsu) with two dots becomes ヅ (zu) - alternate form of ズ',
    examples: [
      {
        word: 'ツヅキ',
        romaji: 'tsuzuki',
        meaning: 'continuation',
        reading: 'ツヅキ'
      },
      {
        word: 'ミヅ',
        romaji: 'mizu',
        meaning: 'water (old form)',
        reading: 'ミヅ'
      }
    ]
  },
  {
    id: 'katakana-de',
    character: 'デ',
    romaji: 'de',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'テ (te) with two dots becomes デ (de)',
    examples: [
      {
        word: 'デザイン',
        romaji: 'dezain',
        meaning: 'design',
        reading: 'デザイン'
      },
      {
        word: 'デート',
        romaji: 'dēto',
        meaning: 'date',
        reading: 'デート'
      }
    ]
  },
  {
    id: 'katakana-do',
    character: 'ド',
    romaji: 'do',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ト (to) with two dots becomes ド (do)',
    examples: [
      {
        word: 'ドア',
        romaji: 'doa',
        meaning: 'door',
        reading: 'ドア'
      },
      {
        word: 'ドラマ',
        romaji: 'dorama',
        meaning: 'drama',
        reading: 'ドラマ'
      }
    ]
  },
  
  // B-row (variations of H-row with dakuten)
  {
    id: 'katakana-ba',
    character: 'バ',
    romaji: 'ba',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ハ (ha) with two dots becomes バ (ba)',
    examples: [
      {
        word: 'バス',
        romaji: 'basu',
        meaning: 'bus',
        reading: 'バス'
      },
      {
        word: 'バナナ',
        romaji: 'banana',
        meaning: 'banana',
        reading: 'バナナ'
      }
    ]
  },
  {
    id: 'katakana-bi',
    character: 'ビ',
    romaji: 'bi',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'ヒ (hi) with two dots becomes ビ (bi)',
    examples: [
      {
        word: 'ビール',
        romaji: 'bīru',
        meaning: 'beer',
        reading: 'ビール'
      },
      {
        word: 'ビル',
        romaji: 'biru',
        meaning: 'building',
        reading: 'ビル'
      }
    ]
  },
  {
    id: 'katakana-bu',
    character: 'ブ',
    romaji: 'bu',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'フ (fu) with two dots becomes ブ (bu)',
    examples: [
      {
        word: 'ブドウ',
        romaji: 'budō',
        meaning: 'grapes',
        reading: 'ブドウ'
      },
      {
        word: 'ブログ',
        romaji: 'burogu',
        meaning: 'blog',
        reading: 'ブログ'
      }
    ]
  },
  {
    id: 'katakana-be',
    character: 'ベ',
    romaji: 'be',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'ヘ (he) with two dots becomes ベ (be)',
    examples: [
      {
        word: 'ベッド',
        romaji: 'beddo',
        meaning: 'bed',
        reading: 'ベッド'
      },
      {
        word: 'ベル',
        romaji: 'beru',
        meaning: 'bell',
        reading: 'ベル'
      }
    ]
  },
  {
    id: 'katakana-bo',
    character: 'ボ',
    romaji: 'bo',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ホ (ho) with two dots becomes ボ (bo)',
    examples: [
      {
        word: 'ボール',
        romaji: 'bōru',
        meaning: 'ball',
        reading: 'ボール'
      },
      {
        word: 'ボタン',
        romaji: 'botan',
        meaning: 'button',
        reading: 'ボタン'
      }
    ]
  },
  
  // P-row (variations of H-row with circle)
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
        word: 'パスタ',
        romaji: 'pasuta',
        meaning: 'pasta',
        reading: 'パスタ'
      }
    ]
  },
  {
    id: 'katakana-pi',
    character: 'ピ',
    romaji: 'pi',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'ヒ (hi) with a circle becomes ピ (pi)',
    examples: [
      {
        word: 'ピザ',
        romaji: 'piza',
        meaning: 'pizza',
        reading: 'ピザ'
      },
      {
        word: 'ピンク',
        romaji: 'pinku',
        meaning: 'pink',
        reading: 'ピンク'
      }
    ]
  },
  {
    id: 'katakana-pu',
    character: 'プ',
    romaji: 'pu',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'フ (fu) with a circle becomes プ (pu)',
    examples: [
      {
        word: 'プール',
        romaji: 'pūru',
        meaning: 'pool',
        reading: 'プール'
      },
      {
        word: 'プレゼント',
        romaji: 'purezento',
        meaning: 'present',
        reading: 'プレゼント'
      }
    ]
  },
  {
    id: 'katakana-pe',
    character: 'ペ',
    romaji: 'pe',
    type: 'katakana',
    stroke_count: 3,
    stroke_order: ['1', '2', '3'],
    mnemonic: 'ヘ (he) with a circle becomes ペ (pe)',
    examples: [
      {
        word: 'ペン',
        romaji: 'pen',
        meaning: 'pen',
        reading: 'ペン'
      },
      {
        word: 'ペット',
        romaji: 'petto',
        meaning: 'pet',
        reading: 'ペット'
      }
    ]
  },
  {
    id: 'katakana-po',
    character: 'ポ',
    romaji: 'po',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ホ (ho) with a circle becomes ポ (po)',
    examples: [
      {
        word: 'ポケット',
        romaji: 'poketto',
        meaning: 'pocket',
        reading: 'ポケット'
      },
      {
        word: 'ポスト',
        romaji: 'posuto',
        meaning: 'post/mail',
        reading: 'ポスト'
      }
    ]
  },
  
  // V-row (uses the ウ with dakuten)
  {
    id: 'katakana-va',
    character: 'ヴァ',
    romaji: 'va',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ウ (u) with two dots and small ア becomes ヴァ (va)',
    examples: [
      {
        word: 'ヴァイオリン',
        romaji: 'vaiorin',
        meaning: 'violin',
        reading: 'ヴァイオリン'
      },
      {
        word: 'ヴァニラ',
        romaji: 'vanira',
        meaning: 'vanilla',
        reading: 'ヴァニラ'
      }
    ]
  },
  {
    id: 'katakana-vi',
    character: 'ヴィ',
    romaji: 'vi',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ウ (u) with two dots and small イ becomes ヴィ (vi)',
    examples: [
      {
        word: 'ヴィザ',
        romaji: 'viza',
        meaning: 'visa',
        reading: 'ヴィザ'
      },
      {
        word: 'ヴィデオ',
        romaji: 'video',
        meaning: 'video',
        reading: 'ヴィデオ'
      }
    ]
  },
  {
    id: 'katakana-vu',
    character: 'ヴ',
    romaji: 'vu',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ウ (u) with two dots becomes ヴ (vu)',
    examples: [
      {
        word: 'ヴルカン',
        romaji: 'vurukan',
        meaning: 'vulcan',
        reading: 'ヴルカン'
      },
      {
        word: 'デジャヴ',
        romaji: 'dejavu',
        meaning: 'déjà vu',
        reading: 'デジャヴ'
      }
    ]
  },
  {
    id: 'katakana-ve',
    character: 'ヴェ',
    romaji: 've',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ウ (u) with two dots and small エ becomes ヴェ (ve)',
    examples: [
      {
        word: 'ヴェニス',
        romaji: 'venisu',
        meaning: 'Venice',
        reading: 'ヴェニス'
      },
      {
        word: 'ヴェール',
        romaji: 'vēru',
        meaning: 'veil',
        reading: 'ヴェール'
      }
    ]
  },
  {
    id: 'katakana-vo',
    character: 'ヴォ',
    romaji: 'vo',
    type: 'katakana',
    stroke_count: 4,
    stroke_order: ['1', '2', '3', '4'],
    mnemonic: 'ウ (u) with two dots and small オ becomes ヴォ (vo)',
    examples: [
      {
        word: 'ヴォルト',
        romaji: 'voruto',
        meaning: 'volt',
        reading: 'ヴォルト'
      },
      {
        word: 'ヴォイス',
        romaji: 'voisu',
        meaning: 'voice',
        reading: 'ヴォイス'
      }
    ]
  },
  
  // J-row (uses the Ya-row with modified sounds)
  {
    id: 'katakana-ja',
    character: 'ジャ',
    romaji: 'ja',
    type: 'katakana',
    stroke_count: 6,
    stroke_order: ['1', '2', '3', '4', '5', '6'],
    mnemonic: 'ジ (ji) with small ャ becomes ジャ (ja)',
    examples: [
      {
        word: 'ジャズ',
        romaji: 'jazu',
        meaning: 'jazz',
        reading: 'ジャズ'
      },
      {
        word: 'ジャケット',
        romaji: 'jaketto',
        meaning: 'jacket',
        reading: 'ジャケット'
      }
    ]
  },
  {
    id: 'katakana-ju',
    character: 'ジュ',
    romaji: 'ju',
    type: 'katakana',
    stroke_count: 6,
    stroke_order: ['1', '2', '3', '4', '5', '6'],
    mnemonic: 'ジ (ji) with small ュ becomes ジュ (ju)',
    examples: [
      {
        word: 'ジュース',
        romaji: 'jūsu',
        meaning: 'juice',
        reading: 'ジュース'
      },
      {
        word: 'ジュニア',
        romaji: 'junia',
        meaning: 'junior',
        reading: 'ジュニア'
      }
    ]
  },
  {
    id: 'katakana-jo',
    character: 'ジョ',
    romaji: 'jo',
    type: 'katakana',
    stroke_count: 6,
    stroke_order: ['1', '2', '3', '4', '5', '6'],
    mnemonic: 'ジ (ji) with small ョ becomes ジョ (jo)',
    examples: [
      {
        word: 'ジョギング',
        romaji: 'jogingu',
        meaning: 'jogging',
        reading: 'ジョギング'
      },
      {
        word: 'ジョーク',
        romaji: 'jōku',
        meaning: 'joke',
        reading: 'ジョーク'
      }
    ]
  }
];
