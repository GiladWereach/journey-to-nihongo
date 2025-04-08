
import React from 'react';
import { BookOpen } from 'lucide-react';
import LearningPathCard from '@/components/ui/LearningPathCard';
import { Profile, UserSettings } from '@/types/kana';

interface LearningModulesSectionProps {
  profile: Profile;
  hiraganaStats: { learned: number; total: number; avgProficiency: number };
  katakanaStats: { learned: number; total: number; avgProficiency: number };
  settings: UserSettings | null;
  onNavigate: (path: string, isReady?: boolean) => void;
}

const LearningModulesSection: React.FC<LearningModulesSectionProps> = ({
  profile,
  hiraganaStats,
  katakanaStats,
  settings,
  onNavigate
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo mb-4 flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-indigo" />
          Learning Modules
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LearningPathCard
            title="Hiragana Mastery"
            japaneseTitle="ひらがな"
            description="Learn all 46 basic hiragana characters with proper stroke order and pronunciation."
            progress={(hiraganaStats.learned / hiraganaStats.total) * 100}
            isFeatured={profile.learning_level === 'beginner'}
            onClick={() => onNavigate('/kana-learning', true)}
          />
          
          <LearningPathCard
            title="Katakana Essentials"
            japaneseTitle="カタカナ"
            description="Master the katakana syllabary used for foreign words and emphasis."
            progress={(katakanaStats.learned / katakanaStats.total) * 100}
            onClick={() => onNavigate('/kana-learning?type=katakana', true)}
          />
          
          <LearningPathCard
            title="Basic Kanji"
            japaneseTitle="漢字"
            description="Learn your first 100 essential kanji characters with readings and example words."
            progress={settings?.prior_knowledge === 'basic_kanji' ? 30 : 0}
            onClick={() => onNavigate('/kanji-basics')}
          />
        </div>
      </div>
    </div>
  );
};

export default LearningModulesSection;
