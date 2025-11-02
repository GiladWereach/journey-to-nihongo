import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import WritingPracticeExercise from '@/components/kana/WritingPracticeExercise';
import { characterProgressService } from '@/services/characterProgressService';
import { writingPracticeProgressRedirectClicked, writingPracticePageViewed } from '@/lib/analytics-generated';

// Track writing_practice_page_viewed
writingPracticePageViewed();
// Track writing_practice_progress_redirect_clicked
writingPracticeProgressRedirectClicked();
const WritingPractice = () => {
  const { kanaType } = useParams<{ kanaType: 'hiragana' | 'katakana' }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!kanaType || (kanaType !== 'hiragana' && kanaType !== 'katakana')) {
      toast({
        title: "Error",
        description: "Invalid kana type.",
        variant: "destructive",
      });
      navigate('/progress');
    }
  }, [kanaType, navigate, toast]);

  const handleComplete = () => {
    setIsComplete(true);
  };

  if (!kanaType) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/progress')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Progress
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Writing Practice - {kanaType === 'hiragana' ? 'Hiragana' : 'Katakana'}</CardTitle>
        </CardHeader>
        <CardContent>
          {isComplete ? (
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Congratulations!</h3>
              <p>You have completed the writing practice for {kanaType}.</p>
              <Button onClick={() => navigate('/progress')} className="mt-4">
                Return to Progress
              </Button>
            </div>
          ) : (
            <WritingPracticeExercise
              kanaType={kanaType}
              onComplete={handleComplete}
              kanaList={kanaType === 'hiragana'
                ? [
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
                  { id: 'hiragana:ni', character: 'ni', romaji: 'ni', type: 'hiragana', stroke_count: 3, stroke_order: [], examples: [{ word: '二', reading: 'に', meaning: 'two', romaji: 'ni' }] },
                  { id: 'hiragana:nu', character: 'nu', romaji: 'nu', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '布', reading: 'ぬの', meaning: 'cloth', romaji: 'nuno' }] },
                  { id: 'hiragana:ne', character: 'ne', romaji: 'ne', type: 'hiragana', stroke_count: 2, stroke_order: [], examples: [{ word: '根', reading: 'ね', meaning: 'root', romaji: 'ne' }] },
                  { id: 'hiragana:no', character: 'no', romaji: 'no', type: 'hiragana', stroke_count: 1, stroke_order: [], examples: [{ word: '野', reading: 'の', meaning: 'field', romaji: 'no' }] },
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
                ]
                : [
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
                ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WritingPractice;
