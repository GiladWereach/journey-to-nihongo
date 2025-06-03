
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  Clock, 
  Brain, 
  TrendingUp, 
  Calendar,
  Star,
  Zap,
  Award,
  BarChart3
} from 'lucide-react';
import { enhancedCharacterProgressService, EnhancedUserKanaProgress, MasteryStats } from '@/services/enhancedCharacterProgressService';
import { kanaService } from '@/services/kanaService';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

const EnhancedProgress: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [progressData, setProgressData] = useState<EnhancedUserKanaProgress[]>([]);
  const [hiraganaStats, setHiraganaStats] = useState<MasteryStats | null>(null);
  const [katakanaStats, setKatakanaStats] = useState<MasteryStats | null>(null);
  const [overallStats, setOverallStats] = useState<MasteryStats | null>(null);

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load enhanced progress data
      const progress = await enhancedCharacterProgressService.getEnhancedCharacterProgress(user.id);
      setProgressData(progress);

      // Load mastery statistics
      const hiragana = await enhancedCharacterProgressService.calculateMasteryStats(user.id, 'hiragana');
      const katakana = await enhancedCharacterProgressService.calculateMasteryStats(user.id, 'katakana');
      const overall = await enhancedCharacterProgressService.calculateMasteryStats(user.id);

      setHiraganaStats(hiragana);
      setKatakanaStats(katakana);
      setOverallStats(overall);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMasteryStageColor = (stage: number): string => {
    switch (stage) {
      case 0: return 'bg-gray-500';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-indigo-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getMasteryStageLabel = (stage: number): string => {
    switch (stage) {
      case 0: return 'New';
      case 1: return 'Learning';
      case 2: return 'Familiar';
      case 3: return 'Practiced';
      case 4: return 'Reliable';
      case 5: return 'Mastered';
      default: return 'Unknown';
    }
  };

  const getTopPerformers = (): EnhancedUserKanaProgress[] => {
    return [...progressData]
      .filter(p => p.confidence_score > 0)
      .sort((a, b) => b.confidence_score - a.confidence_score)
      .slice(0, 10);
  };

  const getChallengingCharacters = (): EnhancedUserKanaProgress[] => {
    return [...progressData]
      .filter(p => p.total_practice_count > 2 && p.confidence_score < 70)
      .sort((a, b) => a.confidence_score - b.confidence_score)
      .slice(0, 10);
  };

  const getRecentlyPracticed = (): EnhancedUserKanaProgress[] => {
    return [...progressData]
      .sort((a, b) => new Date(b.last_practiced).getTime() - new Date(a.last_practiced).getTime())
      .slice(0, 10);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sign in to view your progress</h2>
          <p className="text-gray-600">Create an account to track your Japanese learning journey.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Progress</h1>
        <p className="text-gray-600">Track your Japanese character mastery journey</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
          <TabsTrigger value="katakana">Katakana</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overall Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Characters Learned</p>
                    <p className="text-2xl font-bold">{overallStats?.total || 0}</p>
                  </div>
                  <Brain className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Mastered</p>
                    <p className="text-2xl font-bold">{overallStats?.mastered || 0}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Confidence</p>
                    <p className="text-2xl font-bold">{overallStats?.averageConfidence || 0}%</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Practice</p>
                    <p className="text-2xl font-bold">
                      {progressData.reduce((sum, p) => sum + p.total_practice_count, 0)}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mastery Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Mastery Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: 0, label: 'New', count: overallStats?.new || 0 },
                  { stage: 1, label: 'Learning', count: overallStats?.learning || 0 },
                  { stage: 2, label: 'Familiar', count: overallStats?.familiar || 0 },
                  { stage: 3, label: 'Practiced', count: overallStats?.practiced || 0 },
                  { stage: 4, label: 'Reliable', count: overallStats?.reliable || 0 },
                  { stage: 5, label: 'Mastered', count: overallStats?.mastered || 0 },
                ].map(({ stage, label, count }) => (
                  <div key={stage} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${getMasteryStageColor(stage)}`}></div>
                      <span className="font-medium">{label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count} characters</span>
                      <Progress 
                        value={(count / Math.max(1, overallStats?.total || 1)) * 100} 
                        className="w-20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hiragana" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Hiragana Progress</h3>
                  <div className="text-3xl font-bold text-matcha mb-2">
                    {hiraganaStats?.total || 0}
                  </div>
                  <p className="text-sm text-gray-600">Characters learned</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Mastered</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {hiraganaStats?.mastered || 0}
                  </div>
                  <p className="text-sm text-gray-600">Fully learned</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Confidence</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {hiraganaStats?.averageConfidence || 0}%
                  </div>
                  <p className="text-sm text-gray-600">Average score</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hiragana character grid would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Hiragana Character Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {progressData
                  .filter(p => p.character_id.startsWith('hiragana'))
                  .map(progress => {
                    const character = kanaService.getAllKana().find(k => k.id === progress.character_id);
                    if (!character) return null;
                    
                    return (
                      <div key={progress.character_id} className="text-center">
                        <div className="bg-white border rounded-lg p-2 hover:shadow-md transition-shadow">
                          <div className="text-2xl mb-1">{character.character}</div>
                          <div className="text-xs text-gray-500 mb-1">{character.romaji}</div>
                          <ProgressIndicator
                            progress={progress.confidence_score}
                            size="sm"
                            color={getMasteryStageColor(progress.mastery_level)}
                            showPercentage={false}
                          />
                          <Badge 
                            variant="secondary" 
                            className="text-xs mt-1"
                          >
                            {getMasteryStageLabel(progress.mastery_level)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="katakana" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Katakana Progress</h3>
                  <div className="text-3xl font-bold text-vermilion mb-2">
                    {katakanaStats?.total || 0}
                  </div>
                  <p className="text-sm text-gray-600">Characters learned</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Mastered</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {katakanaStats?.mastered || 0}
                  </div>
                  <p className="text-sm text-gray-600">Fully learned</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Confidence</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {katakanaStats?.averageConfidence || 0}%
                  </div>
                  <p className="text-sm text-gray-600">Average score</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Katakana character grid */}
          <Card>
            <CardHeader>
              <CardTitle>Katakana Character Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {progressData
                  .filter(p => p.character_id.startsWith('katakana'))
                  .map(progress => {
                    const character = kanaService.getAllKana().find(k => k.id === progress.character_id);
                    if (!character) return null;
                    
                    return (
                      <div key={progress.character_id} className="text-center">
                        <div className="bg-white border rounded-lg p-2 hover:shadow-md transition-shadow">
                          <div className="text-2xl mb-1">{character.character}</div>
                          <div className="text-xs text-gray-500 mb-1">{character.romaji}</div>
                          <ProgressIndicator
                            progress={progress.confidence_score}
                            size="sm"
                            color={getMasteryStageColor(progress.mastery_level)}
                            showPercentage={false}
                          />
                          <Badge 
                            variant="secondary" 
                            className="text-xs mt-1"
                          >
                            {getMasteryStageLabel(progress.mastery_level)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getTopPerformers().map((progress, index) => {
                    const character = kanaService.getAllKana().find(k => k.id === progress.character_id);
                    if (!character) return null;
                    
                    return (
                      <div key={progress.character_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{character.character}</div>
                          <div>
                            <div className="font-medium">{character.romaji}</div>
                            <div className="text-sm text-gray-500">
                              {getMasteryStageLabel(progress.mastery_level)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{progress.confidence_score}%</div>
                          <div className="text-xs text-gray-500">
                            {progress.total_practice_count} practices
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Challenging Characters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-red-500" />
                  Needs Practice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getChallengingCharacters().map((progress, index) => {
                    const character = kanaService.getAllKana().find(k => k.id === progress.character_id);
                    if (!character) return null;
                    
                    return (
                      <div key={progress.character_id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{character.character}</div>
                          <div>
                            <div className="font-medium">{character.romaji}</div>
                            <div className="text-sm text-gray-500">
                              {progress.mistake_count} mistakes
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600">{progress.confidence_score}%</div>
                          <div className="text-xs text-gray-500">
                            {progress.total_practice_count} practices
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                {getRecentlyPracticed().map((progress, index) => {
                  const character = kanaService.getAllKana().find(k => k.id === progress.character_id);
                  if (!character) return null;
                  
                  return (
                    <div key={progress.character_id} className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-2xl mb-1">{character.character}</div>
                      <div className="text-sm font-medium">{character.romaji}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(progress.last_practiced).toLocaleDateString()}
                      </div>
                      <ProgressIndicator
                        progress={progress.confidence_score}
                        size="sm"
                        color={getMasteryStageColor(progress.mastery_level)}
                        showPercentage={false}
                        className="mt-2"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedProgress;
