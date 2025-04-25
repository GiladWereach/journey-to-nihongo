
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Award, TrendingUp, Clock, Medal, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ProgressIndicator from '@/components/ui/ProgressIndicator';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import { UserKanaProgress } from '@/types/kana';

interface ProgressStatsTabProps {
  user: any;
  isLoadingProgress: boolean;
  userProgress: UserKanaProgress[];
  hiragana: any[];
  katakana: any[];
  allKana: any[];
  overallProgress: {
    all: number;
    hiragana: number;
    katakana: number;
  };
  calculateProficiencyLevel: (proficiency: number) => 'beginner' | 'intermediate' | 'advanced' | 'mastered';
  calculateMasteryPercentage: (type: 'hiragana' | 'katakana' | 'all') => number;
  getMostChallenging: () => UserKanaProgress[];
  getMostPracticed: () => UserKanaProgress[];
  getMostRecentlyPracticed: () => UserKanaProgress[];
  setActiveTab: (tab: string) => void;
}

const ProgressStatsTab: React.FC<ProgressStatsTabProps> = ({
  user,
  isLoadingProgress,
  userProgress,
  hiragana,
  katakana,
  allKana,
  overallProgress,
  calculateProficiencyLevel,
  calculateMasteryPercentage,
  getMostChallenging,
  getMostPracticed,
  getMostRecentlyPracticed,
  setActiveTab
}) => {
  if (!user) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold mb-2">Sign in to Track Progress</h3>
        <p className="text-gray-600 mb-6">Create an account to save your learning progress.</p>
        <Link to="/auth">
          <Button className="bg-indigo hover:bg-indigo/90">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoadingProgress) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
      </div>
    );
  }

  if (userProgress.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
        <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Progress Data Yet</h3>
        <p className="text-gray-600 mb-6">Start learning and practicing kana to build your proficiency.</p>
        <Button
          onClick={() => setActiveTab('learn')}
          className="bg-indigo hover:bg-indigo/90"
        >
          Start Learning
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-indigo text-center">Your Learning Progress</h2>
      
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo" />
                <CardTitle className="text-lg">Overall Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo mb-2">
                {overallProgress.all.toFixed(0)}%
              </div>
              <ProgressIndicator 
                progress={overallProgress.all} 
                size="md" 
                color="bg-indigo"
                showTicks
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Mastered Characters</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {calculateMasteryPercentage('all').toFixed(0)}%
              </div>
              <ProgressIndicator 
                progress={calculateMasteryPercentage('all')} 
                size="md" 
                color="bg-green-500"
                showTicks
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Practice History</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {userProgress.reduce((sum, item) => sum + item.total_practice_count, 0)}
              </div>
              <div className="text-sm text-gray-500">
                Total practice interactions
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <JapaneseCharacter character="あ" size="sm" color="text-matcha" />
                  <CardTitle className="text-lg text-matcha">Hiragana</CardTitle>
                </div>
                <span className="text-sm bg-matcha/10 text-matcha px-2 py-1 rounded-full">
                  {userProgress.filter(p => 
                    hiragana.some(k => k.id === p.character_id) && p.proficiency >= 90
                  ).length}/{hiragana.length} Mastered
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressIndicator 
                progress={overallProgress.hiragana} 
                size="md" 
                color="bg-matcha" 
                showPercentage
                showTicks
                proficiencyLevel={calculateProficiencyLevel(overallProgress.hiragana)}
                showLabel
              />
              
              <div className="grid grid-cols-5 gap-2 mt-4">
                {hiragana.slice(0, 10).map(kana => {
                  const progress = userProgress.find(p => p.character_id === kana.id);
                  const proficiency = progress ? progress.proficiency : 0;
                  
                  return (
                    <div 
                      key={kana.id} 
                      className={cn(
                        "aspect-square flex flex-col items-center justify-center rounded-lg border text-center",
                        proficiency >= 90 ? "border-green-300 bg-green-50" :
                        proficiency >= 70 ? "border-blue-300 bg-blue-50" :
                        proficiency >= 40 ? "border-yellow-300 bg-yellow-50" :
                        proficiency > 0 ? "border-red-300 bg-red-50" : 
                        "border-gray-200 bg-gray-50"
                      )}
                    >
                      <div className="text-xl">{kana.character}</div>
                      <div className="text-xs mt-1">
                        {proficiency > 0 ? `${proficiency}%` : "New"}
                      </div>
                    </div>
                  );
                })}
                {hiragana.length > 10 && (
                  <div className="aspect-square flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                    <span className="text-gray-400">+{hiragana.length - 10}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <JapaneseCharacter character="ア" size="sm" color="text-vermilion" />
                  <CardTitle className="text-lg text-vermilion">Katakana</CardTitle>
                </div>
                <span className="text-sm bg-vermilion/10 text-vermilion px-2 py-1 rounded-full">
                  {userProgress.filter(p => 
                    katakana.some(k => k.id === p.character_id) && p.proficiency >= 90
                  ).length}/{katakana.length} Mastered
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressIndicator 
                progress={overallProgress.katakana} 
                size="md" 
                color="bg-vermilion" 
                showPercentage
                showTicks
                proficiencyLevel={calculateProficiencyLevel(overallProgress.katakana)}
                showLabel
              />
              
              <div className="grid grid-cols-5 gap-2 mt-4">
                {katakana.slice(0, 10).map(kana => {
                  const progress = userProgress.find(p => p.character_id === kana.id);
                  const proficiency = progress ? progress.proficiency : 0;
                  
                  return (
                    <div 
                      key={kana.id} 
                      className={cn(
                        "aspect-square flex flex-col items-center justify-center rounded-lg border text-center",
                        proficiency >= 90 ? "border-green-300 bg-green-50" :
                        proficiency >= 70 ? "border-blue-300 bg-blue-50" :
                        proficiency >= 40 ? "border-yellow-300 bg-yellow-50" :
                        proficiency > 0 ? "border-red-300 bg-red-50" : 
                        "border-gray-200 bg-gray-50"
                      )}
                    >
                      <div className="text-xl">{kana.character}</div>
                      <div className="text-xs mt-1">
                        {proficiency > 0 ? `${proficiency}%` : "New"}
                      </div>
                    </div>
                  );
                })}
                {katakana.length > 10 && (
                  <div className="aspect-square flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                    <span className="text-gray-400">+{katakana.length - 10}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Medal className="h-5 w-5 text-amber-500" />
                Most Practiced Characters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getMostPracticed().map(progress => {
                  const kana = allKana.find(k => k.id === progress.character_id);
                  if (!kana) return null;
                  
                  return (
                    <div key={progress.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-white border rounded-full h-10 w-10 flex items-center justify-center">
                          <span className="text-lg japanese-text">{kana.character}</span>
                        </div>
                        <div>
                          <div className="font-medium">{kana.romaji}</div>
                          <div className="text-xs text-gray-500">{kana.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{progress.total_practice_count} times</div>
                        <div className="text-xs text-gray-500">{progress.proficiency}% proficiency</div>
                      </div>
                    </div>
                  );
                })}
                
                {getMostPracticed().length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>No practice data yet.</p>
                    <p className="text-sm">Start practicing to see stats!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-rose-500" />
                Challenging Characters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getMostChallenging().map(progress => {
                  const kana = allKana.find(k => k.id === progress.character_id);
                  if (!kana) return null;
                  
                  return (
                    <div key={progress.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`border rounded-full h-10 w-10 flex items-center justify-center ${
                          progress.proficiency < 40 ? 'bg-red-50 border-red-200' : 'bg-white'
                        }`}>
                          <span className="text-lg japanese-text">{kana.character}</span>
                        </div>
                        <div>
                          <div className="font-medium">{kana.romaji}</div>
                          <div className="text-xs text-gray-500">{kana.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-red-500">{progress.proficiency}%</div>
                        <div className="text-xs text-gray-500">
                          {progress.mistake_count} mistakes / {progress.total_practice_count} tries
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {getMostChallenging().length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>No challenging characters yet.</p>
                    <p className="text-sm">Keep practicing to identify your weak points!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressStatsTab;
